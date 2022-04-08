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

class AbilityWalls extends Abilities {
	// {
	// 	type:"hold",//"press"
	//	hasCooldown:false
	//	cooldown:8000,
	//  key:"ShiftLeft"//"KeyE"
	// }
	constructor(OBJ) {
		super(OBJ);
	}
	
	init(){
		super.init(this);
	}
	
	doAbility(){
		for(let i = 0; i<appGlobal.worlds.length; i++){
			appGlobal.worlds[i].mesh.material.transparent = true;
			appGlobal.worlds[i].mesh.material.opacity = .3;
			appGlobal.worlds[i].mesh.material.needsUpdate = true;
		}	
		super.confirmAbility();
	}

	deactivateAbility(){
		for(let i = 0; i<appGlobal.worlds.length; i++){
			appGlobal.worlds[i].mesh.material.transparent = false;
			appGlobal.worlds[i].mesh.material.opacity = 1;
			appGlobal.worlds[i].mesh.material.needsUpdate = true;
		}
	}
	
  	
}

export { AbilityWalls };
