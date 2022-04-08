import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from 'three';

import { Particle } from './Particle.js';

class ParticleEmitter {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ) {

		this.arrFull = false;
		this.index = 0;
		this.arr = [];
		this.max = OBJ.amount;
		this.burst = OBJ.burst;
		this.obj = OBJ;
	    //this.mesh = MESH;

	}
	
	update(){

		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].update();	
		}
	}

	emit(){
        if(this.burst){
        	for(let i = 0; i < this.max; i++){
				this.arr.push(new Particle(this.obj));
			}
        }else{
        	
        	if(this.arrFull){
	            this.arr[this.index].kill();	
	        }
	        
	        this.arr[this.index] = new Particle(this.obj);
	        this.index++;

	        if(this.index == this.max){
	            this.index=0;
	            this.arrFull = true;	
	        }
        }
	}


	kill(){
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].kill();	
		}
		this.arr = [];
        this.index=0;
        this.arrFull = false;	
	}

}

export { ParticleEmitter };
