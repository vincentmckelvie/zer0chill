// import {
// 	Object3D,
// 	BoxGeometry,
// 	MeshNormalMaterial,
// 	Mesh,
// 	Vector3,
// 	Vector2,
// 	Quaternion,
// } from 'three';
// import { GlobalParticleHandler } from './GlobalParticleHandler.js';


class Hud {
	//{shootCooldown:shootCooldown, bullet:bullet};
	constructor() {
		this.targ = 0;
		this.ease = 0;
		this.ani;
		this.container = document.getElementById( 'hud' );
		this.recticle =  document.getElementById( 'recticle' );
		this.hitMarker =  document.getElementById( 'hit-marker' );
		this.healthBar =  document.getElementById( 'health-fill' );
		this.healthBarWidth = 150;
		this.boostBar =  document.getElementById( 'boost-fill' );
		this.boostBarWidth =  150;
		this.reload =  document.getElementById( 'reloading' );
		this.ammo =  document.getElementById( 'ammo-amount' );
		this.ammoTotal =  document.getElementById( 'ammo-amount-total' );
		this.healthNumber =  document.getElementById( 'current-health' );
		this.dmgMarker = document.getElementById('dmg-marker');
		this.damageMarkerTimeout = null;
		this.damageMarkerAni;
		const self = this;
		
		//this.weaponObj = OBJ;
	}

	
	lerp(a,b,t){
		return a * (1-t) + b * t
	}

	doDamageMarker(headshot){

		if(this.damageMarkerTimeout != null){
			clearTimeout(this.damageMarkerTimeout)
		}
		const self = this;
		//this.hitMarker.style.display = "block";
		if(headshot){
			this.hitMarker.style.backgroundImage = 'url("../assets/ui/dmg-marker-hs.png")';
		}else{
			this.hitMarker.style.backgroundImage = 'url("../assets/ui/dmg-marker-bs.png")';
		}
		this.toggleElem(this.hitMarker, true)
		this.damageMarkerTimeout = setTimeout(function(){
			self.toggleElem(self.hitMarker, false)
			//self.hitMarker.style.display = "none";
		}, 200)
	}
	doIncomingDamageMarker(angle){
		//const rot = //Math.sin(angle);
		const fnl = (angle*57.2958);
		//console.log(fnl)
		this.dmgMarker.style.opacity = 1;
		this.dmgMarker.style.transform = "rotate("+fnl+"deg)";

		if(this.damageMarkerAni!=null){
			this.damageMarkerAni.kill();
		}
		this.damageMarkerAni = gsap.to(this.dmgMarker.style,{duration:.3, opacity:0, ease: "linear.none()", delay:0});
	}
	toggleReload(showReload){
		if(showReload){
			this.toggleElem(this.reload, true)
		}else{
			this.toggleElem(this.reload, false)
		}
	}
	
	updateAmmo(amnt){
		this.setText(this.ammo, amnt);
	}

	updateTotalAmmo(amnt){
		this.setText(this.ammoTotal, "/ "+amnt);
	}

	updateHealth(amnt){
		if(amnt<0)amnt = 0;
		this.setText(this.healthNumber, amnt);
		const width = Math.floor(( amnt / 100 )*this.healthBarWidth);
	
		this.healthBar.style.width = width + "px";
	}
	updateBoost(amnt){
		if(amnt<0)amnt = 0;
		const width = Math.floor(( amnt )*this.boostBarWidth);
		this.boostBar.style.width = width + "px";
	}

	toggleElem(e,show){
		if(show)
			e.style.display = "block";
		else
			e.style.display = "none";
	}

	setText(e, text){
		e.innerHTML = ""+text;
	}
		
}

export { Hud };
