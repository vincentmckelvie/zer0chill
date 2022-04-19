import {
	Object3D,
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from 'three';

class AutoBullet {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ, ISLOCAL) {
		
		this.isLocal = ISLOCAL;
		this.damage = OBJ.damage;
		this.id = OBJ.id;
		this.knockParams = OBJ.knockParams;
		
		this.worldPosition = new Vector3().copy(OBJ.worldPosition); 
		
		const rad = .09;
		const sphereGeometry = new BoxGeometry( rad, rad, rad );
		const sphereMaterial = new MeshBasicMaterial( { color: 0xffffff } );
		this.mesh = new Mesh( sphereGeometry, sphereMaterial );
		this.mesh.castShadow = true;
		this.receiveShadow = true;
		appGlobal.scene.add( this.mesh );

		//spheres.push( { mesh: sphere, collider: new THREE.Sphere( new THREE.Vector3( 0, 0, 0 ), SPHERE_RADIUS ), velocity: new THREE.Vector3() } );
		this.collider = new Sphere( new Vector3( 0, 0, 0 ), rad );
		const impulse = OBJ.impulse ;
		this.velocity = new Vector3().copy(OBJ.dir).multiplyScalar( impulse );
		this.collider.center.copy( OBJ.pos );
		this.startPos = new Vector3().copy(OBJ.pos);
		this.contactParticle = appGlobal.particles.shot;
		//console.log(OBJ.pos)
		this.killed = false;
		const self = this;
		this.isBulletDoingDamage = false;
		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 1000);
		//sphereIdx = ( sphereIdx + 1 ) % spheres.length;
	}
	
	update(){
		
		if(!this.killed){
			//if(this.isLocal){
			this.playerSphereCollision();
			//}
			this.handlePhysics();
		}
	}

	handlePhysics(){

		this.collider.center.addScaledVector( this.velocity, window.appGlobal.deltaTime );

		const g = new Vector3().copy(this.collider.center).sub(this.worldPosition).normalize();
		this.velocity.x -= g.x*(appGlobal.gravity*appGlobal.deltaTime);
		this.velocity.y -= g.y*(appGlobal.gravity*appGlobal.deltaTime);
		this.velocity.z -= g.z*(appGlobal.gravity*appGlobal.deltaTime);
		
		const damping = Math.exp( - 1.5 * window.appGlobal.deltaTime ) - 1;
		this.velocity.addScaledVector( this.velocity, damping*.1 );
		for(let i = 0; i<appGlobal.worlds.length; i++){
			const s1 = this;
			const s2 = appGlobal.worlds[i];

			const d2 = s1.collider.center.distanceToSquared( s2.collider.center );
			const r = s1.collider.radius + s2.collider.radius;
			const r2 = r * r;

			if ( d2 < r2 ) {
				this.kill();
			}
		}

		this.mesh.position.copy( this.collider.center );

	}
	
	kill(){
		if(!this.killed){
			
			if(this.isLocal && !this.isBulletDoingDamage){
				this.knockParams.pos = this.mesh.position;
				appGlobal.globalHelperFunctions.knockPlayer(this.knockParams);
			}

			this.contactParticle.pos = this.mesh.position;
			appGlobal.particleHandler.createEmitter(this.contactParticle);

			clearTimeout(this.killTimeout);
			this.killed = true;
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			appGlobal.scene.remove(this.mesh);
		}
	}

	playerSphereCollision() {
		
		const id = appGlobal.globalHelperFunctions.playerSphereCollision(this.collider, this.id);

		if(id != null){
			if(this.isLocal){
				const self = this;
				this.isBulletDoingDamage = true;
				if(window.socket != null){
					const obj = {
					  id: id.id,
					  damage:self.damage,
					  position:this.startPos,
					  headShot:id.headShot,
					  fromDamageId:socket.id
					}
					socket.emit('doDamage', obj);
					appGlobal.globalHelperFunctions.playerDoDamage(obj);
				}else{
					if(id.headShot){
						this.damage *= 1.5;
					}
					console.log(id.headShot)
					appGlobal.remotePlayers[id.id].receiveDamage({headShot:id.headShot, position:this.startPos, health:this.damage})
				}
				
			}
			this.kill();
		}
		
	}

	

}

export { AutoBullet };
