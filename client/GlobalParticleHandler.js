import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from 'three';

import { ParticleEmitter } from './ParticleEmitter.js';

class GlobalParticleHandler {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ) {

		this.arrFull = false;
		this.index = 0;
		this.arr=[];
		this.max = 7;
		
	}
	
	update(){
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].update();	
		}
	}

	createEmitter(OBJ){

        if(this.arrFull){
            this.arr[this.index].kill();	
        }
        
        const pe = new ParticleEmitter(OBJ);
        pe.emit();
        this.arr[this.index] = pe;

        this.index++;

        if(this.index == this.max){
            this.index=0;
            this.arrFull = true;	
        }
	}

	kill(){
		this.arrFull = false;
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].kill();	
		}
		this.index = 0;
		this.arr = [];
	}
}

export { GlobalParticleHandler };
