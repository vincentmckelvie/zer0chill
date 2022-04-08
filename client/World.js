import {
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	SphereGeometry,
	IcosahedronGeometry,
	Vector3,
	Sphere,
	Color
} from 'three';
//import { WorldMaterialGenerator } from './WorldMaterialGenerator.js';
import { EnvironmentObject } from './EnvironmentObject.js';

class World {

	//constructor( i = 0, parent = null, worldScale=20 ) {
	constructor( OBJ ) {
		this.envObjAmount = Math.floor(OBJ.scale*2);
		//this.envTexture = new WorldMaterialGenerator();
		this.index = OBJ.index;
		this.worldDecrease = 1;

		this.mesh;
		//this.hue = appGlobal.random();
		this.hue = appGlobal.hue + 0.1 + ( -.1+appGlobal.random()*.2 ); 
		this.color  = new Color().setHSL((this.hue)%1.0, .4, .5);
		this.envColor = new Color().setHSL((this.hue-.3)%1.0, 0.6, .5);
		
		this.worldPosition = new Vector3().copy(OBJ.position);
		this.scale = OBJ.scale;
		this.envObjs = [];
		
		this.collider = new Sphere( new Vector3().copy(this.worldPosition), this.scale );
		this.velocity = new Vector3();
		
		this.sizeEz = 1.0;
		
		const self = this;
		self.initMesh(OBJ);
		self.initEnvironment();

	}

	initEnvironment(){
		for ( let i = 0; i < this.envObjAmount; i ++ ) {
			const env = new EnvironmentObject({i:i, parent:this.mesh, scale:this.scale, color:this.envColor, currArr:this.envObjs});
			this.envObjs.push(env);
		}
	}	

	initMesh(OBJ){
		const sphereMaterial = new MeshStandardMaterial({color:this.color});
		//const sphereGeometryWorld = new SphereGeometry( OBJ.scale, 62, 62 );
		const sphereGeometryWorld = new IcosahedronGeometry( OBJ.scale, 3 );
		
		this.mesh = new Mesh( sphereGeometryWorld, sphereMaterial );
		this.mesh.castShadow = false;
		this.mesh.worldIndex = OBJ.index;
			//this.mesh.receiveShadow = true;
		this.mesh.position.copy(OBJ.position);
		
		appGlobal.worldsHolder.add(this.mesh);
		
		appGlobal.hitScanArray.push(this.mesh);
		appGlobal.grappleMeshes.push(this.mesh);
	}

	update(){
			
		// this.worldDecrease -=0.0001;
		// if(this.worldDecrease < 0.1)
		// 	this.worldDecrease = 0.1;
		
		//this.sizeEz += (appGlobal.worldSize-this.sizeEz)*.07;
		// this.sizeEz = 1;//+= (appGlobal.worldSize-this.sizeEz)*.07;
		// this.mesh.scale.set(this.sizeEz, this.sizeEz, this.sizeEz);
		// this.collider.radius = this.scale*this.sizeEz;
		
		// for(let i = 0; i<this.envObjs.length; i++){
		// 	this.envObjs[i].update({envObjs:this.envObjs, size:this.sizeEz});
		// }
	}

	kill (){
		
		for ( let i = 0; i <this.envObjs.length; i ++ ) {
			this.envObjs[i].kill();
		}
		
	}

	reset(){
		
		this.initMesh();
		this.sizeEz = 1;
		this.envObjs = [];
		this.initEnvironment();
		// for ( let i = 0; i < this.envObjAmount; i ++ ) {
		// 	const env = new EnvironmentObject({i:i, parent:this.mesh, scale:this.scale});
		// 	this.envObjs.push(env);
		// }
	}


}

export { World };
