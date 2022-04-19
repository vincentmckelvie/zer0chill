import {
	Object3D,
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	AnimationObjectGroup,
	AnimationMixer,
	LoopOnce
} from 'three';
class CharacterAnimationHandler{
	constructor(OBJ){
		this.contains = [ 
			"thigh",
			"calf", 
			"spine", 
			"pelvis", 
			"foot",
			"ball",
		];

		this.meshes = OBJ.meshes;

		this.flock = new AnimationObjectGroup;
		for(let i = 0; i<this.meshes.length; i++){
			this.flock.add(this.meshes[i]);	
		}
		
		this.mixer = new AnimationMixer(this.flock);
		//mixers.push(this.mixer);
		this.animations = OBJ.animations;
		
		this.idle;
		this.forward;
		this.right;
		this.left;
		this.back;
		this.gunIdle;
		this.adsIdle;
		this.gunFire;
		this.jump;
		this.jumpStart;
		this.ezTime = .2;
		this.shouldDoAni =  false;
		this.spineBones = [];

		this.adsTarg = 1;
		this.gunTarg = 0;
		
		this.idleTarg = 1;
		this.leftTarg = 0;
		this.rightTarg = 0;
		this.forwardTarg = 0;
		this.backTarg = 0;
		this.jumpTarg = 0;
		
		

		this.gunAnis = [];
		this.modelName = OBJ.name;

	}
	
	
	initAnimation(){

		const tposeAni = this.getAniByName(this.animations,"tpose");
		const idleAni = this.getAniByName(this.animations,"idle-2");
		//idleAni.timeScale = 20;
		const runFAni = this.getAniByName(this.animations,"run_f");
		const runRAni = this.getAniByName(this.animations,"run_r");
		const runLAni = this.getAniByName(this.animations,"run_l");
		const runBAni = this.getAniByName(this.animations,"run_b");
		const jumpAni = this.getAniByName(this.animations,"jump");
		
		const gunAniSubmachine =  this.getAniByName(this.animations,"submachine-idle");
		const adsAniSubmachine =  this.getAniByName(this.animations,"submachine-ads");
		
		const gunAniAssault =  this.getAniByName(this.animations,"assault-idle");
		const adsAniAssault =  this.getAniByName(this.animations,"assault-ads");
		const gunAniSticky =  this.getAniByName(this.animations,"sticky-idle");
		const adsAniSticky =  this.getAniByName(this.animations,"sticky-ads");
		const gunAniLauncher =  this.getAniByName(this.animations,"launcher-idle");
		const adsAniLauncher =  this.getAniByName(this.animations,"launcher-ads");
		const gunAniSixGun =  this.getAniByName(this.animations,"sixgun-idle");
		const adsAniSixGun =  this.getAniByName(this.animations,"sixgun-ads");
		const gunAniSniper =  this.getAniByName(this.animations,"sniper-idle");
		const adsAniSniper =  this.getAniByName(this.animations,"sniper-ads");

		
		this.parseAnimation(idleAni, true);
		this.parseAnimation(runRAni, true);
		this.parseAnimation(runLAni, true);
		this.parseAnimation(runFAni, true);
		this.parseAnimation(runBAni, true);
		this.parseAnimation(jumpAni, true);

		this.parseAnimation(tposeAni, false);
		this.parseAnimation(gunAniSubmachine,  false);
		this.parseAnimation(adsAniSubmachine,  false);
		this.parseAnimation(gunAniAssault,     false);
		this.parseAnimation(adsAniAssault,     false);
		this.parseAnimation(gunAniSticky,      false);
		this.parseAnimation(adsAniSticky,      false);
		this.parseAnimation(gunAniLauncher,    false);
		this.parseAnimation(adsAniLauncher,    false);
		this.parseAnimation(gunAniSixGun,      false);
		this.parseAnimation(adsAniSixGun,      false);
		this.parseAnimation(gunAniSniper,      false);
		this.parseAnimation(adsAniSniper,      false);

		this.idle = this.mixer.clipAction(     idleAni);  
		this.idle.timeScale = 1.4;
		this.right = this.mixer.clipAction(    runRAni);
		this.left = this.mixer.clipAction(     runLAni);
		this.forward = this.mixer.clipAction(  runFAni);
		this.back = this.mixer.clipAction(     runBAni);
		
		switch(this.modelName){
			case "submachine":
				const gunIdleSubmachine = this.mixer.clipAction(  gunAniSubmachine);
				const adsIdleSubmachine = this.mixer.clipAction(  adsAniSubmachine);
				this.adsIdle = adsIdleSubmachine;
				this.gunIdle = gunIdleSubmachine;
				//this.gunAnis.push({name:"submachine", idle:gunIdleSubmachine, ads:this.adsIdleSubmachine})
			break;
			case "assault":
				const gunIdleAssault = this.mixer.clipAction(     gunAniAssault);
				const adsIdleAssault = this.mixer.clipAction(     adsAniAssault);
				//this.gunAnis.push({name:"assault", idle:gunIdleAssault, ads:adsIdleAssault})
				this.adsIdle = adsIdleAssault;
				this.gunIdle = gunIdleAssault;
			
			break;
			case "sticky":
				const gunIdleSticky = this.mixer.clipAction(      gunAniSticky);
				const adsIdleSticky = this.mixer.clipAction(      adsAniSticky);
				//this.gunAnis.push({name:"sticky", idle:gunIdleSticky, ads:adsIdleSticky})
				this.adsIdle = adsIdleSticky;
				this.gunIdle = gunIdleSticky;
			break;
			case "launcher":
				const gunIdleLauncher = this.mixer.clipAction(    gunAniLauncher);
				const adsIdleLauncher = this.mixer.clipAction(    adsAniLauncher);
				this.adsIdle = adsIdleLauncher;
				this.gunIdle = gunIdleLauncher;
				//this.gunAnis.push({name:"launcher", idle:gunIdleLauncher, ads:adsIdleLauncher})
			break;
			case "sixgun":
				const gunIdleSixGun = this.mixer.clipAction(      gunAniSixGun);
				const adsIdleSixGun = this.mixer.clipAction(      adsAniSixGun);
				this.adsIdle = adsIdleSixGun;
				this.gunIdle = gunIdleSixGun;
			break;
			//this.gunAnis.push({name:"sixgun", idle:gunIdleSixGun, ads:adsIdleSixGun})
			case "sniper":
				const gunIdleSniper = this.mixer.clipAction(      gunAniSniper);
				const adsIdleSniper = this.mixer.clipAction(      adsAniSniper);
				this.adsIdle = adsIdleSniper;
				this.gunIdle = gunIdleSniper;
			break;
			case "bot":
				const gunIdleBot = this.mixer.clipAction(      tposeAni);
				const adsIdleBot = this.mixer.clipAction(      tposeAni);
				this.adsIdle = adsIdleBot;
				this.gunIdle = gunIdleBot;
			break;
		}

		//this.gunAnis.push({name:"sniper", idle:gunIdleSniper, ads:adsIdleSniper})
		
		this.jump = this.mixer.clipAction(     jumpAni);

		for(let i = 0; i<this.animations.length; i++){
			this.removeAnimationFromBone(this.animations[i], "spine_01");
		}
		//this.jumpStart = this.mixer.clipAction(this.animations[7]);
		
		this.idle.play();
		this.forward.play();
		this.right.play();
		this.left.play();
		this.back.play();
		this.jump.play();
		
		
		this.gunIdle.play();
		this.adsIdle.play();

		this.idle.weight = 0;
		this.forward.weight = 0;
		this.right.weight = 0;
		this.left.weight = 0;
		this.jump.weight = 1;
		//this.jumpStart.setLoop(LoopOnce);
		
		this.shouldDoAni = true;
		this.deltaMult = 4;
		
	}
	
	// updateSpineRotation (ROT){
	// 	for(let k = 0; k<this.spineBones.length; k++){
	// 		this.spineBones[k].rotation.z = ROT;
	// 	}
	// }
	
	//this.aniInfo = null;// this.cah.getServerInfo();
	handleAnimationEasing (TIME, OBJ){
		
		this.idleTarg = 0;
		this.leftTarg = 0;
		this.rightTarg = 0;
		this.forwardTarg = 0;
		this.jumpTarg = 0;
		this.backTarg = 0;
		if( OBJ.jump ){
			this.jumpTarg = 1;
		}else{
			if(!Math.abs(OBJ.xAxis) > 0 && !Math.abs(OBJ.yAxis) > 0 ){
				this.idleTarg = 1;
			}else{
				if( Math.abs(OBJ.yAxis) > 0){
					if(OBJ.yAxis>0){
						this.forwardTarg = 1;
					}else {
						this.backTarg = 1;
					}
				}else if( Math.abs(OBJ.xAxis) > 0){
					if(OBJ.xAxis>0){
						this.rightTarg = 1;
					}else {
						this.leftTarg = 1;
					}
				}
			}
		}

		// if(Math.random() > 0.98){
		// 	console.log(this.rightTarg)
		// }

		// gsap.to(this.idle,   {duration:TIME, weight:idle}); 
  //   gsap.to(this.forward,{duration:TIME, weight:forward});
  //   gsap.to(this.left,   {duration:TIME, weight:left});
  //   gsap.to(this.right,  {duration:TIME, weight:right}); 
  //   gsap.to(this.back,   {duration:TIME, weight:back}); 
  //   gsap.to(this.jump,   {duration:TIME, weight:jump}); 
    
    this.deltaMult = 4;
    
    if(OBJ.boost){
    	this.deltaMult = 7;
    }
	
	}

	update(){
		if(this.shouldDoAni){
			this.mixer.update(appGlobal.deltaTime*this.deltaMult);
			if(this.adsing){
				this.adsTarg = 1;
				this.gunTarg = 0;
			}else{
				this.adsTarg = 0;
				this.gunTarg = 1;
			}

			this.adsIdle.weight += (this.adsTarg-this.adsIdle.weight)*(appGlobal.deltaTime*90)
			this.gunIdle.weight += (this.gunTarg-this.gunIdle.weight)*(appGlobal.deltaTime*90)
			
		
			this.idle.weight    +=  (this.idleTarg-this.idle.weight)      *(appGlobal.deltaTime*150)
			this.forward.weight +=  (this.forwardTarg-this.forward.weight)*(appGlobal.deltaTime*150)
			this.left.weight    +=  (this.leftTarg   -this.left.weight)   *(appGlobal.deltaTime*150)
			this.right.weight   +=  (this.rightTarg-this.right.weight)    *(appGlobal.deltaTime*150)
			this.back.weight    +=  (this.backTarg-this.back.weight)      *(appGlobal.deltaTime*150)
			this.jump.weight    +=  (this.jumpTarg-this.jump.weight)      *(appGlobal.deltaTime*150)


			// this.idle.weight    =  this.idleTarg
			// this.forward.weight =  this.forwardTarg
			// this.left.weight    =  this.leftTarg
			// this.right.weight   =  this.rightTarg
			// this.back.weight    =  this.backTarg
			// this.jump.weight    =  this.jumpTarg
			
		}
	}
	updateRemote(OBJ){
		this.adsing = OBJ.adsing;
		if(this.shouldDoAni){
			this.handleAnimationEasing(.2, OBJ);	
		}
	}

	parseAnimation( animation, legs ) {

	  const hierarchyTracks = animation.tracks;
	  for ( let h = 0; h < hierarchyTracks.length; h ++ ) {
	    const split = hierarchyTracks[h].name.split('.');
	    const check = this.checkContainsAniName(this.contains, split[0]);
	    if(legs){
	      if(!check){
	        hierarchyTracks.splice(h, 1);
	        h--; 
	      }
	    }else{
	      if(check){
	        hierarchyTracks.splice(h, 1);
	        h--; 
	      }     
	    }
	  }

	}

	getAniByName(anis, name){
		for(let i = 0; i<anis.length; i++){
			if(anis[i].name==name)
				return anis[i];
		}
	}

	removeAnimationFromBone( animation, name ) {

	  const hierarchyTracks = animation.tracks;
	  for ( let h = 0; h < hierarchyTracks.length; h ++ ) {
	    const split = hierarchyTracks[h].name.split('.');
	    const check = this.checkContainsAniName([name],split[0]);
	    if(check){
	      hierarchyTracks.splice(h, 1);
	      h--; 
	    }
	  }

	}

	checkContainsAniName(array, aniName){
  
	  for(var i = 0; i<array.length;i++){
	    if(aniName.includes(array[i])){
	      return true;
	    }
	  }
	  return false;
	}

}
export { CharacterAnimationHandler };

/*
function checkWalkBones(bone){
  for(var i = 0; i<walkBones.length;i++){
    if(bone == walkBones[i]){
      return true;
    }
  }
  return false;
}

function checkShootBones(bone){
  for(var i = 0; i<armBones.length;i++){
    if(bone == armBones[i]){
      return true;
    }
  }
  return false;
}
//walkbones armbones
function checkNameArray(arr, bone, print){
  const split = bone.split('.');
  for(var i = 0; i<arr.length; i++){
    if(arr[i].name == split[0]){
      if(print){
        //console.log("bone = "+arr[i].name)
        //console.log("split = "+split[0])
      }
      return true;
    }
  }
  return false;
}


function checkContains(bone){

  for(var i = 0; i<contains.length;i++){
    if(bone.name.includes(contains[i])){
      return true;
    }
  }
  return false;
}


function checkTrackName(arrCheck1, arrCheck2){
  for(var i = 0; i<arrCheck1.length; i++){
    for(var h = 0; h<arrCheck2.length; h++){
      if(arrCheck1[i].name == arrCheck2[h].name){
        // console.log(i)
        // console.log(arrCheck1[i].name)
        //return true;
      }
    }
  }
  return false
}

function handlePositionCheck(OBJ){
    var target = new THREE.Vector3();
    OBJ.getWorldPosition( target );
    var dist = target.distanceTo( new THREE.Vector3() );
    var distCheck = 50000000000000000.5;
    if( dist > distCheck ){
      return false;
    }
    return true;  
}



function movementCheckMobile(){
  if(player){
    if(mouse.delta.y>0){
      if(handlePositionCheck(player.checkFront)){
        return true;
      } 
    }else {
      if(handlePositionCheck(player.checkBack)){
        return true;
      }
    }
    return false;
  }
  return false;
}

function movementCheckDesktop(){
  if(player){
    if(keys.w){
      if(handlePositionCheck(player.checkFront)){
        return true;
      } 
    }else if (keys.s){
      if(handlePositionCheck(player.checkBack)){
        return true;
      }
    }
    if(keys.a){
      if(handlePositionCheck(player.checkRight)){
        return true;
      } 
    }else if (keys.d){
      if(handlePositionCheck(player.checkLeft)){
        return true;
      }
    }
    return false;
  }
  return false;
}
*/