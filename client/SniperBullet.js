import {
	Object3D,
	MeshBasicMaterial,
	Mesh,
	Vector3,
	Vector2,
	Quaternion,
	Sphere,
	BoxGeometry,
	DoubleSide
} from 'three';

class SniperBullet {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ, ISLOCAL) {

		//this.player = window.appGlobal.localPlayer;
		//this.weapon = OBJ.weapon;
		this.isLocal = ISLOCAL;
		this.damage = OBJ.damage;
		this.id = OBJ.id;
		this.knockParams = OBJ.knockParams;
		let bulletSize = .1;
		if(this.isLocal){
			bulletSize=.01;
		}
		const boxGeometry = new BoxGeometry( bulletSize, bulletSize, 1 );
		const sphereMaterial = new MeshBasicMaterial( { color: 0xffffff, transparent:true, opacity:1, side:DoubleSide} );
		this.mesh = new Mesh( boxGeometry, sphereMaterial );
		this.mesh.castShadow = false;
		this.receiveShadow = false;
		this.holder = new Object3D();
		//console.log(appGlobal.scene)
		appGlobal.scene.add( this.holder );
		//console.log(OBJ.pos)
		this.holder.position.copy(OBJ.pos);
		this.startPos = new Vector3().copy( OBJ.pos );
		this.holder.add(this.mesh);
		this.mesh.position.z = .5;
		
		this.holder.scale.z = OBJ.zSize;
	
		const hp = new Vector3().copy(OBJ.hitPoint)
		this.holder.lookAt(hp);
		this.contactParticle = appGlobal.particles.shot;
		
		if(this.isLocal){
			
			if(OBJ.hitId != null){
				if(window.socket != null){
					const obj = {
				  		id: OBJ.hitId,
				  		damage:this.damage,
						position:this.startPos,
						headShot:OBJ.headShot,
						fromDamageId:socket.id
					}	
					socket.emit('doDamage', obj);	
					appGlobal.globalHelperFunctions.playerDoDamage(obj);
				}else{
					let dmg = this.damage;
					if(OBJ.headShot){
						dmg *=1.51;
					}
					appGlobal.remotePlayers[OBJ.hitId].receiveDamage({headShot:OBJ.headShot, position:this.startPos, health:dmg})
				}
				
			}else{
				if(OBJ.hit){
					this.knockParams.pos = OBJ.hitPoint;
					appGlobal.globalHelperFunctions.knockPlayer(this.knockParams);
				}

			}
		}

		if(OBJ.hit){
			this.contactParticle.pos = OBJ.hitPoint;
			appGlobal.particleHandler.createEmitter(this.contactParticle);
		}

		this.killed = false;
		const self = this;
		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 300);

		gsap.to(this.mesh.material,{duration:.3, opacity:0, ease: "linear.none()", delay:0});
		//sphereIdx = ( sphereIdx + 1 ) % spheres.length;
	}
	
	update(){
		//this.mesh.material.opacity -= .01;
	}

	kill(){
		if(!this.killed){
			clearTimeout(this.killTimeout);
			this.killed = true;
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			this.holder.remove(this.mesh);
			appGlobal.scene.remove(this.holder);
		}
	}

}

export { SniperBullet };
