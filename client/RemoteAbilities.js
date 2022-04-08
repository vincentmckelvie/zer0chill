import {
	Object3D,
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Scene,
	SphereGeometry,
	Color,
	AdditiveBlending,
	DoubleSide
	
} from 'three';
import { ParticleEmitter } from './ParticleEmitter.js';

class RemoteAbilities {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {

		this.remotePlayer = OBJ.remotePlayer;
		this.shouldDoBlinkParticle = false;
		this.blinkParticle = new ParticleEmitter(appGlobal.particles.blink);
		this.doubleJumpParticle = new ParticleEmitter(appGlobal.particles.doubleJump);
		
		const geo = new SphereGeometry(2,8,8);
		const mat = new MeshStandardMaterial({color:new Color().setHSL(.4,1,.8), transparent:true, opacity:.2, side:DoubleSide, blending:AdditiveBlending});
		
		this.wallHackSphere = new Mesh(geo,mat);
		appGlobal.scene.add(this.wallHackSphere)
		this.wallHackSphere.scale.set(0,0,0);
		this.blinkTimeout = null;

	}

	update(){
		if(!this.killed){
			
			if(this.shouldDoBlinkParticle){
				this.blinkParticle.obj.pos.copy(this.remotePlayer.endWorldPosition);
				this.blinkParticle.emit();
			}
			this.blinkParticle.update();
			this.doubleJumpParticle.update();
			
			//this.crouchVal += (this.crouchTarg-this.crouchVal)*(200*appGlobal.deltaTime);
			//this.crouch.position.y = this.crouchVal;
		
			//this.mesh.quaternion.copy(this.targRot);
			//this.mesh.position.copy(this.targPos)
		}
	}
	updateRemote(OBJ){
		const self = this;
		switch(OBJ.abilityName){
			case "blink":
				this.shouldDoBlinkParticle = true;
				this.blinkTimeout = setTimeout(function(){
					self.shouldDoBlinkParticle = false;
				},700);
			break;
			case "wall hack":
				this.wallHackSphere.position.copy(this.remotePlayer.endWorldPosition);
				gsap.to(this.wallHackSphere.scale, {duration:4, x:200,y:200,z:200, delay:0, onComplete:function(){
					self.wallHackSphere.scale.set(0,0,0);
				}});
			break;
			case "double jump":
				this.doubleJumpParticle.obj.pos.copy(this.remotePlayer.offset.position);
				this.doubleJumpParticle.emit();
			break;
		}
	}
  	kill(){

  		if(this.blinkTimeout!=null){
  			clearTimeout(this.blinkTimeout);
  		}

  		this.blinkParticle.kill();
		this.doubleJumpParticle.kill();
  		
  		this.killed = true;
  		this.shouldDoBlinkParticle = false;
  		this.wallHackSphere.geometry.dispose();
		this.wallHackSphere.material.dispose();
		appGlobal.scene.remove(this.wallHackSphere);
  	}
}

export { RemoteAbilities };
