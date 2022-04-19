import {
	Object3D,
	CylinderGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from 'three';

class Abilities {
	// {
	// 	type:"hold",//"press"
	//	hasCooldown:false
	//	cooldown:8000,
	//  key:"ShiftLeft"//"KeyE"
	// }
	constructor(OBJ, CHILD) {
		
		this.type = OBJ.type;
		this.cooldown = OBJ.cooldown;
		this.killOnLand = OBJ.killOnLand;
		this.key = OBJ.key;	
		this.abilityTime = OBJ.abilityTime;
		this.name = OBJ.name;
		this.cooldownTimeout;
		this.canDoAbility = false;
		this.doingAbility = false;
		this.child;
		this.canSetClosestWorld = true;
		this.worldIndex = 0;
		this.cooldownUI = OBJ.cooldownUI;
		this.cooldownFill;
		this.dom;
		this.sound = OBJ.sound;
		this.abilityKey = OBJ.abilityKey;
		this.initedAbility = false;
		this.timerHelper = false;
		if(this.cooldownUI){

			this.dom = document.createElement("div");
			this.dom.className = "ability";
			document.getElementById('abilities-holder').append(this.dom);

			this.cooldownFill = document.createElement("div");
			this.cooldownFill.className = "ability-fill";
			this.dom.append(this.cooldownFill);

			const outline = document.createElement("div");
			outline.className = "ability-outline";
			this.dom.append(outline);
			outline.innerHTML = this.abilityKey;

			const name = document.createElement("div");
			name.className = "ability-name";
			name.innerHTML = this.name;
			this.dom.append(name);

		}else{
			if(OBJ.name!="bot"){
				this.dom = document.createElement("div");
				this.dom.className = "passive";
				this.dom.innerHTML = this.name;
				document.getElementById('passive-ability').prepend(this.dom);
			}

		}
	}

	update(){
		//console.log("parent update");
		// switch(this.type){
		// 	case "press":
		// 	break;
		// 	// case "hold":
		// 	// 	if(this.doingAbility)
		// 	// 		this.doAbility();
		// 	// break;
		// }
	}

	

	init(CHILD){
		this.child = CHILD;
		this.canDoAbility = true;
	}


	activateAbility(){
		switch(this.type){
			case "press":
				if(this.child.doAbility != null){
					this.child.doAbility();
				}
			break;
			case "pressConfirm":
				
				if(!this.initedAbility){
					appGlobal.localPlayer.weapon.abilityCanShoot = false;
					this.initedAbility = true;
					if(this.child.initAbilityChild!=null){
						this.child.initAbilityChild();
					}
				}else{
					this.initedAbility = false;
					if(this.child.doAbility != null){
						this.child.doAbility();
					}
				}
			break;
			// case "hold":
			// 	this.doingAbility = true;
			// break;
		
		}
	}

	confirmAbility(){
		
		this.canDoAbility = false;
		this.doingAbility = true;
		
		const self = this;
		
		if(this.cooldownFill != null){
			this.cooldownFill.style.height = "0px";
		}
		
		if(this.sound!=null){
			appGlobal.soundHandler.playSoundByName({name:this.sound, dist:1});
		}
		if(window.socket != null){
			socket.emit('abilityVisual', {
				  id: appGlobal.localPlayer.id,
				  abilityName:this.name,
				  position:appGlobal.localPlayer.playerCollider.end,
				  sound:this.sound
			});
		}


		if(this.abilityTime>0){

			this.abilityTimeout = setTimeout(function(){
				//self.deactivateAbility();
				appGlobal.localPlayer.weapon.abilityCanShoot = true;
				self.doingAbility = false;
				if(self.child.deactivateAbility != null){
					self.child.deactivateAbility();
				}
			}, this.abilityTime);

		}else{
			appGlobal.localPlayer.weapon.abilityCanShoot = true;
		}

		if(this.cooldown > 0){

			if(this.cooldownFill!=null){
				gsap.to(this.cooldownFill, {duration:(this.cooldown/1000)+.5, height:39, delay:(this.abilityTime/1000)+.5});	
			}
			
			this.cooldownTimeout = setTimeout(function(){
				self.reset();
				if(self.child.childReset!=null){
					self.child.childReset();
				}

			}, this.abilityTime + this.cooldown);

		}else{
			if(!this.killOnLand){
				if(self.child.childReset!=null){
					self.child.childReset();
				}
				self.reset();
			}
		}

	}

	handlePlayerLand(){

		if(this.killOnLand && this.timerHelper){
			if(this.cooldownFill!=null)
				this.cooldownFill.style.height= "39px" ;
			//this.canSetClosestWorld = true;
			this.reset();
			this.timerHelper = false;
		}
	}

	handleKeyDown(key){
		
		if(key == this.key && this.canDoAbility){
			this.activateAbility();
		}

	}

	handleKeyUp(key){
		// if(key==this.key && this.doingAbility){
		// 	this.deactivateAbility();
		// }	
	}
	
  	reset(){
  		
  		this.canDoAbility = true;
  		this.doingAbility = false;
  		//this.deactivateAbility();
  		// if(this.child.deactivate != null){
  		// 	this.child.deactivateAbility();
  		// };
  		// if(this.child.reset != null){
  		// 	this.child.reset();
  		// }
  	}

  
  	updateClosestWorldIndex(i){
  		this.worldIndex = i;
  	}

  	kill(){
  		if(this.dom!=null)
  			this.dom.remove();
  		clearTimeout(this.abilityTimeout);
  		clearTimeout(this.cooldownTimeout);
  	}
  	
}

export { Abilities };
