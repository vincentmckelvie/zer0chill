import {
	Object3D,
	BoxGeometry,
	MeshNormalMaterial,
	Mesh,
	Vector3,
	Vector2,
	Quaternion,
} from 'three';
import { GlobalParticleHandler } from './GlobalParticleHandler.js';

class BotWeapon {
	//{shootCooldown:shootCooldown, bullet:bullet};
	constructor(OBJ) {
		this.weaponObj = OBJ;
		this.player = OBJ.player;
		this.shootCooldown = OBJ.shootCooldown;
		this.bullet = OBJ.bullet; // class 
		this.ammoAmount = OBJ.ammoAmount;
		this.reloadCooldown = OBJ.reloadCooldown;
		this.zoom = OBJ.zoom;
		this.adsRandom = OBJ.adsRandom;
		this.impulse = OBJ.impulse;
		this.contactParticle = OBJ.contactParticle;
		this.damage = OBJ.damage;
		if(OBJ.knockParams!=null)
			this.knockParams = OBJ.knockParams;
		this.sound = OBJ.sound;
		this.name = OBJ.name;
		this.adsMouseSensMult = OBJ.adsMouseSenseMult;
			 	
		this.firing = false;
		this.inc = 0;
		this.bullets = [];
		this.shootReset = false;
		this.canShoot = true;
		this.shootTimeout;		
		this.currentAmmo = this.ammoAmount;
		this.contactEmitters = [];
		this.abilityCanShoot = true;
		this.shouldShoot = false;

		
	}

	//{mouse:this.mouse, time:deltaTime, world:world}
	
	update(){
		if(this.shouldShoot && appGlobal.localPlayer!=null){
			if(this.canShoot && !this.player.boosting && this.abilityCanShoot){
				
				if(this.currentAmmo != 0){
					this.shoot();
				}
			 	
			 	this.canShoot = false;
			 	const self = this;
			 	
			 	if(this.currentAmmo == 0){
			 		this.reload();
			 	}else{
			 		this.shootTimeout = setTimeout(function(){
				 		self.canShoot = true;
					}, this.shootCooldown-window.timeIncrease.shootSpeed);
			 	}

			 	this.currentAmmo --;
			 	let fnlAmmo = this.currentAmmo ;
			 	if(fnlAmmo<0)
			 		fnlAmmo = 0;
			 	//this.player.hud.updateAmmo(fnlAmmo);
			}
		}

		for(let i = 0; i<this.bullets.length;i++ ){
			this.bullets[i].update();
		}
		for(let i = 0; i<this.contactEmitters.length;i++ ){
			this.contactEmitters[i].update();
		}

	}

	reload(){
		if(this.currentAmmo < this.ammoAmount){
			this.canShoot = false;
			//this.player.fps.reloadAnimation(this.reloadCooldown/1000);
			//this.player.hud.toggleReload(true)
			const self = this;
			
			
			if(this.shootTimeout!=null){
				clearTimeout(this.shootTimeout);
			}

			this.shootTimeout = setTimeout(function(){
				
				//self.player.hud.toggleReload(false)
			
		 		self.canShoot = true;
		 		self.currentAmmo = self.ammoAmount;
		 		//self.player.hud.updateAmmo(self.currentAmmo);

			}, this.reloadCooldown);
		}

	}

	shoot(){
		//this.player.fps.shoot({ammoMax:this.ammoAmount, currAmoo:this.currentAmmo});
		const name = this.name;
		
		const bullet = this.bullet;
		const obj = this.makeBulletObj();
		appGlobal.soundHandler.playSoundByName({name:this.sound, dist:1});
		if(window.socket !=null ){
			socket.emit('shoot', {
			  obj: obj,
			  id: socket.id,
			  name: name
			})
		}

		this.bullets.push(new this.bullet(obj, true));
	}
	
	makeBulletObj(){
		
		let rndMult = 1; 
		let rx = 0;
		let ry = 0;
		let rz = 0;
		let rnd = new Vector3(); 
		let dir = new Vector3();
		let dirMiss = new Vector3();
		let pos = new Vector3();
		let kp;
		let obj;
		
		switch(this.name){
			case "bot":
			
				const dir = new Vector3().copy( appGlobal.localPlayer.playerCollider.end );
				dir.sub(this.player.tipPos )
				dir.normalize();
				
				rx = ((-this.adsRandom*.5)+Math.random()*this.adsRandom)*rndMult;
				ry = ((-this.adsRandom*.5)+Math.random()*this.adsRandom)*rndMult;
				rz = ((-this.adsRandom*.5)+Math.random()*this.adsRandom)*rndMult;
				
				rnd = new Vector3().set( rx,ry,rz );
				dir.add(rnd);
				
				//pos = new Vector3().copy( this.player.playerCollider.end ).addScaledVector( dir, this.player.playerCollider.radius * 1.5 );
				pos = this.player.tipPos;
				kp = {
					pos:new Vector3(), 
					distance:0, 
					strength:0, 
					gravMult:0
				}
				if(this.knockParams != null){
					kp = {
						pos:new Vector3(), 
						distance:this.knockParams.distance, 
						strength:this.knockParams.strength, 
						gravMult:this.knockParams.gravMult
					};
				}
				obj = {
					pos:pos,
					impulse:this.impulse,
					dir:dir,
					knockParams:kp,
					damage:this.damage,
					id:this.player.id,
					worldPosition:appGlobal.world.worldPosition,
				}
			break;
			
		}
		return obj;
	}



	hitScanHelper(OBJ){
		
		let hitPoint = new Vector3();
		let hitId = null;
		let isHead = false;
		appGlobal.raycaster.setFromCamera( new Vector2(OBJ.dir.x,OBJ.dir.y), appGlobal.controller.playerCamera );
		const intersection = appGlobal.raycaster.intersectObjects( appGlobal.hitScanArray, false );

		if ( intersection.length > 0 ) {
			hitPoint.copy(intersection[ 0 ].point);
			if(intersection[0].object.playerId != null){
				hitId = intersection[0].object.playerId;
			}
			if(intersection[0].object.isHead != null){
				isHead = intersection[0].object.isHead;
			}
			return {hit:true, hitPoint:hitPoint, distance:intersection[ 0 ].distance, hitId:hitId, isHead:isHead};
		}
		return null;
		
	}
	kill(){
		this.shouldShoot = false;
		for(let i = 0; i<this.bullets.length;i++ ){
			this.bullets[i].resetKill();
		}
		for(let i = 0; i<this.contactEmitters.length;i++ ){
			this.contactEmitters[i].kill();
		}
		this.bullets = [];
		this.contactEmitters = [];
	}

}

export { BotWeapon };
