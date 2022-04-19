import {
	BufferGeometry,
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
	PMREMGenerator,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
	LinearFilter,
	ClampToEdgeWrapping,
	Group,
	MeshStandardMaterial,
	SkinnedMesh,
	ShapeGeometry,
	MeshBasicMaterial,
	DoubleSide,
	Euler
} from 'three';
import { OrbitControls } from './scripts/jsm/controls/OrbitControls.js';
import { clone } from "./scripts/jsm/utils/SkeletonUtils.js"
import { CharacterAnimationHandler } from './CharacterAnimationHandler.js';
import { CharacterSkin } from './CharacterSkin.js';
import { FontLoader } from './scripts/jsm/loaders/FontLoader.js';

//import { RoomEnvironment } from './scripts/jsm/environments/RoomEnvironment.js';


class PlayerSelectScene {

	constructor() {

		const self = this;

		this.scene = new Scene();
		//this.scene.background = new Color( 0x88ccff );
		this.w = 400;
		this.h = 250;
		this.renderer = new WebGLRenderer( { antialias: false, alpha:true } );
		//this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.w, this.h );
		// this.renderer.shadowMap.enabled = true;
		// this.renderer.shadowMap.type = VSMShadowMap;

		this.camera = new PerspectiveCamera( 26, this.w / this.h, 0.1, 1000 );
		this.camera.position.z = 2.8;
		
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
		
		const assault = clone( self.getModelByName("body-assault").scene );
		const assaultBoost = clone( self.getModelByName("assault-boost").scene );
		const assaultTeleport = clone( self.getModelByName("assault-teleport").scene );
		const assaultDirectional = clone( self.getModelByName("assault-directional").scene );
	
		appGlobal.skinsHandler.addMeshes({
			name:"assault", 
			meshes:[assault, assaultBoost, assaultTeleport, assaultDirectional]
		})

		const submachine = clone( self.getModelByName("body-submachine").scene );
		const submachineBoost = clone( self.getModelByName("submachine-boost").scene );
		const submachineTeleport = clone( self.getModelByName("submachine-teleport").scene );
		const submachineDirectional = clone( self.getModelByName("submachine-directional").scene );
		
		appGlobal.skinsHandler.addMeshes({
			name:"submachine", 
			meshes:[submachine, submachineBoost, submachineTeleport, submachineDirectional]
		})

		const sticky = clone( self.getModelByName("body-sticky").scene );
		const stickyBoost = clone( self.getModelByName("sticky-boost").scene );
		const stickyTeleport = clone( self.getModelByName("sticky-teleport").scene );
		const stickyDirectional = clone( self.getModelByName("sticky-directional").scene );
		
		appGlobal.skinsHandler.addMeshes({
			name:"sticky", 
			meshes:[sticky, stickyBoost, stickyTeleport, stickyDirectional]
		})

		const launcher = clone(  self.getModelByName("body-launcher").scene );
		const launcherBoost = clone(  self.getModelByName("launcher-boost").scene );
		const launcherTeleport = clone(  self.getModelByName("launcher-teleport").scene );
		const launcherDirectional = clone(  self.getModelByName("launcher-directional").scene );
		
		appGlobal.skinsHandler.addMeshes({
			name:"launcher", 
			meshes:[launcher, launcherBoost, launcherTeleport, launcherDirectional]
		})

		const sixgun = clone( self.getModelByName("body-sixgun").scene );
		const sixgunBoost = clone( self.getModelByName("sixgun-boost").scene );
		const sixgunTeleport = clone( self.getModelByName("sixgun-teleport").scene );
		const sixgunDirectional = clone( self.getModelByName("sixgun-directional").scene );
		
		appGlobal.skinsHandler.addMeshes({
			name:"sixgun", 
			meshes:[sixgun, sixgunBoost, sixgunTeleport, sixgunDirectional]
		})

		const sniper = clone(  self.getModelByName("body-sniper").scene );
		const sniperBoost = clone(  self.getModelByName("sniper-boost").scene );
		const sniperTeleport = clone(  self.getModelByName("sniper-teleport").scene );
		const sniperDirectional = clone(  self.getModelByName("sniper-directional").scene );
		
		appGlobal.skinsHandler.addMeshes({
			name:"sniper", 
			meshes:[sniper, sniperBoost, sniperTeleport, sniperDirectional]
		})
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
		this.holder.position.y = -.55;
		this.characters = [];
		
		const cahAssault =    new CharacterAnimationHandler({meshes:[assault, assaultBoost, assaultDirectional, assaultTeleport],               animations:appGlobal.loadObjs[0].model.animations, name:"assault"})
		const cahSubmachine = new CharacterAnimationHandler({meshes:[submachine, submachineBoost, submachineDirectional, submachineTeleport], 	animations:appGlobal.loadObjs[0].model.animations, name:"submachine"})
		
		const cahSticky =    new CharacterAnimationHandler({meshes:[sticky, stickyBoost, stickyDirectional, stickyTeleport],      			   	animations:appGlobal.loadObjs[0].model.animations, name:"sticky"})
		const cahLauncher =  new CharacterAnimationHandler({meshes:[launcher, launcherBoost, launcherDirectional, launcherTeleport],    		animations:appGlobal.loadObjs[0].model.animations, name:"launcher"})
		
		const cahSixGun =    new CharacterAnimationHandler({meshes:[sixgun, sixgunBoost, sixgunDirectional, sixgunTeleport],      			 	animations:appGlobal.loadObjs[0].model.animations, name:"sixgun"})
		const cahSniper =    new CharacterAnimationHandler({meshes:[sniper, sniperBoost, sniperDirectional, sniperTeleport],      				animations:appGlobal.loadObjs[0].model.animations, name:"sniper"})
		
		cahAssault.initAnimation();
		cahSubmachine.initAnimation();
		
		cahSticky.initAnimation();
		cahLauncher.initAnimation();
		
		cahSixGun.initAnimation();
		cahSniper.initAnimation();

		this.characters.push({object:assault,    cah:cahAssault,     name:"assault",    attach:[{obj: assaultBoost,    name:"boost"},{obj: assaultDirectional,    name:"directional"}, {obj: assaultTeleport,    name:"teleport"}] });//order set in main js character loader object
		this.characters.push({object:submachine, cah:cahSubmachine,  name:"submachine", attach:[{obj: submachineBoost, name:"boost"},{obj: submachineDirectional, name:"directional"}, {obj: submachineTeleport, name:"teleport"}]  });//order set in main js character loader object
		
		this.characters.push({object:sticky,   cah:cahSticky,        name:"sticky",     attach:[{obj: stickyBoost,   name:"boost"},{obj: stickyDirectional,   name:"directional"}, {obj: stickyTeleport,   name:"teleport"}]    });//order set in main js character loader object
		this.characters.push({object:launcher, cah:cahLauncher,      name:"launcher",   attach:[{obj: launcherBoost, name:"boost"},{obj: launcherDirectional, name:"directional"}, {obj: launcherTeleport, name:"teleport"}]    });//order set in main js character loader object
		 
		this.characters.push({object:sixgun,    cah:cahSixGun,       name:"sixgun",    attach:[{obj: sixgunBoost, name:"boost"},{obj: sixgunDirectional, name:"directional"}, {obj: sixgunTeleport, name:"teleport"}]     });//order set in main js character loader object
		this.characters.push({object:sniper,    cah:cahSniper,       name:"sniper",    attach:[{obj: sniperBoost, name:"boost"},{obj: sniperDirectional, name:"directional"}, {obj: sniperTeleport, name:"teleport"}]     });//order set in main js character loader object
		
		this.scene.add(this.holder);
		this.holder.add(
			assault, assaultBoost, assaultTeleport, assaultDirectional, 
			submachine, submachineBoost, submachineTeleport, submachineDirectional,
			sticky, stickyBoost, stickyTeleport, stickyDirectional,
			launcher, launcherBoost, launcherTeleport, launcherDirectional,
			sniper, sniperBoost, sniperTeleport, sniperDirectional,
			sixgun, sixgunBoost, sixgunTeleport, sixgunDirectional
		);

		// const pmremGenerator = new PMREMGenerator( this.renderer );
		// this.scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.01 ).texture;

		// this.holder.traverse( function ( obj ) {
		// 	if(obj.isMesh){
		// 		obj.material.environmentMap = self.scene.environment;
		// 	}
		// });
		
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
		// directionalLight.castShadow = true;
		// directionalLight.shadow.camera.near = 0.01;
		// directionalLight.shadow.camera.far = 500;
		// directionalLight.shadow.camera.right = 30;
		// directionalLight.shadow.camera.left = - 30;
		// directionalLight.shadow.camera.top	= 30;
		// directionalLight.shadow.camera.bottom = - 30;
		// directionalLight.shadow.mapSize.width = 1024;
		// directionalLight.shadow.mapSize.height = 1024;
		// directionalLight.shadow.radius = 4;
		// directionalLight.shadow.bias = - 0.00006;
		this.scene.add( directionalLight );
		this.boostTexture = new TextureLoader().load( './assets/textures/boost.png' );
		this.boostTexture.wrapS = RepeatWrapping;
		this.boostTexture.wrapT =  ClampToEdgeWrapping;
		this.boostTexture.magFilter = LinearFilter; 
	
		this.rotMod = 0;
		for(let i = 0; i<this.characters.length; i++){
			let name = "tip-"+this.characters[i].name;
			//console.log(this.characters[i].object);
			const tipObject = this.characters[i].object.getObjectByName(name);
			tipObject.visible = false;
			
			self.initCAH(this.characters[i]);
			for(let k = 0; k<this.characters[i].attach.length; k++){
				this.characters[i].attach[k].obj.visible = false;
				
				this.characters[i].attach[k].obj.traverse( function ( obj ) {
					if(obj.name.includes("boost-part")){
						obj.material.transparent = true;
						obj.material.map = self.boostTexture;
						obj.material.emissiveMap = self.boostTexture;
						obj.material.color = new Color(0x000000);
						obj.material.emissive = new Color(0xffbf80);
						//self.boostObjs.push(obj);
					}
				});

				//sentence.includes(word)	
			}
			
			this.characters[i].object.visible = false;	
			
		}
		
		this.characters[0].object.visible = true;
		this.characters[0].attach[0].obj.visible = true;

		this.infoTexts = [];
		this.loader = new FontLoader();
		this.loader.load( 'assets/fonts/helvetiker_regular.typeface.json', function ( font ) {

			const assaultGun = assault.getObjectByName("Sphere073");
			const assaultFoot = assault.getObjectByName("foot_l");
			const assaultBoostHolder = assaultBoost.getObjectByName("boost-part015");
			const assaultDirectionalHolder = assaultDirectional.getObjectByName("boost-part017");
			const assaultTeleportHolder = assaultTeleport.getObjectByName("boost-part016");

			const assaultText = new PlayerSelectInfoText({text:"assault rifle",                     parent:assaultGun,                offset:new Vector3(-3, 3, 6),     font:font, distanceMult:400,  scale:.055, rot:new Euler(0,0,0)});
			self.infoTexts.push(assaultText);
			const assaultAbility = new PlayerSelectInfoText({text:"[SHIFT + A,S,D] to dash",        parent:assaultFoot,               offset:new Vector3(-.2, .2, -.2), font:font, distanceMult:300, scale:.0032, rot:new Euler( -Math.PI/2, 0, Math.PI/2 )});
			self.infoTexts.push(assaultAbility);
			const assaultPlanetSwitchText = new PlayerSelectInfoText({text:"[E] to switch planets", parent:assaultBoostHolder,        offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(assaultPlanetSwitchText);
			const assaultBoostText = new PlayerSelectInfoText({text:"[SHIFT] to directional boost", parent:assaultDirectionalHolder,  offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(assaultBoostText);
			const assaultTeleportText = new PlayerSelectInfoText({text:"[E] to teleport",           parent:assaultTeleportHolder,     offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(assaultTeleportText);



			const stickyGun = sticky.getObjectByName("Sphere068");
			const stickyFoot = sticky.getObjectByName("foot_l");
			const stickyBoostHolder = stickyBoost.getObjectByName("boost-part008");
			const stickyDirectionalHolder = stickyDirectional.getObjectByName("boost-part006");
			const stickyTeleportHolder = stickyTeleport.getObjectByName("boost-part007");

			const stickyText = new PlayerSelectInfoText({text:"sticky bombs",                      parent:stickyGun,                offset:new Vector3(2, 3, 2),      font:font, distanceMult:300,  scale:.045, rot:new Euler( -Math.PI/2,0,Math.PI)});
			self.infoTexts.push(stickyText);
			const stickyAbility = new PlayerSelectInfoText({text:"[SPACE] to double jump",         parent:stickyFoot,               offset:new Vector3(-.2, .2, -.2), font:font, distanceMult:300, scale:.0032, rot:new Euler( -Math.PI/2, 0, Math.PI/2 )});
			self.infoTexts.push(stickyAbility);
			const stickyPlanetSwitchText = new PlayerSelectInfoText({text:"[E] to switch planets", parent:stickyBoostHolder,        offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(stickyPlanetSwitchText);
			const stickyBoostText = new PlayerSelectInfoText({text:"[SHIFT] to directional boost", parent:stickyDirectionalHolder,  offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(stickyBoostText);
			const stickyTeleportText = new PlayerSelectInfoText({text:"[E] to teleport",           parent:stickyTeleportHolder,     offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(stickyTeleportText);
			

			const nitroGun = submachine.getObjectByName("Plane001");
			const nitroFoot = submachine.getObjectByName("foot_l");
			const nitroBoostHolder = submachineBoost.getObjectByName("boost-part011");
			const nitroDirectionalHolder = submachineDirectional.getObjectByName("boost-part009");
			const nitroTeleportHolder = submachineTeleport.getObjectByName("boost-part010");

			const nitroText = new PlayerSelectInfoText({text:"submachine gun",                    parent:nitroGun,                offset:new Vector3(-.7, 1.2, .6),      font:font, distanceMult:300,  scale:.022, rot:new Euler(0,0,0)});
			self.infoTexts.push(nitroText);
			const nitroAbility = new PlayerSelectInfoText({text:"[SHIFT + A,S,D] to dash",        parent:nitroFoot,               offset:new Vector3(-.2, .2, -.2), font:font, distanceMult:300, scale:.0032, rot:new Euler( -Math.PI/2, 0, Math.PI/2 )});
			self.infoTexts.push(nitroAbility);
			const nitroPlanetSwitchText = new PlayerSelectInfoText({text:"[E] to switch planets", parent:nitroBoostHolder,        offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(nitroPlanetSwitchText);
			const nitroBoostText = new PlayerSelectInfoText({text:"[SHIFT] to directional boost", parent:nitroDirectionalHolder,  offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(nitroBoostText);
			const nitroTeleportText = new PlayerSelectInfoText({text:"[E] to teleport",           parent:nitroTeleportHolder,     offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(nitroTeleportText);


			const sniperGun = sniper.getObjectByName("Sphere070");
			const sniperFoot = sniper.getObjectByName("head");
			const sniperBoostHolder = sniperBoost.getObjectByName("boost-part014");
			const sniperDirectionalHolder = sniperDirectional.getObjectByName("boost-part012");
			const sniperTeleportHolder = sniperTeleport.getObjectByName("boost-part013");

			const sniperText = new PlayerSelectInfoText({text:"sniper rifle",                      parent:sniperGun,                offset:new Vector3(-3, 3, 6),     font:font, distanceMult:400,  scale:.055, rot:new Euler(0,0,0)});
			self.infoTexts.push(sniperText);
			const sniperAbility = new PlayerSelectInfoText({text:"[Q] for wall hacks",             parent:sniperFoot,               offset:new Vector3(.4, .2, .2), font:font, distanceMult:300, scale:.0032, rot:new Euler( 0, Math.PI/2, 0 )});
			self.infoTexts.push(sniperAbility);
			const sniperPlanetSwitchText = new PlayerSelectInfoText({text:"[E] to switch planets", parent:sniperBoostHolder,        offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(sniperPlanetSwitchText);
			const sniperBoostText = new PlayerSelectInfoText({text:"[SHIFT] to directional boost", parent:sniperDirectionalHolder,  offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(sniperBoostText);
			const sniperTeleportText = new PlayerSelectInfoText({text:"[E] to teleport",           parent:sniperTeleportHolder,     offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(sniperTeleportText);


			const launcherGun = launcher.getObjectByName("Cube043");
			const launcherFoot = launcher.getObjectByName("foot_l");
			const launcherBoostHolder = launcherBoost.getObjectByName("boost-part001");
			const launcherDirectionalHolder = launcherDirectional.getObjectByName("boost-part002");
			const launcherTeleportHolder = launcherTeleport.getObjectByName("boost-part000");

			const launcherText = new PlayerSelectInfoText({text:"rocket launcher",                   parent:launcherGun,                offset:new Vector3(-1, 1, 2),     font:font, distanceMult:400,  scale:.022, rot:new Euler(0,0,0)});
			self.infoTexts.push(sniperText);
			const launcherAbility = new PlayerSelectInfoText({text:"[SPACE] to double jump",         parent:launcherFoot,               offset:new Vector3(-.2, .2, -.2), font:font, distanceMult:300, scale:.0032, rot:new Euler( -Math.PI/2, 0, Math.PI/2 )});
			self.infoTexts.push(launcherAbility);
			const launcherPlanetSwitchText = new PlayerSelectInfoText({text:"[E] to switch planets", parent:launcherBoostHolder,        offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(launcherPlanetSwitchText);
			const launcherBoostText = new PlayerSelectInfoText({text:"[SHIFT] to directional boost", parent:launcherDirectionalHolder,  offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(launcherBoostText);
			const launcherTeleportText = new PlayerSelectInfoText({text:"[E] to teleport",           parent:launcherTeleportHolder,     offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(launcherTeleportText);



			const sixgunGun = sixgun.getObjectByName("Sphere067");
			const sixgunFoot = sixgun.getObjectByName("head");
			const sixgunBoostHolder = sixgunBoost.getObjectByName("boost-part005");
			const sixgunDirectionalHolder = sixgunDirectional.getObjectByName("boost-part003");
			const sixgunTeleportHolder = sixgunTeleport.getObjectByName("boost-part004");

			const sixgunText = new PlayerSelectInfoText({text:"revolver",                          parent:sixgunGun,                offset:new Vector3(8, 6, -6),     font:font, distanceMult:300,  scale:.12, rot:new Euler(0,Math.PI,0)});
			self.infoTexts.push(sixgunText);
			const sixgunAbility = new PlayerSelectInfoText({text:"[Q] for wall hacks",             parent:sixgunFoot,               offset:new Vector3(.4, .2, .2), font:font, distanceMult:300, scale:.0032, rot:new Euler( 0, Math.PI/2, 0 )});
			self.infoTexts.push(sixgunAbility);
			const sixgunPlanetSwitchText = new PlayerSelectInfoText({text:"[E] to switch planets", parent:sixgunBoostHolder,        offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(sixgunPlanetSwitchText);
			const sixgunBoostText = new PlayerSelectInfoText({text:"[SHIFT] to directional boost", parent:sixgunDirectionalHolder,  offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(sixgunBoostText);
			const sixgunTeleportText = new PlayerSelectInfoText({text:"[E] to teleport",           parent:sixgunTeleportHolder,     offset:new Vector3(.4, .3, 0), font:font, distanceMult:350,  scale:.0032, rot:new Euler(0,0,0)});
			self.infoTexts.push(sixgunTeleportText);
			
		}); 

	}

	tryCopy(object,parent){
		object.traverse( function ( obj ) {
			
			// if( obj.isMesh ){	
			// 	//const c = new Mesh(obj.geometry.copy(),obj.material.copy());
			// 	//parent.add(c);
			// 	console.log(obj)
			// }
			// if( obj.isSkinnedMesh ){
			// 	const geo = new BufferGeometry();
			// 	obj.geometry.copy(geo);
			// 	const mat = new MeshStandardMaterial();
			// 	obj.material.copy(mat);
			// 	const c = new SkinnedMesh(geo,mat);
			// 	parent.add(c);
			// }

		});

	}

	handleCharacterSwitch(OBJ){
		let obj;
		let mov;
		appGlobal.skinsHandler.playerSelectSwitchCharacter(OBJ);
		for(let i = 0; i < this.characters.length; i++){
			for(let k = 0; k<this.characters[i].attach.length; k++){
				this.characters[i].attach[k].obj.visible = false;
				this.characters[i].object.visible = false;
				if(this.characters[i].attach[k].name == OBJ.movement && this.characters[i].name == OBJ.class){
					mov = this.characters[i].attach[k].obj;
					obj = this.characters[i].object;
				}	
			}
		}

		mov.visible = true;
		obj.visible = true;
	}

	handleMovementSwitch(OBJ){
		let obj;
		for(let i = 0; i < this.characters.length; i++){
			for(let k = 0; k < this.characters[i].attach.length; k++){
				this.characters[i].attach[k].obj.visible = false;
				if(this.characters[i].attach[k].name == OBJ.movement && this.characters[i].name == OBJ.class){
					obj = this.characters[i].attach[k].obj;
				}
			}
		}
		obj.visible = true;
	}

	initCAH(OBJ){
		OBJ.cah.idle.weight = 1;
		OBJ.cah.forward.weight = 0;
		OBJ.cah.right.weight = 0;
		OBJ.cah.back.weight = 0;
		OBJ.cah.left.weight = 0;
		OBJ.cah.jump.weight = 0;
		OBJ.cah.idleTarg = 1;
		OBJ.cah.idle.play();
		OBJ.cah.forward.stop();
		OBJ.cah.right.stop();
		OBJ.cah.left.stop();
		OBJ.cah.back.stop();
		OBJ.cah.jump.stop();
	}

	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name==NAME)
				return appGlobal.loadObjs[i].model;	
		}
		
	}


	update(){
		this.renderer.render( this.scene, this.camera );
		this.controls.update();
		
		this.rotMod += (appGlobal.deltaTime*400);
		if(Math.floor(this.rotMod%10) == 0){
			this.boostTexture.offset.x += .2+Math.random()*.5;
		}
				
		for(let i = 0; i<this.characters.length; i++){
			this.characters[i].cah.update();
		}		
	}

	kill(){
		
	}
	
}


export { PlayerSelectScene };


class PlayerSelectInfoText{
	constructor(OBJ){
		this.text = OBJ.text;
		this.parent = OBJ.parent;
		this.textTarg = new Vector3();
		this.parentTarg = new Vector3();
		this.offset = new Vector3().copy(OBJ.offset);
	
		const matLite = new MeshBasicMaterial( {
			color: 0xffffff,
			side: DoubleSide
		} );

		const message = this.text;
		const shapes = OBJ.font.generateShapes( message, 12 );
		const geometry = new ShapeGeometry( shapes );
		geometry.computeBoundingBox();
		const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		geometry.translate( xMid, 0, 0 );

		// make shape ( N.B. edge view not visible )

		this.text = new Mesh( geometry, matLite );
		//text.position.z = - 150;
		this.parent.add( this.text );
		this.text.position.copy(this.offset);
		this.text.scale.set(OBJ.scale, OBJ.scale, OBJ.scale);
		this.text.getWorldPosition(this.textTarg);
		this.text.rotation.copy(OBJ.rot); 
		this.parent.getWorldPosition(this.parentTarg);
		const d = this.textTarg.distanceTo(this.parentTarg);
			
		this.holder = new Object3D();
		const dMult = OBJ.distanceMult;
		const cubeGeometry = new BoxGeometry( 1, 1, d * dMult );
		const cubeMaterial = new MeshBasicMaterial( { color: 0xffffff } );
		this.cube = new Mesh(cubeGeometry, cubeMaterial);
		this.text.add(this.holder);
		this.holder.add(this.cube);
		this.cube.position.z = d*(dMult*.5);
		this.holder.lookAt(this.parentTarg);
		this.cube.dontUpdateMaterial = true;
		this.text.dontUpdateMaterial = true;
		
	}
}