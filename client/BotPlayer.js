import {
	Object3D,
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	PerspectiveCamera,
	Vector2,
	Euler,
	TextureLoader,
	Color,
	SphereGeometry
} from 'three';
import { Capsule } from './scripts/jsm/math/Capsule.js';
import { BotWeapon } from './BotWeapon.js';
// import { Hud } from './Hud.js';
// import { FPSAni } from './FPSAni.js';
import { clone } from "./scripts/jsm/utils/SkeletonUtils.js"
import { CharacterAnimationHandler } from './CharacterAnimationHandler.js';

class BotPlayer {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		const self = this;
		//this.hud = new Hud();
		this.state = "alive";
		this.life = 100;
		//this.hud.updateHealth(100);
		//this.hud.updateBoost(1);
		//this.camera = OBJ.camera;
		//this.camera = appGlobal.controller.playerCamera;
		//this.defaultFOV = 90;
		//this.camera.fov = this.defaultFOV;
		//this.camera.updateProjectionMatrix();
		
		this.boostMult = 1;
		this.boostMultMax = 1.8;
		this.speedMult = .8;
		this.dampingMult = 14;
		this.ogPlayerHeight = 2;
		//this.crouching = false;
		this.playerHeight = this.ogPlayerHeight;
		this.strafeMult = .3;
		this.inAirControlMult = .02;

		this.vector1 = new Vector3();
		this.vector2 = new Vector3();
		this.vector3 = new Vector3();
		this.playerDirection = new Vector3();
		this.playerOnFloor = false;
		this.animationOnFloor = false;
		
		this.boostMeter = 1;
		//this.boosting = false;
		this.directionalBoostMult = 0;
		this.spawnsInc = 0;
		this.spawns = [];
		self.setSpawns();

		const pos = new Vector3().copy(this.spawns[this.spawnsInc]);
		this.spawnsInc++;
		// pos.x = -1+appGlobal.random()*2;
		// pos.y = -1+appGlobal.random()*2;
		// pos.z = -1+appGlobal.random()*2;
		//pos.y = 1;
		const end = new Vector3().copy(pos);
		pos.multiplyScalar(appGlobal.worldScale*6);

		
		this.grav = new Vector3().copy(pos).sub(new Vector3()).normalize();
		const n = new Vector3().copy(pos).add( this.grav.multiplyScalar(this.playerHeight) );
		
		this.playerCollider = new Capsule( pos, n, 1.35 );

		this.playerVelocity = new Vector3();
		this.playerDirection = new Vector3();
		
		this.tpsAni;
		this.didTpsAni = false;
		this.firstLand = false;
		this.boostCamDir = new Vector3();
		
		this.lookAt = new Object3D();
		this.lookAtRef = new Object3D();
		this.worldPosEase = new Vector3();
		this.rotOffset = new Object3D();
		this.xRot = new Object3D();

		// const geo = new BoxGeometry(1,2,1);
		// const mat = new MeshStandardMaterial({color:0xff0000});
		// this.mesh = new Mesh(geo,mat);
		// this.mesh.visible = true;
		
		this.playerRotationHelper = new Object3D(); 
		appGlobal.scene.add(this.lookAt, this.lookAtRef);
		this.lookAt.add(this.rotOffset);
		
		this.lookAt.add(this.rotOffset)
		//this.mesh.position.y-=1.5;
		//this.mesh.position.z -=5;
		//this.playerRotationHelper.position.y = -1.5;

		const geoS = new BoxGeometry( .1, .1, 3 );
		const matS = new MeshStandardMaterial({ color:0xffff00, visible:true});
	

		const geoS2 = new BoxGeometry( .1, .1, .1 );
		const matS2 = new MeshStandardMaterial({ color:0xff0000, visible:true});
	
		this.rotationSeeker = new Object3D();
		//this.seekerHelper = new Mesh(geoS,matS);
		//this.seekerHelperTip = new Mesh(geoS2,matS2);
		this.seekerHelperTip = new Object3D();//new Mesh(geoS2,matS2);
		//this.rotationSeeker.add(this.seekerHelper);
		this.rotationSeeker.add(this.seekerHelperTip)
		this.seekerHelperTip.position.z = 2;
		//this.seekerHelperTip.position.y = 2;
		//this.seekerHelperTip.position.y = .1;
		//this.seekerHelperTip.position.z = .5;
		this.xRotHelper = new Object3D();
		
		this.xRotHelper.add(this.xRot);
		this.xRot.rotation.x=Math.PI;
		this.xRot.rotation.z=-Math.PI*.5;

		//this.xRot.add(appGlobal.controller.playerCamera);
		//this.xRot.add(this.mesh);
		
		//appGlobal.controller.playerCamera.add(this.mesh)
		this.xRot.add(this.playerRotationHelper)

		this.camDist = 5;
		
		//OBJ.weapon.player = this;
		OBJ.weapon.player = this;
		this.weapon = new BotWeapon(OBJ.weapon);
		//this.ability = new OBJ.weapon.abilities.class(OBJ.weapon.ability);
		this.abilities = [];
		//for(let i = 0; i<OBJ.weapon.abilities.length; i++){
		//this.abilities.push(new AbilityPlanetSwitch( obj.ability) );
		//}
		OBJ.ability.bot = this;
		this.abilities.push(new OBJ.ability.class(OBJ.ability));

		//this.movementAbilityName = OBJ.movement.name; 
		
		this.fovAni = null;
		this.reloadOT = false;
		//this.adsing = false;
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
		this.id = OBJ.id;//socket.id;
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
		
		//this.movement  = clone( self.getModelByName(OBJ.name+"-"+OBJ.movement).scene );
		this.character = clone( self.getModelByName("body-"+OBJ.name).scene );

		const skel = ["spine_01", "spine_02", "neck_01", "head", "clavicle_l", "clavicle_r", "upperarm_r", "upperarm_l","lowerarm_r", "pelvis", "thigh_l", "calf_r", "hand_l"];
		for(let k =0; k<12; k++){

			let name = skel[Math.floor(Math.random()*skel.length)];
			if(k<2)
				name = "head"
			//let name = "spine_01"
			//console.log(name);
			const bone = this.character.getObjectByName(name);
			
			let sze = .01+Math.random()*.5; 
			let moveSize = .2;
			
			if(name=="head"){
				sze *= 2;
				moveSize *= 2;
			}
			
			const geo = new SphereGeometry((sze*.25),6,6);
			const mat = new MeshStandardMaterial({color:0x37ff79, roughness:.1});
			const mesh = new Mesh(geo,mat);

			mesh.position.x = -(moveSize*.5)+Math.random()*moveSize;
			mesh.position.y = -(moveSize*.5)+Math.random()*moveSize;
			mesh.position.z = -(moveSize*.5)+Math.random()*moveSize;
			
			bone.add(mesh);

		}
			

		appGlobal.characterOutlineMeshes.push(this.character);
		//appGlobal.characterOutlineMeshes.push(this.movement);
		appGlobal.scene.characterOutlinePass.selectedObjects = appGlobal.characterOutlineMeshes;
		
		const geo = new BoxGeometry( 2, 2.5, 1.5 );
		const mat = new MeshStandardMaterial({    color:0x00ff00, visible:false});
		const headMat = new MeshStandardMaterial({color:0xff0000, visible:false});
		this.mesh = new Mesh(geo,mat);
		this.mesh.position.y = -2.25;
		const headGeo = new BoxGeometry(1.4,1.6,1.4);
		this.head = new Mesh(headGeo, headMat);
		this.head.position.y = -.75;

		this.mesh.playerId = this.id;
		this.head.playerId = this.id;
		this.mesh.isHead = false;
		this.head.isHead = true;
		
		appGlobal.hitScanArray.push(this.mesh, this.head);
		
		const arr = [this.character/*, this.movement*/];

		this.characterHolder = new Object3D();
		this.characterMeshCorrector = new Object3D();
		this.characterLookAtHelper = new Object3D();
		this.characterHolder.rotation.y+=Math.PI;
		this.xRot.add(this.characterHolder);

		const s = 3.25;
		this.character.position.z/* = this.movement.position.z*/ = -.2;
		this.character.position.y /*= this.movement.position.y*/ = -3.4;
		this.start = new Object3D();
		this.end = new Object3D();

		this.character.scale.set(s,s,s);
		//this.movement.scale.set(s,s,s);

		this.characterMeshCorrector.add(this.character/*, this.movement*/, this.mesh, this.head);
		this.rotOffset.add(this.xRotHelper,this.characterMeshCorrector, this.rotationSeeker, this.characterLookAtHelper);

		this.mesh.add(this.start);
		this.head.add(this.end);
		this.cah = new CharacterAnimationHandler({meshes:arr, animations:appGlobal.loadObjs[0].model.animations, name:"bot"});
		this.cah.initAnimation();

		let name = "tip-" + OBJ.name;
		
		this.tipObject = this.character.getObjectByName(name);
		
		this.spineBone = this.character.getObjectByName("spine_01"); 
		this.pelvisBone = this.character.getObjectByName("pelvis");
		//this.pelvisBone.add(this.characterLookAtHelper, this.rotationSeeker); 
		

		// this.character.traverse( function ( obj ) {
		// 	if(obj.isMesh || obj.isSkinnedMesh){
				
		// 		console.log(obj.name)
		// 		//obj.dispose();
		// 	}

		// });

		this.tipPos = new Vector3();
		this.spineRotTarg = 0;
		this.shootTimeout;

		//this.fps = new FPSAni({model:OBJ.weapon.model, name:OBJ.weapon.name});
		this.adsMouseSenseMultTarg = 0;
		this.adsMouseSenseMult = 0;

		this.canDoWalkSound = true;
		this.currStep = 0;
		this.stepsTimeout;
		this.ability1KeyDownOT = false;
		this.ability2KeyDownOT = false;
		
		this.world = self.getClosestWorld();
		this.playing = true;

		this.remotePlayer = this;
		this.radius = .45;

		this.aiState = "chasing";
		this.aiInc = appGlobal.random()*1000;
		this.aiRndDist = 6+appGlobal.random()*6;
		this.aiChaseDist = this.aiRndDist*1.5;
		this.shootDist = this.aiChaseDist;
		this.aiRndTurnSpeed = 50+Math.random()*50;
		this.currPos = new Vector3();
		this.prevPos = new Vector3();
		this.axisXRnd = 1;
		if(Math.random()>.5)this.axisXRnd=-1;
		this.movementSum = 0;
		this.movementInc = 0;
		this.aiStrafeRndCheck = 10+Math.random()*20;
		this.aiStrafeRndInc = 0;
		this.chaseReset = false;
		this.chaseResetTimeout;
		this.boostTimer = 40+appGlobal.random()*110;
		this.moveBoostAmount = 6; 
		this.canCheckPlanetSwitch = true;
		this.planetSwitchCheckTimeout;
		this.targetQuaternion = new Quaternion();
		this.strafeRandomTimeout;
		this.canDoStrafeRandom = true;
		

		self.hideGunStuff();
		//this.aiState = ""
		//appGlobal.world = this.getClosestWorld();
		
		//this.hitGrav = new Vector3();
		//this.grappling = false;
		//this.canGrapple = false;
		//this.currentWorldIndex = 0;
		//this.outlinedWorld;
		//this.outlinedPoint = new Vector3();
		//this.state = "playing"
	}

	hideGunStuff(){

		const gunNames = [
			"Cube043", // launcher
			"Sphere067", //sixgun
			"Sphere068",//fatty
			"Plane001",//sub
			"Sphere070",//sniper
			"Sphere073"//assault
		]
		for(let i = 0; i<gunNames.length; i++){
			const gun = this.character.getObjectByName(gunNames[i]); 
			//console.log(gun)
			if(gun!=null){
				gun.visible = false;
			}
		}
		this.tipObject.visible = false;
	}
	
	setSpawns(){
		for(let i = 0; i<100; i++){
			const pos = new Vector3();
			pos.x = -1+appGlobal.random()*2;
			pos.y = -1+appGlobal.random()*2;
			pos.z = -1+appGlobal.random()*2;
			this.spawns.push(pos);
		}
	}
	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name==NAME)
				return appGlobal.loadObjs[i].model;	
		}
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
				this.updatePlayerPositionAndRotation();
				this.weapon.update();
			break;
			case "dead":
			break;
		}

	}
	updateNonLooped(){

		if(appGlobal.localPlayer!=null && appGlobal.localPlayer.state=="alive" && appGlobal.localPlayer.firstLand){
			this.updateAI();	
		}
		this.cah.update();

		//this.fps.update();
		this.animationObject = {
			yAxis:this.axisY, 
			xAxis:this.axisX,
			jump:!this.animationOnFloor,
			boost:false,
			adsing:false
		}

		this.cah.handleAnimationEasing(0,this.animationObject)
		
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

		// const moving = (Math.abs(this.axisX) > 0 || Math.abs(this.axisY)>0); 
		// if(moving && this.playerOnFloor){
		// 	//this.playerMovingForWalkSound = true;
		// 	if(this.canDoWalkSound){
		// 		this.initWalkSound();
		// 	}
		// }
		
	}

	updateAI(){

		this.head.getWorldPosition(this.tipPos);
		const p = new Vector3().copy(appGlobal.localPlayer.playerCollider.end);
		const dist = p.distanceTo(this.playerCollider.end);
		
		const wPos = new Vector3();
		this.xRotHelper.getWorldPosition(wPos);
		// const wPos2 =new Vector3();
		// this.characterMeshCorrector.getWorldPosition(wPos2);
		
		this.aiInc += appGlobal.deltaTime * (this.aiRndTurnSpeed*.3);

		const v1 = p.clone().sub( wPos ).normalize(); // CHANGED
		const v3 = new Vector3().crossVectors(v1, this.grav ).normalize(); // CHANGED
		
		this.xRotHelper.up.copy(v3);
		this.xRotHelper.lookAt(p);
		
		// 
		// var lookVec = new Vector3();
		// this.lookAt.getWorldDirection(lookVec).normalize();
		
		// const ns = new Vector3().copy(this.playerCollider.end).normalize();
		// const np = new Vector3().copy(p).normalize();
		// const lp = p.clone().sub(this.playerCollider.end);

		// let angle = lookVec.angleTo(v3);
		// let cosAB = p.dot( this.playerCollider.end );
		
		// var quaternion = new Quaternion(); // create one and reuse it
		// //quaternion.setFromUnitVectors( ns, np );
		// quaternion.setFromUnitVectors( this.grav, v1);
		
		//angle = .dot( v3 );
		//if(appGlobal.localPlayer.animationOnFloor){
			this.rotationSeeker.lookAt(appGlobal.localPlayer.playerCollider.end);
		//}
		
		if(this.world == appGlobal.world){
			if(dist>5){
				const wPos1 = new Vector3();
			 	
			 	this.seekerHelperTip.getWorldPosition(wPos1);
			 	//this.spineBone.getWorldPosition(wPos1);
				
				const v11 = p.clone().sub( wPos1 ).normalize(); // CHANGED
				
				const v44 = new Vector3();
				this.pelvisBone.getWorldDirection(v44);
				v44.normalize();
				
				const v22 = new Vector3().crossVectors(v44, this.grav).normalize();
				const v33 = new Vector3().crossVectors(v11, this.grav).normalize(); // CHANGED
				//if(appGlobal.localPlayer.animationOnFloor){
					this.characterLookAtHelper.lookAt(p);
					this.characterLookAtHelper.up.copy( v33 );
					
					this.characterLookAtHelper.rotation.z += -Math.PI/2;
					
					//const eul = new Euler(this.characterLookAtHelper.rotation.x+Math.PI/2, this.characterLookAtHelper.rotation.y, this.characterLookAtHelper.rotation.z, "XYZ")
					this.targetQuaternion.copy(this.characterLookAtHelper.quaternion);
					//eul.applyQuaternion(this.characterLookAtHelper.quaternion)
					//this.targetQuaternion.setFromEuler(eul);
					//this.targetQuaternion.copy(quat);
				//}
				
			}else{
				//targetQuaternion.identity();
			}
			//console.log(angle)
		}else{
			this.targetQuaternion.identity ();
		}

		//this.spineBone.quaternion.rotateTowards( this.targetQuaternion, appGlobal.deltaTime * 100 );		
		//this.spineBone.lookAt(appGlobal.localPlayer.playerCollider.end);

		//this.spineBone.rotation.y = Math.PI/2		
		
		//this.spineBone.setRotationFromAxisAngle(new Vector3(0,0,1),this.rotationS)		
		

		this.characterMeshCorrector.quaternion.rotateTowards( this.targetQuaternion, appGlobal.deltaTime * 100 );

		switch(this.aiState){
			case "chasing":
				
				this.xRot.rotateOnAxis(new Vector3(0,1,0), Math.sin(this.aiInc)*.02)
				this.axisY = 1;
				this.axisX = 0;
				
				if( dist < this.aiRndDist){
					this.aiState = "strafing";
					this.axisXRnd = 1; 
					if(Math.random()>.5)this.axisXRnd = -1;
				}

				this.weapon.shouldShoot = false;

			break;
			case "strafing":
				if(this.canDoStrafeRandom){
					const self = this;
					this.canDoStrafeRandom = false;
					this.strafeRandomTimeout = setTimeout(function(){
						if(Math.random()>.4){
							self.axisXRnd = 1; 
							if(Math.random()>.5)self.axisXRnd = -1;
						}else{
							self.axisXRnd = 0;
						}
						self.canDoStrafeRandom = true;
					}, 700+Math.random() * 1200)

				}
			
				
				if(dist<5){
					this.axisXRnd = 0;
				}

				this.axisY = 0;
				this.axisX = this.axisXRnd;
				
				if(dist > this.aiChaseDist){
					if(!this.chaseReset){
						const self = this;
						this.chaseReset = true;
						this.chaseResetTimeout = setTimeout(function(){
							self.chaseReset = false;
							if(appGlobal.localPlayer != null){
								const pp = new Vector3().copy(appGlobal.localPlayer.playerCollider.end);
								const dd = pp.distanceTo(self.playerCollider.end);
			
								if(dd > self.aiChaseDist){
									self.aiState = "chasing";	
								}
							}else{
								self.aiState = "chasing";
							}
						},1000 + Math.random()*500 - window.timeIncrease.chasingSwitch);// chasing quicker
						
					}
					
				}
				if(dist<this.shootDist){
						this.weapon.shouldShoot = true;
				}else{
					this.weapon.shouldShoot = false;
				}

			break;
		}

		
		//this.movementInc+=appGlobal.deltaTime*100;
		//console.log(this.movementInc)
		this.currPos.copy(this.playerCollider.start);
		
		this.movementSum += this.currPos.distanceTo(this.prevPos);
		if(this.canCheckPlanetSwitch && this.world != appGlobal.world){
			const self = this;
			this.canCheckPlanetSwitch = false;
			this.planetSwitchCheckTimeout = setTimeout(function(){
				self.canCheckPlanetSwitch = true;
				if(self.movementSum < self.moveBoostAmount + window.timeIncrease.planetSwitchMovementThreshold){ // higher means they'll move switch planets quicker
					if(self.world != appGlobal.world)
						self.boostToOtherWorld();
				}
				//console.log(self.movementSum);
				self.movementSum = 0;
			}, 2000 - window.timeIncrease.planetSwitchCheck); // lower means they'll switch planets quicker
		}
		//console.log(this.movementSum)
		// //if(this.movementInc > this.boostTimer){
			
			

		// 	this.movementSum = 0;
		// 	this.movementInc = 0;
		// //}
		
		this.prevPos.copy(this.playerCollider.start);
		
	}

	boostToOtherWorld(){
		
		for(let i = 0; i<this.abilities.length; i++){
			this.abilities[i].handleKeyDown("KeyE");	
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
		// if(this.adsing){
		// 	this.adsMouseSenseMultTarg = 1.0;
		// }else{
		// 	this.adsMouseSenseMultTarg = 0.0;
		// }
		// this.adsMouseSenseMult += (this.adsMouseSenseMultTarg - this.adsMouseSenseMult)*(appGlobal.deltaTime*200);
	}
	
	receiveDamage(OBJ){
		//appGlobal.soundHandler.playSoundByName({name:"dmg", dist:1});
		
		// const camForward =  new Vector3().copy(this.getCameraForwardVector());
		// const attacker = new Vector3().copy(OBJ.position).sub(this.playerCollider.end).normalize();
		
		// const q1 = new Quaternion().setFromUnitVectors( new Vector3(0,0,1), camForward );
		// const q2 = new Quaternion().setFromUnitVectors( new Vector3(0,0,1), attacker );
		
		// const v1 = new Euler().setFromQuaternion (q1);
		// const v2 = new Euler().setFromQuaternion (q2);	
		
		// const angle = (v2.x-v1.x)+Math.PI;
		//this.hud.doIncomingDamageMarker( (angle*-1) );
	
		this.life -= OBJ.health;
		
		if(appGlobal.localPlayer)
			appGlobal.localPlayer.handleDoDamage(OBJ);
		
		//this.hud.updateHealth(this.life);
		if(this.life <= 0 ){
			
			if(appGlobal.localPlayer)
				appGlobal.localPlayer.handleGetKill();
			
			appGlobal.totalKills++;
			document.getElementById("kills-bots").innerHTML="kills: "+appGlobal.totalKills;
			
			this.kill();
		}
	}

	heal(OBJ){
		this.life = OBJ.health;
		//if(this.life>100)
			//this.life = 100;
		//this.hud.updateHealth(this.life);
	}


	kill() {
		if(this.state == "alive"){
			
			this.state = "dead";
			
			for(let i = 0; i<this.abilities.length; i++){
				this.abilities[i].kill();	
			}

			this.weapon.kill();
			//this.fps.kill();
			this.playing = false;
			//appGlobal.globalHelperFunctions.playerReset(this.id, true);
			
			if(this.stepsTimeout != null){
				clearInterval(this.stepsTimeout);
			}
			if(this.chaseResetTimeout!=null)
				clearInterval(this.chaseResetTimeout)

			if(this.planetSwitchCheckTimeout!=null)
				clearInterval(this.planetSwitchCheckTimeout)

			if(this.strafeRandomTimeout!=null)
				clearInterval(this.strafeRandomTimeout);


			this.canDoStrafeRandom = true;
			this.canCheckPlanetSwitch = true;
			this.chaseReset= false;

			this.canDoWalkSound = false;

			this.hideAllMeshes();

			const self = this;

			const pos = new Vector3().copy(self.spawns[self.spawnsInc]);
			const end = new Vector3().copy(pos);
			pos.multiplyScalar(appGlobal.worldScale*6);
			
			self.grav = new Vector3().copy(pos).sub(new Vector3()).normalize();
			const n = new Vector3().copy(pos).add( self.grav.multiplyScalar(self.playerHeight) );
	
			self.playerCollider.set( pos, n, 1.35 );
			this.updatePlayerPositionAndRotation();
				
			setTimeout(function(){

				// const pos = new Vector3().copy(self.spawns[self.spawnsInc]);
				// const end = new Vector3().copy(pos);
				// pos.multiplyScalar(appGlobal.worldScale*6);
				// self.showAllMeshes();
				
				// self.grav = new Vector3().copy(pos).sub(new Vector3()).normalize();
				// const n = new Vector3().copy(pos).add( self.grav.multiplyScalar(self.playerHeight) );
				self.showAllMeshes();
				// self.playerCollider.set( pos, n, 1.35 );
				self.world = self.getClosestWorld();
				self.playing = true;
				self.state = "alive";
				self.life = 100;
				self.spawnsInc++;
				self.spawnsInc = self.spawnsInc%self.spawns.length;
				self.hideGunStuff();
			},2500-window.timeIncrease.respawnSpeed)
		}
	}

	hideAllMeshes(){
		this.toggleMesh(this.character, false);
		// this.head.visible = false;
		// this.mesh.visible = false;
		//this.toggleMesh(this.movement,  false)
	}

	showAllMeshes(){
		this.toggleMesh(this.character, true)
		// this.head.visible = true;
		// this.mesh.visible = true;
		//this.toggleMesh(this.movement,  true)
	}

	toggleMesh(mesh, show){
		mesh.traverse( function ( obj ) {
			if(obj.isMesh || obj.isSkinnedMesh){
				obj.visible = show;
			}
		});
	}

	doTPSAni(doTPS){
		// if(this.tpsAni!=null){
		// 	this.tpsAni.kill();
		// }

		// if(doTPS){

		// 	//this.mesh.visible = true;
		// 	this.adsing = false;
		// 	//this.tpsAni = gsap.to(this,{duration:.3, camDist:5, ease: "circ.out()", delay:0});
		// 	if(this.fovAni!=null){
		// 		this.fovAni.kill();
		// 	}
		// 	const self = this;
		// 	// this.fovAni = gsap.to(this.camera,{duration:.3, fov:120, ease: "circ.out()", delay:0, onUpdate:function(){
		// 	// 	self.camera.updateProjectionMatrix();
		// 	// }});

		// }else{

		// 	//this.mesh.visible = false;
		// 	//this.tpsAni = gsap.to(this,{duration:.6, camDist:0, ease: "circ.out()", delay:0});
		// 	if(this.fovAni!=null){
		// 		this.fovAni.kill();
		// 	}
		// 	const self = this;
		// 	this.fovAni = gsap.to(this.camera,{duration:.6, fov:this.defaultFOV, ease: "circ.out()", delay:0, onUpdate:function(){
		// 		self.camera.updateProjectionMatrix();
		// 	}});
		// }
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

	handleBlinkKeyPress(){
		// if(this.canBlink && !this.boosting && !this.keys.W){
		// 	if( this.keys.A || this.keys.D ){
			
		// 		this.blinkTarg = new Vector3().clone(this.playerCollider.end);
		// 		this.blinkTarg.add( this.getSideVector().multiplyScalar((this.axisX*.08)) );
		// 		gsap.to(this.blinkTarg, {duration:.5, x:0, y:0, z:0, ease: "circ.out()", delay:0});
		// 		this.canBlink = false;
		// 		for(let i = 0; i<this.abilities.length; i++){
		// 			if(this.abilities[i].name == "blink"){
		// 				this.abilities[i].confirmAbility();
		// 			}
					
		// 		}
				
		// 	}else if(this.keys.S){
		// 		this.blinkTarg = new Vector3().clone(this.playerCollider.end);
		// 		this.blinkTarg.add( this.getForwardVector().multiplyScalar((this.axisY*.08)) );
		// 		gsap.to(this.blinkTarg, {duration:.5, x:0, y:0, z:0, ease: "circ.out()", delay:0});
		// 		this.canBlink = false;
		// 		for(let i = 0; i<this.abilities.length; i++){
		// 			if(this.abilities[i].name == "blink"){
		// 				this.abilities[i].confirmAbility();
		// 			}	
		// 		}
		// 	}
		// }
	}

	
	

	handleDoDamage(){
		appGlobal.soundHandler.playSoundByName({name:"hit", dist:1});
		//this.hud.doDamageMarker();
	}


	
	handleBoost(){

		// if(this.boosting){
			
		// 	this.boostMeter -= (appGlobal.deltaTime*(2.7*this.abilityMult));
		
		// 	if(this.boostMeter<0){
		// 		this.boostMeter = 0;
		// 		this.boosting = false;
		// 		this.canBoost = false;
		// 		this.cancelBoost();
		// 	}

		// }else{

		// 	this.boostMeter += (appGlobal.deltaTime*(1.35));
			
		// 	if(this.boostMeter>1){
		// 		this.boostMeter = 1;
		// 	}
			
		// }

		// if( !this.boostButtonDown ){
		// 	if(!this.canBoost){
		// 		if(this.boostMeter>.25){
		// 			this.canBoost = true;
		// 		}
		// 	}
		// }

		//this.hud.updateBoost(this.boostMeter);

	}

	initBoost(){
		
		// if(this.didTpsAni){	
		// 	appGlobal.soundHandler.playSoundByName({name:"boost", dist:1});
		// 	//this.doTPSAni(true);
		// 	this.didTpsAni = false;
		// }
		// this.boostMult = this.boostMultMax;
		// this.boosting = true;
		// this.fps.toggleBoost(true);
	}

	cancelBoost(){
		// if(!this.didTpsAni){
		// 	//this.doTPSAni(false);
		// 	this.didTpsAni = true;
		// }
		// this.fps.toggleBoost(false);
		// this.boostMult = 1;
		// this.boosting = false;
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

		
		const center = this.vector1.addVectors( this.playerCollider.start, this.playerCollider.end ).multiplyScalar( 0.5 );

		const sphere_center = this.world.collider.center;

		const r = this.playerCollider.radius + this.world.collider.radius;
		const r2 = r * r;
		this.animationOnFloor = false;
		for ( const point of [ this.playerCollider.start, this.playerCollider.end, center ] ) {
		//for ( const point of [ this.playerCollider.start ] ) {
			const d2 = point.distanceToSquared( sphere_center );
			if ( d2 < r2 ) {
				const normal = this.vector1.subVectors( point, sphere_center ).normalize();
				this.animationOnFloor = true;
				//this.playerVelocity.addScaledVector( normal, -normal.dot( this.playerVelocity ) );
				//this.playerCollider.translate( deltaPosition.add(this.blinkTarg) );
		
				//playerCollider.translate( normal.multiplyScalar( 1 ) );
			}	
		}

		
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
			//if(currClosest!=null)
			this.abilities[i].updateClosestWorldIndex(currClosest.index);
		}
		
		return currClosest;

	}

	checkCanSetClosestWorld(){
		
	
		if(this.canSelectClosestWorld && this.boostAndGravWorldCollisionHelper(1.0))
			return true;

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
		this.currWorld = this.world;
		
		//if(this.ability.canSetClosestWorld){
		if(this.checkCanSetClosestWorld()){
			this.hitWorldWhenNotChecking = false;
			//this.playerCollisions();
			this.world = this.getClosestWorld();
		}else{
			//this.boostAndGravSwitchHelper();
		}
		
		//grav
		//if(!this.playerOnFloor)
			this.grav.lerp(start.sub( this.world.worldPosition ).normalize(), 1);
		//else
			//this.grav.lerp(this.hitGrav,1);
		//let airControl = this.speedMult*this.boostMult;
		//let airControl = Math.exp(  20 * appGlobal.deltaTime ) * this.speedMult*this.boostMult;
		let airControl = (appGlobal.deltaTime*800)*this.speedMult*this.boostMult;
		
		const boostDir = new Vector3();
		// if(this.boosting){
		// 	boostDir.copy(this.getBoostForwardVector()).multiplyScalar((200*this.directionalBoostMult)*appGlobal.deltaTime);
		// }

		if ( !this.playerOnFloor ) {
			
			this.playerVelocity.x -= this.grav.x*(appGlobal.gravity*appGlobal.deltaTime);
			this.playerVelocity.y -= this.grav.y*(appGlobal.gravity*appGlobal.deltaTime);
			this.playerVelocity.z -= this.grav.z*(appGlobal.gravity*appGlobal.deltaTime);
			damping *= 0.1;	
			airControl = this.inAirControlMult;

		}else{
			if(!this.firstLand){
				//this.doTPSAni(false);
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
		
		this.playerWorldCollision();
		this.playerCollisions();
		
		this.lookAt.position.copy( this.playerCollider.end );
		this.lookAtRef.position.copy( this.playerCollider.end );
		
		this.rotOffset.rotation.x = -Math.PI*.5;
			
		this.worldPosEase.lerp(this.world.worldPosition, this.gravRotationEase);
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
		
		//this.updateCameraRotation({mx:event.movementX, my:event.movementY})
		
	}

	updateCameraRotation(OBJ){

		// let adsValHolder = this.weapon.adsMouseSensMult * appGlobal.settingsParams["adsMouseSenseMult"];
		// if(adsValHolder > .95)
		// 	adsValHolder = .95;
		// const adsHelper = 1.0 - (adsValHolder  * this.adsMouseSenseMult);

		//this.xRot.rotation.y   -= OBJ.mx *(0.005*( appGlobal.settingsParams["mouseSens"] * adsHelper ));
		//this.camera.rotation.x -= OBJ.my *(0.005*( appGlobal.settingsParams["mouseSens"] * adsHelper ));
		
		const max = 1.4;
		// if(this.camera.rotation.x<-max)this.camera.rotation.x = -max;
		// if(this.camera.rotation.x>max)this.camera.rotation.x = max;
		//this.playerRotationHelper.rotation.y = this.camera.rotation.y;
	}

	ads(shouldADS){
			
		// if(!this.boosting){
			
		// 	this.adsing = shouldADS;
		// 	this.fps.toggleADS(shouldADS);
			
		// 	if(this.fovAni!=null){
		// 		this.fovAni.kill();
		// 	}
			
		// 	const self = this;
		// 	if(shouldADS){
		// 		this.fovAni = gsap.to(this.camera,{duration:.3, fov:this.weapon.zoom, ease: "circ.out()", delay:0, onUpdate:function(){
		// 			self.camera.updateProjectionMatrix();
		// 		}});
		// 	}else{
		// 		this.fovAni = gsap.to(this.camera,{duration:.3, fov:this.defaultFOV, ease: "circ.out()", delay:0, onUpdate:function(){
		// 			self.camera.updateProjectionMatrix();
		// 		}});
		// 	}

		// }
		
	}



}

export { BotPlayer };
