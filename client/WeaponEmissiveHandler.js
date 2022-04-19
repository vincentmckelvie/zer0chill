import {
	MeshStandardMaterial,
	TextureLoader,
	RepeatWrapping,
	Color,
	AdditiveBlending,
} from 'three';


class WeaponEmissiveHandler {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ) {
		
		const name = OBJ.name;
		
		this.texture = new TextureLoader().load( './assets/textures/'+name+'-emissive.png' );
		this.texture.wrapT = this.texture.wrapS = RepeatWrapping;
		this.texture.offset.x = 0;
		
		this.blastModel = OBJ.blastModel;
		this.emissive = OBJ.emissive;
		this.move = .333;
		this.random = false;
		this.hue = 0;
		this.sat = 1;
		if(OBJ.skin != "normal"){
			this.emissive.emissiveMap = this.texture;
			const swatchArray = appGlobal.skinsHandler.swatches.getSwatchByName(OBJ.name, OBJ.skin).array;
			const emissiveSwatchObject = appGlobal.skinsHandler.swatches.getSwatchEmissive(swatchArray);
			let hsl = {h:0,s:0,l:0};
			const emissive = new Color("#"+emissiveSwatchObject.emissive).getHSL(hsl);
			const color = new Color("#"+emissiveSwatchObject.color);
			this.emissive.color = color;
			this.hue = hsl.h;
			this.sat = hsl.s;

			switch(name){
				case "sixgun":
					this.random = false;
					this.move = 0.16666666666;
					
				break;
				case "assault":
					this.random = false;
					this.move = 0.03333333333;
					
				break;
				case "sniper":
					this.emissive.roughness = 0.05;
					this.random = false;
					this.move = .333;
				break;
				case "launcher":
					this.random = false;
					this.move = 0;
				break;
				case "submachine":
					this.random = false;
					this.move = .04;
				break;
				case "sticky":
					this.random = false;
					this.move = 0;
				break;
				default:
					this.random = true;
					this.move = 0.07142857142
				break;
			}
			this.texture.offset.x = -this.move;
		}
		
		this.blast = OBJ.blast;
		this.blast.blendMode = AdditiveBlending;
		this.blast.visible = false;
		this.blast.emissive = new Color(0xffad2b);
		
		this.highlight = 0;
	}

	update(){
		if(appGlobal.skinsHandler.currentSkin != "normal")
			this.emissive.emissive = new Color().setHSL(this.hue, this.sat, this.highlight);
		
		this.highlight += (0-this.highlight)*appGlobal.deltaTime*6;
		if(this.highlight>.5){
			this.blast.visible = true;
		}else{
			this.blast.visible = false;
		}
	}

	shoot(OBJ){
		if(!this.random){
			this.texture.offset.x += this.move;
		}else{
			this.texture.offset.x += (this.move*Math.floor(Math.random()*6));
		} 
		this.highlight = .6;
		this.blastModel.rotation.z += (Math.PI*.35) + (Math.PI*Math.random());
	}
	reload(){
		this.texture.offset.x = -this.move;
	}

	kill(){
		this.emissive.dispose();
		this.texture.dispose();
	}

}

export { WeaponEmissiveHandler };
