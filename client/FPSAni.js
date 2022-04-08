import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	AnimationObjectGroup,
	AnimationMixer,
	LoopOnce
} from 'three';
import { clone } from "./scripts/jsm/utils/SkeletonUtils.js";
import { WeaponEmissiveHandler } from "./WeaponEmissiveHandler.js";

class FPSAni {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ) {

		const self = this;
		const model = self.getModelByName(OBJ.model)
		this.weaponName = OBJ.name;
		this.mesh = clone( model.scene );
		
		appGlobal.controller.playerCamera.add(this.mesh);

		this.mesh.position.z -= 0;
		this.animations = model.animations;
		this.flock = new AnimationObjectGroup;
		this.flock.add(this.mesh);
		this.mixer = new AnimationMixer(this.flock);
		
		this.idle = this.mixer.clipAction( self.getAniByName(this.animations, "idle"));
		this.ads =  this.mixer.clipAction( self.getAniByName(this.animations, "ads" ));
		this.run =  this.mixer.clipAction( self.getAniByName(this.animations, "run" ));

		this.idle.play();
		this.ads.play();
		this.run.play();
		this.inc = 0;
		
		this.mesh.rotation.y += Math.PI;
		this.idle.weight = 1;
		this.ads.weight = 0;
		this.deltaMult = 4;
		this.idleTarg = 1;
		this.adsTarg = 0;
		this.rotTarg = new Vector3();
		const emissive = self.getMaterialByName("emissive", this.mesh);
		const blast = self.getMaterialByName("blast", this.mesh);
		//let name = "tip";
		//if(OBJ.model == "sniper" || OBJ.model == "sixgun" || OBJ.model == "launcher" || OBJ.model == "submachine")
		let name = "tip-"+OBJ.model;
		this.tipObject = this.mesh.getObjectByName(name);
		this.tipPosition = new Vector3(); 
		this.boosting = false;
		this.boostTarg = 0;
		this.emissiveHelper = new WeaponEmissiveHandler({name:OBJ.model, emissive:emissive, blast:blast, blastModel:this.tipObject});
		this.reloading = false;
	}
	
	update(){
		this.tipObject.getWorldPosition(this.tipPosition);
		this.emissiveHelper.update();
		this.mixer.update(appGlobal.deltaTime*this.deltaMult);
		const ez = 90;
		const ezShoot = 40;
		this.idle.weight += (this.idleTarg - this.idle.weight)   * (ez*appGlobal.deltaTime);	
		this.ads.weight  +=  (this.adsTarg - this.ads.weight )   * (ez*appGlobal.deltaTime);
		this.run.weight  +=  (this.boostTarg - this.run.weight )   * (ez*appGlobal.deltaTime);	
		if(!this.reloading){
			this.mesh.rotation.x += (0 - this.mesh.rotation.x)       * (ezShoot*appGlobal.deltaTime)
			this.mesh.rotation.y += (Math.PI  - this.mesh.rotation.y)* (ezShoot*appGlobal.deltaTime)
		}
		if(this.boosting && !this.reloading){
			this.inc+=(appGlobal.deltaTime*80);
			this.mesh.position.y=Math.sin(this.inc)*.06;
		}else{
			this.mesh.position.y+=(0-this.mesh.position.y)*appGlobal.deltaTime*40
		}
	}

	reloadAnimation(TIME){
		this.reloading = true;
		const self = this;
		gsap.to(this.mesh.rotation,   {duration:TIME/2, /*y:Math.PI,*/ x:-Math.PI*.4, /*z:0 */});
		gsap.to(this.mesh.rotation,   {duration:TIME/2, /*y:Math.PI, */x:0, /*z:0,*/ delay:TIME/2, onComplete:function(){self.reloading = false;}}); 
	}

	shoot(OBJ){
		this.emissiveHelper.shoot(OBJ)
		if(this.adsTarg>0){
			const xRnd = .01+Math.random()*.01;
			this.mesh.rotation.x = xRnd;
			const yRnd = -.01+Math.random()*.02;
			this.mesh.rotation.y = Math.PI+yRnd;
		}else{
			const xRnd = .1+Math.random()*.1;
			this.mesh.rotation.x = xRnd;
			const yRnd = -.1+Math.random()*.1;
			this.mesh.rotation.y = Math.PI+yRnd;
		}
	}

	toggleADS(ADSING){
		if(!this.boosting){
			if(ADSING){
				this.adsTarg = 1;
				this.idleTarg = 0;
				this.boostTarg = 0;
				if(this.weaponName=="sniper")
					this.mesh.visible = false;
			}else{
				this.adsTarg = 0;
				this.idleTarg = 1;
				this.boostTarg = 0;
				if(this.weaponName=="sniper")
					this.mesh.visible = true;
			}
		}
	}
	toggleBoost(BOOST){
		this.boosting = BOOST;
		if(BOOST){
			this.adsTarg = 0;
			this.idleTarg = 0;
			this.boostTarg = 1;
		}else{
			this.boostTarg = 0;
		}
	}
	getMaterialByName(NAME, MESH){
		let mat;
		MESH.traverse( function( object ) {
			if(object.isMesh){
				object.frustumCulled = false;
			}
    		if ( object.material ) {
    			if(object.material.name == NAME){
    				mat = object.material;
    			}
    		}

		} );

		return mat;
	}
	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name==NAME)
				return appGlobal.loadObjs[i].model;	
		}
		
	}
	getAniByName(anis, name){
		for(let i = 0; i<anis.length; i++){
			let text = anis[i].name;
			let result = text.includes(name);
			if(result)
				return anis[i];
		}
	}


	kill(){
		appGlobal.controller.playerCamera.remove(this.mesh)
	}

}

export { FPSAni };
