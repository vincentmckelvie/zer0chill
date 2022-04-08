import {
	MeshStandardMaterial,
	TextureLoader,
	RepeatWrapping,
	Color
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
		this.emissive.emissiveMap = this.texture;
		this.move = .333;
		this.random = false;
		this.hue = 0;
		this.sat = 1;
		switch(name){
			case "sixgun":
				this.random = false;
				this.move = 0.16666666666;
				this.emissive.color = new Color(0x333333);
				this.hue = 0.594;
				//this.emissive.emissive  = new Color(0x29ADF6);
			break;
			case "assault":
				this.random = false;
				this.move = 0.03333333333;
				this.hue = .63;
				this.sat = .95;
				this.emissive.color = new Color(0x232323);
				//this.emissive.emissive  = new Color(0x29ADF6);
			break;
			case "sniper":
				this.emissive.color = new Color(0x030E16);
				this.emissive.roughness = 0.05;
				this.hue = .609;
				this.sat = 1;
				this.random = false;
				this.move = .333;
			break;
			case "launcher":
				this.random = false;
				this.emissive.color = new Color(0x222222);
				//this.emissive.emissive  = new Color(0xff0000);
				this.move = 0;
			break;
			case "submachine":
				this.emissive.color = new Color(0x0F0F0F);
				//this.emissive.emissive  = new Color(0xFFAA00);
				this.hue = 0.067;
				this.sat = 1.0;
				this.random = false;
				this.move = .04;
			break;
			case "sticky":
				this.random = false;
				this.move = 0;
				this.emissive.color = new Color(0x022668A);
				this.hue = .701;
				this.sat = 1;
			break;
			default:
				this.random = true;
				this.move = 0.07142857142
			break;
		}
		this.texture.offset.x = -this.move;
		
		this.blastTexture = new TextureLoader().load( './assets/textures/shoot.png' );
		this.blast = OBJ.blast;
		//this.blast.opacityMap = this.blastTexture;
		this.blast.transparent = true;
		this.blast.opacity = 1;
		this.blast.visible = false;
		this.blast.emissive = new Color(0xffad2b);
		this.blast.map = this.blastTexture;
	
		this.highlight = 0;
	}
	
	update(){
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


	kill(){
	
	}

}

export { WeaponEmissiveHandler };
