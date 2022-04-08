import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from 'three';
import { StickyBullet } from './StickyBullet.js';
import { RocketBullet } from './RocketBullet.js';
import { AutoBullet } from './AutoBullet.js';
import { SniperBullet } from './SniperBullet.js';

class RemoteBulletHandler {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ) {

		this.arrFull = false;
		this.index = 0;
		this.arr = [];
		this.max = 200;
		this.bulletArr = [];
		this.nameToParams=[
			{name:"sticky",     class:appGlobal.weapons.sticky,     },
			{name:"launcher",   class:appGlobal.weapons.launcher,   },
			{name:"automatic",  class:appGlobal.weapons.automatic,  },
			{name:"submachine", class:appGlobal.weapons.submachine, },
			{name:"sniper",     class:appGlobal.weapons.sniper,     },
			{name:"sixgun",     class:appGlobal.weapons.sixgun,     },
		]
	}
	
	update(){
		for ( let i = 0; i < appGlobal.STEPS_PER_FRAME; i ++ ) {
			for(let i = 0; i < this.arr.length; i++){
				this.arr[i].update();	
			}
		}
	}

	shoot(OBJ){

        if(this.arrFull){
            this.arr[this.index].kill();	
        }
     
        let bullet;
    	
    	const obj = this.getObjectBasedOnName(OBJ.name);
    	bullet = obj.class.bullet;
    	
    	const shooter = appGlobal.globalHelperFunctions.getRemotePlayerById(OBJ.id);
    	if(shooter != null){
    		
    		const dist = appGlobal.globalHelperFunctions.getDistanceForSound(shooter.player.offset.position);
	    	appGlobal.soundHandler.playSoundByName({name:obj.class.sound, dist:dist});
	    	
	    	OBJ.obj.pos.x = shooter.player.tipPos.x;
	    	OBJ.obj.pos.y = shooter.player.tipPos.y;
	    	OBJ.obj.pos.z = shooter.player.tipPos.z;

	    	shooter.player.handleRemoteShoot();

    	}

    	const b = new bullet(OBJ.obj, false);
    	this.arr[this.index] = b;
        this.index++;

        if(this.index == this.max){
            this.index = 0;
            this.arrFull = true;	
        }
	}
	
	
	getObjectBasedOnName(name){
		for(let i = 0;i<this.nameToParams.length; i++){
			if(name==this.nameToParams[i].name){
				return this.nameToParams[i];
			}
		}
	}
	//getRemoteById()
	kill(){
		this.arrFull = false;
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].kill();	
		}
		this.index = 0;
		this.arr = [];
	}

}

export { RemoteBulletHandler };
