import {
	Object3D,
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Scene,
	TextureLoader,
	Color,
	RepeatWrapping,
	ClampToEdgeWrapping,
	LinearFilter
} from 'three';

import { ParticleEmitter } from './ParticleEmitter.js';
import { CharacterAnimationHandler } from './CharacterAnimationHandler.js';
import { clone } from "./scripts/jsm/utils/SkeletonUtils.js";
import { RemoteAbilities } from "./RemoteAbilities.js";
import { SkinsHandler } from "./SkinsHandler.js";

class RemotePlayer {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		const self = this;
		const geo = new BoxGeometry( 2, 2.5, 1.5 );
		const headGeo = new BoxGeometry(1.4/4,1.6/4,1.4/4);
		const headGeo1 = new BoxGeometry(1.4,1.6,1.4);
		
		const mat = new MeshStandardMaterial({    color:0x00ff00, visible:false});
		const headMat = new MeshStandardMaterial({color:0xff0000, visible:false});
		const headMat1 = new MeshStandardMaterial({color:0x0000ff,visible:false});
		this.offset = new Object3D();
		this.crouch = new Object3D();
		this.characterHolder = new Object3D();
		this.skin = OBJ.skin;

		this.character = clone( self.getModelByName("body-"+OBJ.meshName).scene );

		//const ar = [];
     //  	this.character.traverse( function ( obj ) {

	    //     if(obj.isMesh || obj.isSkinnedMesh){
	    //       if(obj.material !=null ){
	    //       	if(!self.checkIsInArr(ar, obj.material.name)){
	    //       		ar.push(obj.material.name);
					// console.log("{");
					// console.log("name:'"+obj.material.name+"',");
					// console.log("color:'"+obj.material.color.getHexString()+"',");
					// console.log("emissive:'"+obj.material.emissive.getHexString ()+"'");
					// console.log("}");
	    //         }
	    //       }
	    //     }

     //  	});

		this.movement  = clone( self.getModelByName(OBJ.meshName+"-"+OBJ.movement).scene );
		
		appGlobal.skinsHandler.changeSwatchOnMesh({meshes:[this.character, this.movement], name:OBJ.meshName},this.skin);

		this.boostTip;
		this.boostTexture = new TextureLoader().load( './assets/textures/boost.png' );
		this.boostTexture.wrapS = RepeatWrapping;
		this.boostTexture.wrapT =  ClampToEdgeWrapping;
		this.boostTexture.magFilter = LinearFilter; 

		this.movement.traverse( function ( obj ) {
			if(obj.name.includes("boost-part")){
				obj.material.transparent = true;
				obj.material.map = self.boostTexture;
				obj.material.emissiveMap = self.boostTexture;
				obj.material.color = new Color(0x000000);
				obj.material.emissive = new Color(0xffbf80);
				self.boostTip = obj;
			}
		});
		const s = 3.25;
		this.character.position.z = this.movement.position.z = -.2;
		this.character.scale.set(s,s,s);
		this.movement.scale.set(s,s,s);
		
		appGlobal.characterOutlineMeshes.push(this.character);
		appGlobal.characterOutlineMeshes.push(this.movement);
		appGlobal.scene.characterOutlinePass.selectedObjects = appGlobal.characterOutlineMeshes;
		
		this.character.position.y = this.movement.position.y = -1.25;
		this.characterHolder.rotation.y += Math.PI;

		this.mesh = new Mesh(geo,mat);
		this.mesh.position.y = -.25;
		this.head = new Mesh(headGeo, headMat);
		this.head.position.y = .1;
		
		
		this.offset.add(this.crouch);
		//this.crouch.add(this.mesh, this.head, this.characterHolder);
		this.crouch.add(this.mesh, this.characterHolder);
		this.headBone = this.character.getObjectByName( 'head' );
		this.headBone.add(this.head)
		this.characterHolder.add(this.character, this.movement);
		this.hitScanArrayIndex = appGlobal.hitScanArray.length;
		
		appGlobal.hitScanArray.push(this.mesh, this.head);
		appGlobal.scene.add(this.offset);

		this.targPos = new Vector3();
		this.targRot = new Quaternion();
		this.slerpRot = new Quaternion();
		this.killed = false;
		this.start = new Object3D();
		this.end = new Object3D();
		this.end.position.y = 0;
		this.headBone.add(this.end);

		this.head1 = new Mesh(headGeo, headMat1);
		this.end.add(this.head1)
		
		this.endWorldPosition = new Vector3();
		this.offset.add(this.start);
		//this.offset.add(this.end);
		this.id = OBJ.id;
		this.mesh.playerId = this.id;
		this.head.playerId = this.id;
		this.mesh.isHead = false;
		this.head.isHead = true;
		//this.radius = .35;
		this.radius = .45;

		this.shouldDoBoostParticle = false;
		
		this.boostParticle = new ParticleEmitter(appGlobal.particles.boost);
		const arr = [this.character, this.movement];
		this.cah = new CharacterAnimationHandler({meshes:arr, animations:appGlobal.loadObjs[0].model.animations, name:OBJ.meshName});
		this.cah.initAnimation();
		this.remoteAbilites = new RemoteAbilities({remotePlayer:this});
		this.spines = [this.character.getObjectByName( 'spine_01' ), this.movement.getObjectByName( 'spine_01' )] 
		
		let name = "tip-" + OBJ.meshName;
		this.tipObject = this.character.getObjectByName(name);
		this.tipObject.visible = false;
		
		this.tipPos = new Vector3();
		this.spineRotTarg = 0;
		this.shootTimeout;

		// this.blastTexture = new TextureLoader().load( './assets/textures/shoot-2.png' );
		// this.tipObject.material.transparent = true;
		// this.tipObject.material.opacity = 1;
		this.tipObject.material.emissive = new Color(0xffad2b);
		//this.tipObject.material.map = this.blastTexture;

		this.stepsTimeout;
		this.playerMovingForWalkSound = false;
		this.canDoWalkSound = true;
		this.currStep = 0;
		this.rotMod = 0;
		this.boostTipWorldPosition = new Vector3();
				
		
	}

	checkIsInArr(arr,s){
		for(let i = 0; i<arr.length; i++){
			if(arr[i]==s){
				return true;
			}
		}
		return false;
	}

	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name==NAME)
				return appGlobal.loadObjs[i].model;	
		}
	}

	update(){
		if(!this.killed){

			this.rotMod += (appGlobal.deltaTime*400);
			if(Math.floor(this.rotMod%10) == 0){
				this.boostTexture.offset.x += .2+Math.random()*.35;
			}

			this.boostTip.visible = this.shouldDoBoostParticle;

			this.tipObject.getWorldPosition(this.tipPos);
			
			this.offset.position.lerp(this.targPos, .2);
			this.slerpRot.slerp(this.targRot, .2);
			
			this.offset.quaternion.copy(this.slerpRot);
			//console.log(this.slerpRot);

			this.end.getWorldPosition(this.endWorldPosition);
			for(let i = 0; i<this.spines.length; i++){
				this.spines[i].rotation.z += ((this.spineRotTarg)-this.spines[i].rotation.z)*(160*appGlobal.deltaTime); 
			}
			
			if(this.shouldDoBoostParticle){

				//this.boostParticle.obj.pos.copy(this.offset.position);
				this.boostTip.getWorldPosition(this.boostTipWorldPosition);
				this.boostParticle.obj.pos.copy(this.boostTipWorldPosition);
				this.boostParticle.emit();
			}

			this.boostParticle.update();
			
			if(this.playerMovingForWalkSound){
				if(this.canDoWalkSound){
					this.initWalkSound();
				}
			}

			this.cah.update();
			this.remoteAbilites.update();
		
		}
	}

	initWalkSound(){
		this.canDoWalkSound = false;
		if(appGlobal.controller!=null){
			const dist = appGlobal.globalHelperFunctions.getDistanceForSound(this.targPos);
			this.currStep ++;
			this.currStep = this.currStep%2;
			appGlobal.soundHandler.playSoundByName({name:"step-"+this.currStep, dist:dist});
		}

		if(this.stepsTimeout != null){
			clearInterval(this.stepsTimeout);
		}
		
		const self = this;
		this.stepsTimeout = setInterval(function(){
			self.canDoWalkSound = true;
		},330);
	}


	handleRemoteAbility(OBJ){
		this.remoteAbilites.updateRemote(OBJ);
	}

	updateRemote(OBJ){
		//console.log(OBJ);
		this.targPos.set(OBJ.pos.x,OBJ.pos.y, OBJ.pos.z);
		this.targRot.set(OBJ.rot._x, OBJ.rot._y, OBJ.rot._z, OBJ.rot._w);
		this.spineRotTarg = OBJ.spineRot;
		if(OBJ.animationObject.boost && !this.shouldDoBoostParticle){
			const dist = appGlobal.globalHelperFunctions.getDistanceForSound( this.targPos );
			appGlobal.soundHandler.playSoundByName({name:"boost", dist:dist});
		}
		this.shouldDoBoostParticle = OBJ.animationObject.boost;
		this.cah.updateRemote(OBJ.animationObject);
		const moving = (Math.abs(OBJ.animationObject.xAxis) > 0 || Math.abs(OBJ.animationObject.yAxis)>0); 
		
		if(moving && !OBJ.animationObject.jump){
			this.playerMovingForWalkSound = true;
		}else{
			this.playerMovingForWalkSound = false;
		}
  	}

  	handleRemoteShoot(){
  		this.tipObject.visible = true;
  		this.tipObject.rotation.z+=(.4+Math.random()*Math.PI)
  		const self = this;
  		if(this.shootTimeout != null){
  			clearTimeout(this.shootTimeout);
  		}
  		this.shootTimeout = setTimeout(function(){
  			self.tipObject.visible = false;
  		}, 100);

  	}

  	kill(){
  		this.remoteAbilites.kill();
  		this.shouldDoBoostParticle = false;
  		this.killed = true;
  		

		appGlobal.globalHelperFunctions.tearDownObject(this.character);
		
		this.characterHolder.remove(this.character);
  		this.crouch.remove(this.mesh);
  		this.headBone.remove(this.head,this.end);
  		appGlobal.globalHelperFunctions.removeFromHitscanArray(this.mesh);
  		appGlobal.globalHelperFunctions.removeFromHitscanArray(this.head);
  		this.offset.remove(this.start, this.crouch, this.characterHolder);
  		this.boostParticle.kill();
  		appGlobal.scene.remove(this.offset);
  	}
}

export { RemotePlayer };
