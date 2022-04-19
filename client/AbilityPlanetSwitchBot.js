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

class AbilityPlanetSwitchBot extends Abilities {
	// {
	// 	type:"hold",//"press"
	//	hasCooldown:false
	//	cooldown:8000,
	//  key:"ShiftLeft"//"KeyE"
	// }
	constructor(OBJ) {
		
		super(OBJ);
	
		this.outlinedPoint = new Vector3();
		this.lastWorld;
		this.bot = OBJ.bot;
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
			//this.updateOutline();
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

	

	getClosestWorld(){

		let lowestDist = 1000000;
		let currClosest = null;
		for(let i = 0; i<appGlobal.worlds.length; i++){
			const v1 = new Vector3();
			const center = v1.addVectors( this.bot.playerCollider.start, this.bot.playerCollider.end ).multiplyScalar( 0.5 );

			const sphere_center = appGlobal.worlds[i].collider.center;

			const r = this.bot.playerCollider.radius + appGlobal.worlds[i].collider.radius;
			const r2 = r * r;
			const d2 = this.bot.playerCollider.start.distanceToSquared( sphere_center );
			
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

		if(appGlobal.world){
			super.confirmAbility();
			this.canSetClosestWorld = false;
			this.lastWorld = this.bot.world.world;
			this.worldIndex = appGlobal.world.index;
			this.bot.world = appGlobal.world;
			
			const p = new Vector3().copy(appGlobal.world.mesh.position);
			const toNewWorld = new Vector3().copy(p.sub(this.bot.playerCollider.end).multiplyScalar(200));
			
			const fnl = new Vector3().copy(toNewWorld.add( this.bot.grav.multiplyScalar(200) ) )
			
			if( this.bot.playerOnFloor )
				this.bot.playerVelocity.add(  this.bot.grav.multiplyScalar(200)  );
			
			this.timerHelper = false;
			const self = this;
			setTimeout(function(){
				if(this.bot !=null ){
					this.bot.playerVelocity.add( toNewWorld);
				}
				self.timerHelper = true;
			},200);
			//appGlobal.localPlayer.playerVelocity.add(.add( appGlobal.localPlayer.grav.multiplyScalar(200) ) );
			
			//appGlobal.localPlayer.playerOnFloor = false;
			
			
		}
	}
  	
}

export { AbilityPlanetSwitchBot };
