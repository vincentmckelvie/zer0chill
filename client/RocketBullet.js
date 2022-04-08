import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from 'three';

class RocketBullet {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ, ISLOCAL) {
		
		this.isLocal = ISLOCAL;
		this.damage = OBJ.damage;
		this.id = OBJ.id;
		//this.gravity = OBJ.gravity;
		// this.vector1 = new Vector3();
		// this.vector2 = new Vector3();
		// this.vector3 = new Vector3();
		
		this.alivetime = 2000;
		
		const rad = .2;
		const sphereGeometry = new SphereGeometry( rad, 32, 32 );
		const sphereMaterial = new MeshStandardMaterial( { color: 0xffffff, roughness: 0.8, metalness: 0.5 } );
		this.mesh = new Mesh( sphereGeometry, sphereMaterial );
		this.mesh.castShadow = true;
		this.receiveShadow = true;
		appGlobal.scene.add( this.mesh );

		//spheres.push( { mesh: sphere, collider: new THREE.Sphere( new THREE.Vector3( 0, 0, 0 ), SPHERE_RADIUS ), velocity: new THREE.Vector3() } );
		this.collider = new Sphere( new Vector3( 0, 0, 0 ), rad );
		const impulse = OBJ.impulse ;
		this.velocity = new Vector3().copy(OBJ.dir).multiplyScalar( impulse );
		this.collider.center.copy( OBJ.pos );
		this.knockParams = OBJ.knockParams;
		//this.velocity.addScaledVector( this.player.playerVelocity, 2 );
		this.contactParticle = appGlobal.particles.explosion;
		this.killed = false;
		const self = this;
		this.startPos = new Vector3().copy( OBJ.pos );

		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 2000)
		//sphereIdx = ( sphereIdx + 1 ) % spheres.length;
	}
	
	update(){
		if(!this.killed){
			this.playerSphereCollision();
			this.handlePhysics();
		}
	}

	handlePhysics(){

		this.collider.center.addScaledVector( this.velocity, window.appGlobal.deltaTime );

		//const g = new Vector3().copy(this.collider.center).sub(new Vector3()).normalize();
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
			
			clearTimeout(this.killTimeout);

			if(this.isLocal){
				this.knockParams.pos = this.mesh.position;
				appGlobal.globalHelperFunctions.knockPlayer(this.knockParams);
				
				const arr = appGlobal.globalHelperFunctions.splashDamage(this.knockParams);
				if(arr.length>0){
					for(let i = 0; i<arr.length; i++){
						const self = this;
						socket.emit('doDamage', {
					  		id: arr[i].id,
					  		damage:self.damage*arr[i].damageMult,
					  		position:this.startPos,
					  		headShot:false,
					  		fromDamageId:socket.id
						});
					}			
				}else{

					
				}
			}

			this.contactParticle.pos = this.mesh.position;
			appGlobal.particleHandler.createEmitter(this.contactParticle);

    		const dist = appGlobal.globalHelperFunctions.getDistanceForSound(this.collider.center);
    		appGlobal.soundHandler.playSoundByName({name:this.contactParticle.sound, dist:dist});
	    	
			this.killed = true;
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			window.appGlobal.scene.remove(this.mesh);
		}
	}

	playerSphereCollision() {
		const id = appGlobal.globalHelperFunctions.playerSphereCollision(this.collider, this.id)
		if(id != null){
			this.kill();
		}
	}



}

export { RocketBullet };
