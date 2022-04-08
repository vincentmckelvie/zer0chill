import {
	BoxGeometry,
	MeshNormalMaterial,
	Mesh,
	Vector3,
	Clock,
	Scene,
	Color,
	AmbientLight,
	DirectionalLight,
	WebGLRenderer,
	VSMShadowMap,
	SphereGeometry,
	ShaderMaterial,
	BackSide,
	Vector2,
	FogExp2,
	PerspectiveCamera,
	Object3D,
} from 'three';
import { OrbitControls } from './scripts/jsm/controls/OrbitControls.js';
import { clone } from "./scripts/jsm/utils/SkeletonUtils.js"
import { CharacterAnimationHandler } from './CharacterAnimationHandler.js';

class PlayerSelectScene {

	constructor() {

		const self = this;
		this.scene = new Scene();
		//this.scene.background = new Color( 0x88ccff );
		this.w = 500;
		this.h = 300;
		this.renderer = new WebGLRenderer( { antialias: true, alpha:true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.w, this.h );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = VSMShadowMap;

		this.camera = new PerspectiveCamera( 26, this.w / this.h, 0.1, 1000 );
		this.camera.position.z = 3;
		
		const container = document.getElementById( 'player-select-character' );
		container.appendChild( this.renderer.domElement );
		this.controls = new OrbitControls( this.camera,  container);
		//this.controls.listenToKeyEvents( window ); // optional

		//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

		this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.05;
		this.controls.enablePan = false;
		this.controls.enableZoom = false;
		this.controls.screenSpacePanning = true;
		this.controls.autoRotate = false;		
		this.controls.minPolarAngle = Math.PI/2; // radians
		this.controls.maxPolarAngle = Math.PI/2; // radians
		//this.controls.minDistance = 0;
		//this.controls.maxDistance = 700;

		const assault = clone( self.getModelByName("assault").scene );
		const submachine = clone( self.getModelByName("submachine").scene );
		
		const sticky = clone( self.getModelByName("sticky").scene );
		const launcher = clone(  self.getModelByName("launcher").scene );
		
		const sixgun = clone( self.getModelByName("sixgun").scene );
		const sniper = clone(  self.getModelByName("sniper").scene );
		
		// this.auto = clone(         self.getModelByName("weapon").scene );
		// this.sub =  clone(         self.getModelByName("weapon").scene );
		// this.sniper = clone(       self.getModelByName("weapon").scene );
		// this.sixgun = clone(       self.getModelByName("weapon").scene );
		// this.launcher = clone(     self.getModelByName("weapon").scene );
		// this.sticky   = clone(     self.getModelByName("weapon").scene );

		this.holder = new Object3D();
		//this.character.quaternion.set(new Quaternion().identity());
		//automatic.position.y = projectile.position.y = hitscan.position.y = -.5;
		
		//this.weapon.position.y = -.5;
		this.holder.position.y = -.5;
		this.characters = [];
		
		const cahAssault =  new CharacterAnimationHandler({meshes:[assault],      animations:appGlobal.loadObjs[0].model.animations, name:"assault"})
		const cahSubmachine = new CharacterAnimationHandler({meshes:[submachine], animations:appGlobal.loadObjs[0].model.animations, name:"submachine"})
		
		const cahSticky =    new CharacterAnimationHandler({meshes:[sticky],      animations:appGlobal.loadObjs[0].model.animations, name:"sticky"})
		const cahLauncher =  new CharacterAnimationHandler({meshes:[launcher],    animations:appGlobal.loadObjs[0].model.animations, name:"launcher"})
		
		const cahSixGun =    new CharacterAnimationHandler({meshes:[sixgun],      animations:appGlobal.loadObjs[0].model.animations, name:"sixgun"})
		const cahSniper =    new CharacterAnimationHandler({meshes:[sniper],      animations:appGlobal.loadObjs[0].model.animations, name:"sniper"})
		
		cahAssault.initAnimation();
		cahSubmachine.initAnimation();
		
		cahSticky.initAnimation();
		cahLauncher.initAnimation();
		
		cahSixGun.initAnimation();
		cahSniper.initAnimation();

		this.characters.push({object:assault,    cah:cahAssault,     name:"assault" });//order set in main js character loader object
		this.characters.push({object:submachine, cah:cahSubmachine,  name:"submachine"});//order set in main js character loader object
		
		this.characters.push({object:sticky,   cah:cahSticky,        name:"sticky"     });//order set in main js character loader object
		this.characters.push({object:launcher, cah:cahLauncher,      name:"launcher"   });//order set in main js character loader object
		
		this.characters.push({object:sixgun,    cah:cahSixGun,       name:"sixgun",    });//order set in main js character loader object
		this.characters.push({object:sniper,    cah:cahSniper,       name:"sniper",    });//order set in main js character loader object
		
		this.scene.add(this.holder);
		this.holder.add(assault, submachine, sticky, launcher, sniper, sixgun);
		
		const ambientlight = new AmbientLight( 0x6688cc );
		this.scene.add( ambientlight );
		
		const fillLight1 = new DirectionalLight( 0xf0f0f0, 0.5 );
		fillLight1.position.set( -1, 1, 2 );
		this.scene.add( fillLight1 );

		const fillLight2 = new DirectionalLight( 0x8888ff, 0.2 );
		fillLight2.position.set( 0, -1, 0 );
		this.scene.add( fillLight2 );

		const directionalLight = new DirectionalLight( 0xffffc7, 1.2 );
		directionalLight.position.set( - 5, 25, - 1 );
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.near = 0.01;
		directionalLight.shadow.camera.far = 500;
		directionalLight.shadow.camera.right = 30;
		directionalLight.shadow.camera.left = - 30;
		directionalLight.shadow.camera.top	= 30;
		directionalLight.shadow.camera.bottom = - 30;
		directionalLight.shadow.mapSize.width = 1024;
		directionalLight.shadow.mapSize.height = 1024;
		directionalLight.shadow.radius = 4;
		directionalLight.shadow.bias = - 0.00006;
		this.scene.add( directionalLight );


		for(let i = 0; i<this.characters.length; i++){
			let name = "tip-"+this.characters[i].name;
			const tipObject = this.characters[i].object.getObjectByName(name);
			tipObject.visible = false;
			
			self.initCAH(this.characters[i]);
			this.characters[i].object.visible = false;
		}
		this.characters[0].object.visible = true;
		
	}

	handleCharacterSwitch(OBJ){
		let obj;
		for(let i = 0; i < this.characters.length; i++){
			this.characters[i].object.visible = false;
			
			if(this.characters[i].name == OBJ.class){
				obj = this.characters[i].object;
			}
		}
		obj.visible = true;
	}

	initCAH(OBJ){
		OBJ.cah.idle.weight = 1;
		OBJ.cah.forward.weight = 0;
		OBJ.cah.right.weight = 0;
		OBJ.cah.left.weight = 0;
		OBJ.cah.jump.weight = 0;
		OBJ.cah.idle.stop();
		OBJ.cah.idle.play();
		OBJ.cah.forward.stop();
		OBJ.cah.right.stop();
		OBJ.cah.left.stop();
		OBJ.cah.back.stop();
		OBJ.cah.jump.stop();
	}

	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name=="body-"+NAME)
				return appGlobal.loadObjs[i].model;	
		}
		
	}


	update(){
		this.renderer.render( this.scene, this.camera );
		this.controls.update();
		for(let i = 0; i<this.characters.length; i++){
			this.characters[i].cah.update();
		}		
	}

	kill(){
		
	}
	
}


export { PlayerSelectScene };


