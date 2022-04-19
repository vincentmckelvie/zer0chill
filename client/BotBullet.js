import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from 'three';

class BotBullet {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ, ISLOCAL) {
		
		this.isLocal = ISLOCAL;
		this.damage = OBJ.damage+window.timeIncrease.damage;
		this.id = OBJ.id;
		//this.gravity = OBJ.gravity;
		// this.vector1 = new Vector3();
		// this.vector2 = new Vector3();
		// this.vector3 = new Vector3();
		
		this.alivetime = 2000;
		
		const rad = .2;
		const sphereGeometry = new SphereGeometry( rad, 6, 6 );
		//const sphereMaterial = new MeshStandardMaterial( {color:0x37ff79, roughness:.1} );
		const sphereMaterial = new MeshStandardMaterial( {color:0xf74ba8, roughness:.1} );
		
		this.mesh = new Mesh( sphereGeometry, sphereMaterial );
		this.mesh.castShadow = true;
		this.receiveShadow = true;
		appGlobal.scene.add( this.mesh );

		//spheres.push( { mesh: sphere, collider: new THREE.Sphere( new THREE.Vector3( 0, 0, 0 ), SPHERE_RADIUS ), velocity: new THREE.Vector3() } );
		this.collider = new Sphere( new Vector3( 0, 0, 0 ), rad );
		const impulse = OBJ.impulse + window.timeIncrease.impulse;
		this.velocity = new Vector3().copy(OBJ.dir).multiplyScalar( impulse );
		this.collider.center.copy( OBJ.pos );
		this.knockParams = OBJ.knockParams;
		//this.velocity.addScaledVector( this.player.playerVelocity, 2 );
		this.contactParticle = appGlobal.particles.slime;
		this.killed = false;
		const self = this;
		this.startPos = new Vector3().copy( OBJ.pos );

		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 2000)
		//sphereIdx = ( sphereIdx + 1 ) % spheres.length;
	}
	
	update(){
		if(!this.killed && appGlobal.localPlayer){
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
				
				let arr = [];
				if(window.socket!=null){
					arr = appGlobal.globalHelperFunctions.splashDamage(this.knockParams);
				}else{
					arr = this.playerSplashDamage(this.knockParams);
				}
				
				if(arr.length>0){
					for(let i = 0; i<arr.length; i++){
						const self = this;
						if(window.socket!=null){
							socket.emit('doDamage', {
						  		id: arr[i].id,
						  		damage:self.damage*arr[i].damageMult,
						  		position:this.startPos,
						  		headShot:false,
						  		fromDamageId:socket.id
							});
						}else{
							if(appGlobal.localPlayer!=null)
								appGlobal.localPlayer.receiveDamageBots({position:this.mesh.position, health:this.damage})
						}
					}			
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

	resetKill(){
		if(!this.killed){
			this.killed = true;
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			window.appGlobal.scene.remove(this.mesh);
		}
	}

	playerSplashDamage(OBJ){
		if(appGlobal.localPlayer!=null){
			const arr = [];
			
			const start = new Vector3().copy(appGlobal.localPlayer.playerCollider.start);// = new THREE.Vector3();
			//.getWorldPosition(start);
			const dist = start.distanceTo(OBJ.pos);
			const id = appGlobal.localPlayer.id;
			if(dist < OBJ.distance){
				const s = (OBJ.distance-dist)/OBJ.distance;
				const obj = {damageMult:s, id:id};
				arr.push(obj);
			}
				
			return arr;
		}
		return [];
	}

	playerSphereCollision() {
		
		const start = new Vector3().copy(appGlobal.localPlayer.playerCollider.start);
		const end = new Vector3().copy(appGlobal.localPlayer.playerCollider.end);
		
		const vector = new Vector3();
		const center = vector.addVectors(start, end).multiplyScalar( 0.5 );

		const playerRadius = appGlobal.localPlayer.playerCollider.radius*2;
		const r = playerRadius + this.collider.radius;
		
		const r2 = r * r;
		
		// approximation: player = 3 spheres
		
		for ( const point of [ start, center, end ] ) {
			const d2 = point.distanceToSquared( this.collider.center );
			if ( d2 < r2 ) {
				this.kill();
			}	
		}
	}



}

export { BotBullet };
