import {
	Object3D,
	CylinderGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	Vector2
} from 'three';
import { Abilities } from './Abilities.js';

class AbilityPlanetSwitch extends Abilities {
	// {
	// 	type:"hold",//"press"
	//	hasCooldown:false
	//	cooldown:8000,
	//  key:"ShiftLeft"//"KeyE"
	// }
	constructor(OBJ) {
		
		super(OBJ);
		this.outlinedWorld;
		this.outlinedPoint = new Vector3();
		this.lastWorld;
		//this.timerTest = false;
	}
	
	init(){
		//console.log("init")
		super.init(this);
	}
	
	update(){
		super.update();
		if(this.canDoAbility){
			this.timerTest = false;
			this.updateOutline();
		}else{
			const closestWorld = this.getClosestWorld();
			if(closestWorld != this.lastWorld){
				this.canSetClosestWorld = true;
			}
		}
		// if(Math.random()>.96)
		// console.log("cscw "+this.canSetClosestWorld)
			 	
	}

	// activateAbility(){
	// 	super.activateAbility();
	// }

	doAbility(){
		this.handleGrapple();	
	}

	updateOutline(){
		
		appGlobal.raycaster.setFromCamera( new Vector2(0,0), appGlobal.controller.playerCamera );
		const intersection = appGlobal.raycaster.intersectObjects( appGlobal.grappleMeshes, false );
		
		if ( intersection.length > 0 ) {
			
			if(intersection[0].object.worldIndex != this.worldIndex){
				this.outlinedPoint.copy(intersection[0].point);
				this.outlinedWorld = appGlobal.worlds[intersection[0].object.worldIndex];
				appGlobal.scene.updateOutlined([intersection[0].object]);
			}else{
				this.outlinedWorld = null;
				appGlobal.scene.updateOutlined([]);
			}
			
		}else{
			this.outlinedWorld = null;
			appGlobal.scene.updateOutlined([]);
		}
		
	}

	getClosestWorld(){

		let lowestDist = 1000000;
		let currClosest = null;
		for(let i = 0; i<appGlobal.worlds.length; i++){
			const v1 = new Vector3();
			const center = v1.addVectors( appGlobal.localPlayer.playerCollider.start, appGlobal.localPlayer.playerCollider.end ).multiplyScalar( 0.5 );

			const sphere_center = appGlobal.worlds[i].collider.center;

			const r = appGlobal.localPlayer.playerCollider.radius + appGlobal.worlds[i].collider.radius;
			const r2 = r * r;
			const d2 = appGlobal.localPlayer.playerCollider.start.distanceToSquared( sphere_center );
			
			//if ( d2 < r2 ) {
			
			const total = d2-r2;
			
			if ( total < lowestDist ) {

				lowestDist = total;
				currClosest = appGlobal.worlds[i];
			
			}
		}
		
		return currClosest;

	}

	handleGrapple(){

		if(this.outlinedWorld){
			super.confirmAbility();
			this.canSetClosestWorld = false;
			this.lastWorld = appGlobal.world;
			this.worldIndex = this.outlinedWorld.index;
			appGlobal.world = this.outlinedWorld;
			
			const p = new Vector3().copy(this.outlinedPoint);
			const toNewWorld = new Vector3().copy(p.sub(appGlobal.localPlayer.playerCollider.end).multiplyScalar(200));
			
			const fnl = new Vector3().copy(toNewWorld.add( appGlobal.localPlayer.grav.multiplyScalar(200) ) )
			
			if( appGlobal.localPlayer.playerOnFloor )
				appGlobal.localPlayer.playerVelocity.add(  appGlobal.localPlayer.grav.multiplyScalar(200)  );
			
			this.timerHelper = false;
			const self = this;
			setTimeout(function(){
				if(appGlobal.localPlayer !=null ){
					appGlobal.localPlayer.playerVelocity.add( toNewWorld);
				}
				// self.lastWorld = lastWorld;
				// self.worldIndex = outlined.index;//worldIndex;
				// appGlobal.world = outlined;
				self.timerHelper = true;
			},200);
			//appGlobal.localPlayer.playerVelocity.add(.add( appGlobal.localPlayer.grav.multiplyScalar(200) ) );
			
			//appGlobal.localPlayer.playerOnFloor = false;
			
			
		}
	}
  	
}

export { AbilityPlanetSwitch };
