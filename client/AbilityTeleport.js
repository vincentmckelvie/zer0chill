import {
	Object3D,
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Vector2,
	SphereGeometry,
	MeshStandardMaterial,
	Color,
	AdditiveBlending 
} from 'three';
import { Abilities } from './Abilities.js';

class AbilityTeleport extends Abilities {
	// {
	// 	type:"hold",//"press"
	//	hasCooldown:false
	//	cooldown:8000,
	//  key:"ShiftLeft"//"KeyE"
	// }
	constructor(OBJ) {
		// const geo = new BoxGeometry(1,1,1);
		// this.mesh = new Mesh(geo,mat);
		super(OBJ);
		this.clickPoint = new Vector3();
		this.clickWorld;

		const geo = new SphereGeometry(2,8,8);
		const mat = new MeshBasicMaterial({color:new Color().setHSL(0,1,.6), transparent:true, opacity:.8, blendMode:AdditiveBlending, fog:false});
		
		this.mesh = new Mesh(geo,mat);
		this.mesh.visible = false;
		appGlobal.scene.add(this.mesh);

		
	}

	update(){
		super.update();
		if(this.initedAbility){
			this.updateMousePos();
			if(this.clickWorld!=null){
				this.mesh.visible = true;
			}else{
				this.mesh.visible = false;
			}
		}
	}
	init(){
		super.init(this);
	}

	initAbilityChild(){
		this.mesh.visible = true;
	}

	doAbility(){
		this.handleTeleport();
	}

	updateMousePos(){
		
		appGlobal.raycaster.setFromCamera( new Vector2(0,0), appGlobal.controller.playerCamera );
		const intersection = appGlobal.raycaster.intersectObjects( appGlobal.grappleMeshes, false );
		
		if ( intersection.length > 0 ) {
			
			if(this.canDoAbility){
				
				//this.clickPoint.copy(intersection[0].point.add(intersection[0].normal.multiplyScalar(2)));
				const p = new Vector3().copy(intersection[0].point);
				const n = new Vector3().copy(intersection[0].face.normal)
				//this.mesh.visble = true; 
				this.mesh.position.copy(p);
				///console.log(this.mesh.visble + " mesh vis pre" )

				this.clickPoint.copy(p.add(n.multiplyScalar(2)));
				this.clickWorld = appGlobal.worlds[intersection[0].object.worldIndex];
				//appGlobal.scene.updateOutlined([intersection[0].object]);
			}else{
				
				this.clickWorld = null;
			
			}
			
		}else{
			this.clickWorld = null;
		}
		//console.log(this.mesh.visble + " mesh vis post" )
		
	}

	handleTeleport(){

		if(this.clickWorld){
			
			this.canSetClosestWorld = false;
			this.worldIndex = this.clickWorld.index;
			appGlobal.world = this.clickWorld;
			appGlobal.localPlayer.playerOnFloor = false;
			const clp = new Vector3().copy(this.clickPoint);
			const grv = clp.sub(appGlobal.world.worldPosition).normalize();
			appGlobal.localPlayer.grav.copy(grv);
			
			appGlobal.localPlayer.playerCollider.start.copy(this.clickPoint);
			const end = new Vector3().copy(appGlobal.localPlayer.playerCollider.start).add(grv.multiplyScalar(appGlobal.localPlayer.playerHeight));
			
			appGlobal.localPlayer.playerCollider.end.copy(end);
			appGlobal.localPlayer.worldPosEase.copy(appGlobal.world.worldPosition)
			
			this.canSetClosestWorld = true;
			//this.initedAbility = false;
			this.mesh.visible = false;
			super.confirmAbility();
		}
	}
	
  	childKill(){
  		this.mesh.geometry.dispose();
  		this.mesh.material.dispose();
  		appGlobal.scene.remove(this.mesh);
  	}
}

export { AbilityTeleport };
