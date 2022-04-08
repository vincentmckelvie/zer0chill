import {
	Object3D,
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	PerspectiveCamera,
	Vector2,
	Euler
} from 'three';
import { Capsule } from './scripts/jsm/math/Capsule.js';
import { Weapon } from './Weapon.js';
import { Hud } from './Hud.js';
import { FPSAni } from './FPSAni.js';

class Player {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		const self = this;
		this.hud = new Hud();
		this.state = "alive";
		this.life = 100;
		this.hud.updateHealth(100);
		this.hud.updateBoost(1);
		//this.camera = OBJ.camera;
		this.camera = appGlobal.controller.playerCamera;
		this.defaultFOV = 90;
		this.camera.fov = this.defaultFOV;
		this.camera.updateProjectionMatrix();
		
		this.boostMult = 1;
		this.boostMultMax = 1.8;
		this.speedMult = .8;
		this.dampingMult = 14;
		this.ogPlayerHeight = 2;
		this.crouching = false;
		this.playerHeight = this.ogPlayerHeight;
		this.strafeMult = .3;
		this.inAirControlMult = .02;

		this.vector1 = new Vector3();
		this.vector2 = new Vector3();
		this.vector3 = new Vector3();
		this.playerDirection = new Vector3();
		this.playerOnFloor = false;
		
		this.boostMeter = 1;
		this.boosting = false;
		this.directionalBoostMult = 0;
		const pos = new Vector3();
		pos.x = -1+Math.random()*2;
		pos.y = -1+Math.random()*2;
		pos.z = -1+Math.random()*2;
		//pos.y = 1;
		const end = new Vector3().copy(pos);
		pos.multiplyScalar(appGlobal.worldScale*6);

		this.grav = new Vector3().copy(pos).sub(new Vector3()).normalize();
		const n = new Vector3().copy(pos).add( this.grav.multiplyScalar(this.playerHeight) );
		
		this.playerCollider = new Capsule( pos, n, 1.35 );

		this.playerVelocity = new Vector3();
		this.playerDirection = new Vector3();

		this.playerOnFloor = false;
		
		this.tpsAni;
		this.didTpsAni = false;
		this.firstLand = false;
		this.boostCamDir = new Vector3();
		
		this.lookAt = new Object3D();
		this.lookAtRef = new Object3D();
		this.worldPosEase = new Vector3();
		this.rotOffset = new Object3D();
		this.xRot = new Object3D();

		const geo = new BoxGeometry(1,2,1);
		const mat = new MeshStandardMaterial({color:0xff0000});
		this.mesh = new Mesh(geo,mat);
		this.mesh.visible = false;
		this.playerRotationHelper = new Object3D(); 
		appGlobal.scene.add(this.lookAt, this.lookAtRef);
		this.lookAt.add(this.rotOffset);
		
		this.lookAt.add(this.rotOffset)
		//this.mesh.position.y-=1.5;
		this.mesh.position.z -=5;
		//this.playerRotationHelper.position.y = -1.5;
		this.rotOffset.add(this.xRot);

		this.xRot.add(appGlobal.controller.playerCamera);
		//this.xRot.add(this.mesh);
		appGlobal.controller.playerCamera.add(this.mesh)
		this.xRot.add(this.playerRotationHelper)

		this.camDist = 5;
		OBJ.weapon.player = this;
		this.weapon = new Weapon(OBJ.weapon);
		//this.ability = new OBJ.weapon.abilities.class(OBJ.weapon.ability);
		this.abilities = [];
		for(let i = 0; i<OBJ.weapon.abilities.length; i++){
			this.abilities.push(new OBJ.weapon.abilities[i].class(OBJ.weapon.abilities[i]) );
		}
		
		this.abilities.push(new OBJ.movement.class(OBJ.movement));

		this.movementAbilityName = OBJ.movement.name; 
	
		this.fovAni = null;
		this.reloadOT = false;
		this.adsing = false;
		this.remoteQuaternion = new Quaternion();
		this.canBoost = false;
		this.boostButtonDown = false;
		//this.straffing = false;
		//this.movingForward = false;
		this.axisY = 0;
		this.axisX = 0;
		this.keys = {
			A:false,
			D:false,
			W:false,
			S:false
		}

		this.abilityMult = 1;
		this.id = socket.id;
		this.jumpCount = 0;
		this.canDoubleJump = false;
		this.releasedSpaceBarAfterJump = false;
		this.canBlink = false;
		this.blinking = false;
		this.blinkTarg = new Vector3();
	
		this.animationObject = { 
			yAxis:0, 
			xAxis:0, 
			jump:true,
			boost:false,
			adsing:false,
		}
		
		//this.gravRotationEase = .005;
		this.gravRotationEase = .005;
		this.abilityCanShoot = true;
		this.hitWorldWhenNotChecking = false;
		this.fps = new FPSAni({model:OBJ.weapon.model, name:OBJ.weapon.name});
		this.adsMouseSenseMultTarg = 0;
		this.adsMouseSenseMult = 0;

		this.canDoWalkSound = true;
		this.currStep = 0;
		this.stepsTimeout;
		this.ability1KeyDownOT = false;
		this.ability2KeyDownOT = false;
		
		appGlobal.world = this.getClosestWorld();
		//this.hitGrav = new Vector3();
		//this.grappling = false;
		//this.canGrapple = false;
		//this.currentWorldIndex = 0;
		//this.outlinedWorld;
		//this.outlinedPoint = new Vector3();
	}

	

	update(){
		this.updateNonLooped();
		for ( let i = 0; i < appGlobal.STEPS_PER_FRAME; i ++ ) {
			this.updateLooped();
			//updateSpheres( appGlobal.deltaTime );
		}
		
	}
	updateLooped(){
		switch(this.state){
			case "alive":
				this.updateControls();
				this.updatePlayerPositionAndRotation();
				this.weapon.update();
			break;
			case "dead":
			break;
		}

	}
	updateNonLooped(){
		
		this.fps.update();
		this.animationObject = {
			yAxis:this.axisY, 
			xAxis:this.axisX,
			jump:!this.playerOnFloor,
			boost:this.boosting,
			adsing:this.adsing
		}

		switch(this.state){
			case "alive":
				//this.updateOutline();
				for(let i = 0; i<this.abilities.length; i++){
					this.abilities[i].update();	
				}
				this.handleBoost();
				this.handleADSModify();
			break;
			case "dead":
			break;
		}

		const moving = (Math.abs(this.axisX) > 0 || Math.abs(this.axisY)>0); 
		if(moving && this.playerOnFloor){
			//this.playerMovingForWalkSound = true;
			if(this.canDoWalkSound){
				this.initWalkSound();
			}
		}
		

	}

	initWalkSound(){
		
		this.canDoWalkSound = false;
		this.currStep ++;
		this.currStep = this.currStep % 2;
		appGlobal.soundHandler.playSoundByName({name:"step-"+this.currStep, dist:.7});
		
		if(this.stepsTimeout != null){
			clearInterval(this.stepsTimeout);
		}
		
		const self = this;
		this.stepsTimeout = setInterval(function(){
			self.canDoWalkSound = true;
		},330);
	}

	handleADSModify(){
		if(this.adsing){
			this.adsMouseSenseMultTarg = 1.0;
		}else{
			this.adsMouseSenseMultTarg = 0.0;
		}
		this.adsMouseSenseMult += (this.adsMouseSenseMultTarg - this.adsMouseSenseMult)*(appGlobal.deltaTime*200);
	}
	
	receiveDamage(OBJ){
		appGlobal.soundHandler.playSoundByName({name:"dmg", dist:1});
		const camForward =  new Vector3().copy(this.getCameraForwardVector());
		const attacker = new Vector3().copy(OBJ.position).sub(this.playerCollider.end).normalize();
		
		const q1 = new Quaternion().setFromUnitVectors( new Vector3(0,0,1), camForward );
		const q2 = new Quaternion().setFromUnitVectors( new Vector3(0,0,1), attacker );
		
		const v1 = new Euler().setFromQuaternion (q1);
		const v2 = new Euler().setFromQuaternion (q2);	
		
		const angle = (v2.x-v1.x)+Math.PI;
		this.hud.doIncomingDamageMarker( (angle*-1) );

		this.life = OBJ.health;
		this.hud.updateHealth(this.life);
		if(this.life <=0 ){
			this.kill();
		}
	}

	heal(OBJ){
		this.life = OBJ.health;
		//if(this.life>100)
			//this.life = 100;
		this.hud.updateHealth(this.life);
	}

	kill() {
		if(this.state == "alive"){
			this.state = "dead";
			for(let i = 0; i<this.abilities.length; i++){
				this.abilities[i].kill();	
			}
			this.fps.kill();
			appGlobal.playing = false;
			appGlobal.globalHelperFunctions.playerReset(socket.id, true);
			
			if(this.stepsTimeout != null){
				clearInterval(this.stepsTimeout);
			}
			this.canDoWalkSound = false;
		}
	}

	doTPSAni(doTPS){
		if(this.tpsAni!=null){
			this.tpsAni.kill();
		}

		if(doTPS){

			//this.mesh.visible = true;
			this.adsing = false;
			//this.tpsAni = gsap.to(this,{duration:.3, camDist:5, ease: "circ.out()", delay:0});
			if(this.fovAni!=null){
				this.fovAni.kill();
			}
			const self = this;
			this.fovAni = gsap.to(this.camera,{duration:.3, fov:120, ease: "circ.out()", delay:0, onUpdate:function(){
				self.camera.updateProjectionMatrix();
			}});

		}else{

			//this.mesh.visible = false;
			//this.tpsAni = gsap.to(this,{duration:.6, camDist:0, ease: "circ.out()", delay:0});
			if(this.fovAni!=null){
				this.fovAni.kill();
			}
			const self = this;
			this.fovAni = gsap.to(this.camera,{duration:.6, fov:this.defaultFOV, ease: "circ.out()", delay:0, onUpdate:function(){
				self.camera.updateProjectionMatrix();
			}});
		}
	}

	knockPlayer(OBJ){
		const dist = Math.abs(new Vector3().copy(this.playerCollider.start).distanceTo(OBJ.pos));
		
		if(dist<OBJ.distance){
			const s = (OBJ.distance-dist)/OBJ.distance;
			//const center = this.vector1.addVectors( this.playerCollider.start, this.playerCollider.end ).multiplyScalar( 0.5 );
			const disp = new Vector3().copy(this.playerCollider.start).sub(OBJ.pos).add(this.grav.multiplyScalar(OBJ.gravMult)).normalize().multiplyScalar(s*OBJ.strength);
			this.playerVelocity.add( disp );
			this.playerOnFloor = false;
		}
	}

	handleKeyUp(key){
		for(let i = 0; i<this.abilities.length; i++){
			this.abilities[i].handleKeyUp(key);	
		}
		if(key=="KeyA"){
			if(!this.keys.D){
				this.axisX = 0;
			}else{
				this.axisX = 1;
			}
			this.keys.A = false;	
		}
		
		if(key=="KeyD"){
			if(!this.keys.A){
				this.axisX = 0;
			}else{
				this.axisX = -1;
			}
			this.keys.D = false;
		}
		
		if(key=="KeyW"){
			if(!this.keys.S){
				this.axisY = 0;
			}else{
				this.axisY = -1;
			}
			this.keys.W = false;
		}	
		
		if(key=="KeyS"){
			if(!this.keys.W){
				this.axisY = 0;
			}else{
				this.axisY = 1;
			}
			this.keys.S = false;
		}
		
		if ( key == 'KeyR' ) {
			this.reloadOT = false;
		}

		if ( key == 'Space' ) {
			if(this.canDoubleJump && !this.releasedSpaceBarAfterJump){
				this.releasedSpaceBarAfterJump = true;
			}
		}

		// if(key=="ControlLeft"){
		// 	this.crouching = false;
		// 	this.playerHeight = this.ogPlayerHeight;
		// }

	}
	
	handleGamePad(OBJ){

		this.axisX = OBJ.xaxis;
		this.axisY = OBJ.yaxis*-1;

		this.updateCameraRotation({mx:OBJ.mx*4, my:OBJ.my*4});
		
		if(OBJ.ability1){
			if(!this.ability1KeyDownOT){
				const key = "KeyE"
				for(let i = 0; i<this.abilities.length; i++){
					this.abilities[i].handleKeyDown(key);
				}
				this.ability1KeyDownOT = true;
			}
		}else{
			const key = "KeyE"
			for(let i = 0; i<this.abilities.length; i++){
				this.abilities[i].handleKeyUp(key);	
			}
			this.ability1KeyDownOT = false;
		}

		if(OBJ.ability2){
			if(!this.ability2KeyDownOT){
			
				const key = "KeyQ"
				for(let i = 0; i<this.abilities.length; i++){
					this.abilities[i].handleKeyDown(key);	
				}
				this.ability2KeyDownOT = true;
			}
		}else{
			const key = "KeyQ"
			for(let i = 0; i<this.abilities.length; i++){
				this.abilities[i].handleKeyUp(key);	
			}
			this.ability2KeyDownOT = false;
		}
		
		this.ads(OBJ.ads);
		appGlobal.mouse.down = OBJ.shoot;
		
		appGlobal.keyStates[ 'KeyW' ] = this.keys.W = OBJ.w;
		appGlobal.keyStates[ 'KeyS' ] = this.keys.S = OBJ.s;
		appGlobal.keyStates[ 'KeyA' ] = this.keys.A = OBJ.a;
		appGlobal.keyStates[ 'KeyD' ] = this.keys.D = OBJ.d;

		appGlobal.keyStates[ 'ShiftLeft' ] = OBJ.boost;
		if(OBJ.boost){
			this.handleBlinkKeyPress();
		}
		appGlobal.keyStates[ 'Space' ] = OBJ.jump;

		if(OBJ.reload){
			this.handleReloadKeyPress();
		}else{
			this.reloadOT = false;
		}

	}

	handleKeyDown(key){
		for(let i = 0; i<this.abilities.length; i++){
			this.abilities[i].handleKeyDown(key);	
		}

		if(key=="KeyD"){
			this.axisX = 1;
			this.keys.D = true;
		}
		
		if(key=="KeyA"){
			this.axisX = -1;
			this.keys.A = true;
		}
		
		if(key=="KeyW"){
			this.axisY = 1;
			this.keys.W = true;
		}
		
		if(key=="KeyS"){
			this.axisY = -1;
			this.keys.S = true;
		}

		if ( key == 'KeyR') {
			this.handleReloadKeyPress();
		}
		if(key == 'ShiftLeft'){
			this.handleBlinkKeyPress();
		}
	}


	handleReloadKeyPress(){
		if(!this.reloadOT){
			this.weapon.reload();
			this.reloadOT = true;
		}
	}


	handleBlinkKeyPress(){
		if(this.canBlink && !this.boosting && !this.keys.W){
			if( this.keys.A || this.keys.D ){
			
				this.blinkTarg = new Vector3().clone(this.playerCollider.end);
				this.blinkTarg.add( this.getSideVector().multiplyScalar((this.axisX*.08)) );
				gsap.to(this.blinkTarg, {duration:.5, x:0, y:0, z:0, ease: "circ.out()", delay:0});
				this.canBlink = false;
				for(let i = 0; i<this.abilities.length; i++){
					if(this.abilities[i].name == "blink"){
						this.abilities[i].confirmAbility();
					}
					
				}
				
			}else if(this.keys.S){
				this.blinkTarg = new Vector3().clone(this.playerCollider.end);
				this.blinkTarg.add( this.getForwardVector().multiplyScalar((this.axisY*.08)) );
				gsap.to(this.blinkTarg, {duration:.5, x:0, y:0, z:0, ease: "circ.out()", delay:0});
				this.canBlink = false;
				for(let i = 0; i<this.abilities.length; i++){
					if(this.abilities[i].name == "blink"){
						this.abilities[i].confirmAbility();
					}	
				}
			}
		}
	}

	
	

	handleDoDamage(){
		appGlobal.soundHandler.playSoundByName({name:"hit", dist:1});
		this.hud.doDamageMarker();
	}

	updateControls(){
		
		this.playerRotationHelper.getWorldQuaternion(this.remoteQuaternion);
		
		if(this.firstLand){
			if ( appGlobal.keyStates[ 'ShiftLeft' ] && appGlobal.keyStates[ 'KeyW' ] && this.canBoost ) {
				this.initBoost();
			}
			if( !appGlobal.keyStates[ 'ShiftLeft' ] || !appGlobal.keyStates[ 'KeyW' ] ){
				this.cancelBoost();
			}
			this.boostButtonDown = appGlobal.keyStates[ 'ShiftLeft' ] 
		}	
		if(!this.canDoubleJump){
			if ( this.playerOnFloor ) {
				if ( appGlobal.keyStates[ 'Space' ] ) {
					this.playerVelocity.add( this.grav.multiplyScalar(10) );
				}
			}
		}else{
			if ( this.playerOnFloor ) {
				if ( appGlobal.keyStates[ 'Space' ] ) {
					this.releasedSpaceBarAfterJump = false;
					this.jumpCount ++;
					this.playerVelocity.add( this.grav.multiplyScalar(10) );
				}
			}else{
				if ( appGlobal.keyStates[ 'Space' ] && this.releasedSpaceBarAfterJump && this.jumpCount < 2 ) {
					this.playerVelocity.set( 0,0,0 );
					this.playerVelocity.add( this.grav.multiplyScalar(10) );
					for(let i = 0; i<this.abilities.length; i++){
						if(this.abilities[i].name == "double jump"){
							this.abilities[i].confirmAbility();
						}
					}
					this.jumpCount ++;
				}
				
			}

		}
	}
	
	handleBoost(){

		if(this.boosting){
			
			this.boostMeter -= (appGlobal.deltaTime*(2.7*this.abilityMult));
		
			if(this.boostMeter<0){
				this.boostMeter = 0;
				this.boosting = false;
				this.canBoost = false;
				this.cancelBoost();
			}

		}else{

			this.boostMeter += (appGlobal.deltaTime*(1.35));
			
			if(this.boostMeter>1){
				this.boostMeter = 1;
			}
			
		}

		if( !this.boostButtonDown ){
			if(!this.canBoost){
				if(this.boostMeter>.25){
					this.canBoost = true;
				}
			}
		}

		this.hud.updateBoost(this.boostMeter);

	}

	initBoost(){
		
		if(this.didTpsAni){	
			appGlobal.soundHandler.playSoundByName({name:"boost", dist:1});
			this.doTPSAni(true);
			this.didTpsAni = false;
		}
		this.boostMult = this.boostMultMax;
		this.boosting = true;
		this.fps.toggleBoost(true);
	}

	cancelBoost(){
		if(!this.didTpsAni){
			this.doTPSAni(false);
			this.didTpsAni = true;
		}
		this.fps.toggleBoost(false);
		this.boostMult = 1;
		this.boosting = false;
	}

	getForwardVector() {
		this.playerRotationHelper.getWorldDirection( this.playerDirection );
		this.playerDirection.normalize().negate();
		return this.playerDirection;
	}

	getCameraForwardVector(){
		appGlobal.controller.playerCamera.getWorldDirection( this.playerDirection );
		this.playerDirection.normalize();
		return this.playerDirection;
	}

	getSideVector() {
		this.playerRotationHelper.getWorldDirection( this.playerDirection );
		this.playerDirection.normalize().negate();
		this.playerDirection.cross( this.grav );
		return this.playerDirection;
	}
	getBoostForwardVector(){
		appGlobal.controller.camera.getWorldDirection(this.boostCamDir);
		this.boostCamDir.normalize();
		return this.boostCamDir;
	}

	playerCollisions() {

		const result = appGlobal.worldOctree.capsuleIntersect( this.playerCollider );

		this.playerOnFloor = false;

		if ( result ) {

			this.playerOnFloor = true;
			//this.playerOnFloor = result.normal.y > 0;

			// if ( ! this.playerOnFloor ) {

			// 	playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );

			// }
			//this.hitGrav.copy(result.normal);
			this.playerCollider.translate( result.normal.multiplyScalar( result.depth ) );

		}

	}			


	playerWorldCollision(world) {
		//this.playerCollisions();

		/*
		const center = this.vector1.addVectors( this.playerCollider.start, this.playerCollider.end ).multiplyScalar( 0.5 );

		const sphere_center = appGlobal.world.collider.center;

		const r = this.playerCollider.radius + appGlobal.world.collider.radius;
		const r2 = r * r;
		this.playerOnFloor = false;
		for ( const point of [ this.playerCollider.start, this.playerCollider.end, center ] ) {
		//for ( const point of [ this.playerCollider.start ] ) {
			const d2 = point.distanceToSquared( sphere_center );
			if ( d2 < r2 ) {
				const normal = this.vector1.subVectors( point, sphere_center ).normalize();
				this.playerOnFloor = true;
				this.playerVelocity.addScaledVector( normal, -normal.dot( this.playerVelocity ) );
				//this.playerCollider.translate( deltaPosition.add(this.blinkTarg) );
		
				//playerCollider.translate( normal.multiplyScalar( 1 ) );
			}	
		}

		*/
	}	

	getClosestWorld(){

		let lowestDist = 1000000;
		let currClosest = null;
		for(let i = 0; i<appGlobal.worlds.length; i++){
			const center = this.vector1.addVectors( this.playerCollider.start, this.playerCollider.end ).multiplyScalar( 0.5 );

			const sphere_center = appGlobal.worlds[i].collider.center;

			const r = this.playerCollider.radius + appGlobal.worlds[i].collider.radius;
			const r2 = r * r;
			
			const d2 = this.playerCollider.start.distanceToSquared( sphere_center );
			//const d2 = this.playerCollider.end.distanceToSquared( sphere_center );
			
			//if ( d2 < r2 ) {
			
			const total = d2-r2;
			
			if ( total < lowestDist ) {

				lowestDist = total;
				currClosest = appGlobal.worlds[i];
			
			}
		}

		for(let i = 0; i<this.abilities.length; i++){
			this.abilities[i].updateClosestWorldIndex(currClosest.index);
		}
		//this.ability.updateClosestWorldIndex(currClosest.index);
		//this.currentWorldIndex = currClosest.index;
		return currClosest;

	}

	checkCanSetClosestWorld(){
		
		if(this.movementAbilityName == "directional boost"){
			
			if(this.boostAndGravWorldCollisionHelper(1.5)){
				return true;
			}
			
			if(this.boosting){
				return false;
			}

		}else if(this.movementAbilityName == "planet switch"){

			if(this.abilitiesCanSelectClosestWorld() && this.boostAndGravWorldCollisionHelper(1.0))
			//if( this.abilitiesCanSelectClosestWorld()  )
				return true;

		}else if(this.movementAbilityName == "teleport"){
			return true;
		}

		
		return false;
	}


	abilitiesCanSelectClosestWorld(){
		for(let i = 0; i<this.abilities.length; i++){
			if(! this.abilities[i].canSetClosestWorld )
				return false;	
		}
		
		return true;
	}


	boostAndGravWorldCollisionHelper(RADMULT){
		
		for(let i = 0; i<appGlobal.worlds.length; i++){
			const world = appGlobal.worlds[i]
			const center = this.vector1.addVectors( this.playerCollider.start, this.playerCollider.end ).multiplyScalar( 0.5 );

			const sphere_center = world.collider.center;

			const r = (this.playerCollider.radius) + (world.collider.radius*RADMULT);
			const r2 = r * r;
			//this.playerOnFloor = false;
			for ( const point of [ this.playerCollider.start, this.playerCollider.end, center ] ) {
			//for ( const point of [ this.playerCollider.start ] ) {
				const d2 = point.distanceToSquared( sphere_center );
				if ( d2 < r2 ) {
					return true;
					//playerCollider.translate( normal.multiplyScalar( 1 ) );
				}	
			}

		}
		return false;
	
	}


	updatePlayerPositionAndRotation() {

		//this.camera.position.z = this.camDist;
		
		let damping = Math.exp( - 4 * appGlobal.deltaTime ) - 1;
		//console.log(damping);

		const start = new Vector3().copy(this.playerCollider.start);
		this.currWorld = appGlobal.world;
		
		//if(this.ability.canSetClosestWorld){
		if(this.checkCanSetClosestWorld()){
			this.hitWorldWhenNotChecking = false;
			//this.playerCollisions();
			appGlobal.world = this.getClosestWorld();
		}else{
			//this.boostAndGravSwitchHelper();
		}
		
		//grav
		//if(!this.playerOnFloor)
			this.grav.lerp(start.sub( appGlobal.world.worldPosition ).normalize(), 1);
		//else
			//this.grav.lerp(this.hitGrav,1);
		//let airControl = this.speedMult*this.boostMult;
		//let airControl = Math.exp(  20 * appGlobal.deltaTime ) * this.speedMult*this.boostMult;
		let airControl = (appGlobal.deltaTime*800)*this.speedMult*this.boostMult;
		
		const boostDir = new Vector3();
		if(this.boosting){
			boostDir.copy(this.getBoostForwardVector()).multiplyScalar((200*this.directionalBoostMult)*appGlobal.deltaTime);
		}

		if ( !this.playerOnFloor ) {
			
			this.playerVelocity.x -= this.grav.x*(appGlobal.gravity*appGlobal.deltaTime);
			this.playerVelocity.y -= this.grav.y*(appGlobal.gravity*appGlobal.deltaTime);
			this.playerVelocity.z -= this.grav.z*(appGlobal.gravity*appGlobal.deltaTime);
			damping *= 0.1;	
			airControl = this.inAirControlMult;

		}else{
			if(!this.firstLand){
				this.doTPSAni(false);
				this.firstLand = true;
				this.canBoost = true;
				this.didTpsAni = true;
				for(let i = 0; i<this.abilities.length; i++){
					this.abilities[i].init();
				}

				//this.ability.init();
				//this.canGrapple = true;
			}

			this.jumpCount = 0;
			for(let i = 0; i<this.abilities.length; i++){
				this.abilities[i].handlePlayerLand();
			}
			//this.ability.handlePlayerLand();
			// if(this.grappling){
			// 	this.canGrapple = true;
			// 	this.grappling = false;
			// }
			damping *= this.dampingMult;
		}
		
		//damping*=2
		
		const end = new Vector3().copy(this.playerCollider.start).add(this.grav.multiplyScalar(this.playerHeight));
		this.playerCollider.end.copy(end);
		
		//this.playerVelocity.addScaledVector( this.playerVelocity, damping );
		
		this.playerVelocity.addScaledVector( this.playerVelocity.add(this.getSideVector().multiplyScalar((this.axisX)*(airControl*this.strafeMult))).add(this.getForwardVector().multiplyScalar(this.axisY*airControl)).add(boostDir) , damping );
		this.playerVelocity.clampLength(0,40);
		
		//const deltaPosition = this.playerVelocity.clone().multiplyScalar( appGlobal.deltaTime );
		const deltaPosition = this.playerVelocity.clone().multiplyScalar( appGlobal.deltaTime );
		this.playerCollider.translate( deltaPosition.add(this.blinkTarg) );
		
		//this.playerWorldCollision();
		this.playerCollisions();
		
		this.lookAt.position.copy( this.playerCollider.end );
		this.lookAtRef.position.copy( this.playerCollider.end );
		
		this.rotOffset.rotation.x = -Math.PI*.5;
			
		this.worldPosEase.lerp(appGlobal.world.worldPosition, this.gravRotationEase);
		//this.lookAtRef.lookAt(appGlobal.world.worldPosition);
		this.lookAtRef.lookAt(this.worldPosEase);

		var lookVec = new Vector3();
		this.lookAtRef.getWorldDirection(lookVec).normalize();

		var rotVec = new Vector3(); 
		this.lookAt.getWorldDirection(rotVec).normalize();
		const q = new Quaternion().setFromUnitVectors( rotVec, lookVec );				
		this.lookAt.applyQuaternion(q);//rotation.apply.copy(q);
		
		//this.mesh.rotation.y=;
	}




	updateMouseMove(event){
		
		this.updateCameraRotation({mx:event.movementX, my:event.movementY})
		
	}

	updateCameraRotation(OBJ){

		let adsValHolder = this.weapon.adsMouseSensMult * appGlobal.settingsParams["adsMouseSenseMult"];
		if(adsValHolder > .95)
			adsValHolder = .95;
		const adsHelper = 1.0 - (adsValHolder  * this.adsMouseSenseMult);

		this.xRot.rotation.y   -= OBJ.mx *(0.005*( appGlobal.settingsParams["mouseSens"] * adsHelper ));
		this.camera.rotation.x -= OBJ.my *(0.005*( appGlobal.settingsParams["mouseSens"] * adsHelper ));
		
		const max = 1.4;
		if(this.camera.rotation.x<-max)this.camera.rotation.x = -max;
		if(this.camera.rotation.x>max)this.camera.rotation.x = max;
		this.playerRotationHelper.rotation.y = this.camera.rotation.y;
	}

	ads(shouldADS){
			
		if(!this.boosting){
			
			this.adsing = shouldADS;
			this.fps.toggleADS(shouldADS);
			
			if(this.fovAni!=null){
				this.fovAni.kill();
			}
			
			const self = this;
			if(shouldADS){
				this.fovAni = gsap.to(this.camera,{duration:.3, fov:this.weapon.zoom, ease: "circ.out()", delay:0, onUpdate:function(){
					self.camera.updateProjectionMatrix();
				}});
			}else{
				this.fovAni = gsap.to(this.camera,{duration:.3, fov:this.defaultFOV, ease: "circ.out()", delay:0, onUpdate:function(){
					self.camera.updateProjectionMatrix();
				}});
			}

		}
		
	}



}

export { Player };
