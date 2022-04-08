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
	TextureLoader,
	BufferGeometry,
	PointsMaterial,
	Float32BufferAttribute,
	AdditiveBlending,
	Points,
	Object3D,
} from 'three';
import { Octree } from './scripts/jsm/math/Octree.js';


import { EffectComposer } from './scripts/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './scripts/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './scripts/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from './scripts/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './scripts/jsm/shaders/FXAAShader.js';
import { World } from './World.js';


class CustomScene {

	//constructor( i = 0, parent = null, worldScale=20 ) {
	constructor() {

		this.clock = new Clock();
		this.STEPS_PER_FRAME = 5;
		
		this.scene = new Scene();
		//this.scene.background = new Color( 0x88ccff );
		
		this.renderer = new WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = VSMShadowMap;

		this.composer;
		this.outlinePass; 
		this.characterOutlinePass;
		this.renderPass;
		//this.sprite;
		this.starsGeometry;
		this.particles;
		this.test = 0;
		// this.outlineParams = {
		// 	edgeStrength: 3.0,
		// 	edgeGlow: 0.0,
		// 	edgeThickness: 1.0,
		// 	pulsePeriod: 0,
		// 	rotate: false,
		// 	usePatternTexture: false
		// };
		//const self = this;
		//self.reset();
	}

	initComposer(){
		this.composer = new EffectComposer( this.renderer );
		this.renderPass = new RenderPass( this.scene, appGlobal.controller.playerCamera );
		this.composer.addPass( this.renderPass );
		
		this.outlinePass = new OutlinePass( new Vector2( window.innerWidth, window.innerHeight ), this.scene, appGlobal.controller.playerCamera );
		this.composer.addPass( this.outlinePass );

		this.characterOutlinePass = new OutlinePass( new Vector2( window.innerWidth, window.innerHeight ), this.scene, appGlobal.controller.playerCamera );
		this.characterOutlinePass.visibleEdgeColor = new Color(0xff0000);
		this.composer.addPass( this.characterOutlinePass );
		
		//this.effectFXAA = new ShaderPass( FXAAShader );
		//this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
		//this.composer.addPass( this.effectFXAA );
		//addSelectedObject( selectedObject );
	}

	initSkySphere(){

		//const top = appGlobal.random();
		const top = appGlobal.hue;
		const bottom = (top+.1)%1.0
		const vertexShader = this.getBgVertex();
		const fragmentShader = this.getBgFragment();
		const uniforms = {
			topColor: { value: new Color().setHSL(top, .5, .4) },
			bottomColor: { value: new Color().setHSL(bottom, .5, .2) },
			offset: { value: 0 },
			exponent: { value: 0.9 }
		};

		//uniforms.topColor.value.copy( light.color );

		const skyGeo = new SphereGeometry( 500, 12, 12 );
		const skyMat = new ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			side: BackSide
		} );

		const sky = new Mesh( skyGeo, skyMat );
		appGlobal.hitScanArray.push(sky);
		this.scene.add( sky );

	}

	
	
	updateOutlined(ARR){
		this.outlinePass.selectedObjects = ARR;
	}

	update(){

		appGlobal.deltaTime = this.getDelta();
		appGlobal.particleHandler.update();
		appGlobal.world.update();
		appGlobal.remoteBullets.update();
		appGlobal.itemHandler.update();
		appGlobal.controller.update();

		for(let i = 0; i<appGlobal.remotePlayers.length; i++){
			appGlobal.remotePlayers[i].update();	
		}

		if(this.composer && appGlobal.playing)
			this.composer.render();
		else
			this.renderer.render( this.scene, appGlobal.controller.camera );
	}

	initLights(){
		this.scene.fog = new FogExp2(new Color().setHSL(appGlobal.hue, 0.7,.2), 0.01 );
		
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

		// if(this.sprite == null){
		// 	this.sprite = new TextureLoader().load( 'assets/textures/star.png' );
		// }
		this.starsGeometry = new BufferGeometry();
		const vertices = [];
		for ( let i = 0; i < 1000; i ++ ) {

			const x = Math.random() * 200 - 100;
			const y = Math.random() * 200 - 100;
			const z = Math.random() * 200 - 100;

			vertices.push( x, y, z );

		}

		this.starsGeometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

		//for ( let i = 0; i < parameters.length; i ++ ) {

			
		const mat = new PointsMaterial( { size: .05+Math.random()*.08, blending: AdditiveBlending, color:0xffffff, depthTest: true, transparent: true } );
		//materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

		this.particles = new Points( this.starsGeometry, mat );
		// particles.rotation.x = Math.random() * 6;
		// particles.rotation.y = Math.random() * 6;
		// particles.rotation.z = Math.random() * 6;

		this.scene.add( this.particles );
		appGlobal.worldsHolder = new Object3D();
		this.scene.add(appGlobal.worldsHolder);
		//}
	
	}

	add(obj){
		this.scene.add(obj)
	}
	remove(obj){
		this.scene.remove(obj);
	}
	updateWindowSize(){
		appGlobal.controller.updateWindowSize();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.composer.setSize( window.innerWidth, window.innerHeight );
		//this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	}
	getDelta(){
		return Math.min( 0.05, this.clock.getDelta() ) / this.STEPS_PER_FRAME;
	}
	
	kill(){
		
		// this.scene.remove(this.particles);
		// const self = this;

		// this.scene.traverse( function ( obj ) {
		   	
  //           if(obj.geometry){
  //               obj.geometry.dispose();
  //           }
  //           if(obj.material){
  //           	console.log("mesh")
  //               obj.material.dispose();
  //           }
  //           if(obj.mesh){
  //           	console.log("mesh")
  //               obj.mesh.dispose();
  //           }
  //           if(obj.texture){
  //           	console.log("texture")
  //               obj.texture.dispose();
  //           }
  //           //self.scene.remove(obj);
		// });
		appGlobal.characterOutlineMeshes = [];
		appGlobal.globalHelperFunctions.tearDownObject(this.scene);
		
		this.scene.remove.apply(this.scene, this.scene.children);
		//console.log(this.scene.children.length)

	}
	reset(){
		appGlobal.hue = .35+appGlobal.random()*.35;
		this.initSkySphere();
		this.initLights();
		this.initWorlds();
		this.initComposer();
		appGlobal.itemHandler.reset();
	}
	getBgVertex(){
		const str = [
				
			'varying vec3 vWorldPosition;',
			'void main() {',
				'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
				'vWorldPosition = worldPosition.xyz;',
				'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
			'}',
			
		].join( '\n' );
		return str;
	}
	getBgFragment(){
		const str = [
			'uniform vec3 topColor;',
			'uniform vec3 bottomColor;',
			'uniform float offset;',
			'uniform float exponent;',
			'varying vec3 vWorldPosition;',

			'void main() {',
				'float h = normalize( vWorldPosition + offset ).y;',
				'gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );',
			'}',
			
		].join( '\n' );
		return str;
	}

	initWorlds(){
		const totalAmt =  Math.floor( 6+appGlobal.random()*5 );
		let amt = 0;
		while(amt<totalAmt){
			// if(amt==0){
			// 	const pos = new Vector3();
			// 	pos.multiplyScalar((appGlobal.worldScale*2)*(1+appGlobal.random()*2))
			// 	const scl = appGlobal.worldScale*(.3+appGlobal.random()*.9);
			// 	const w = new World({scale:scl, position:pos, index:0});
			// 	appGlobal.worlds.push(w);
			// 	appGlobal.world = w;
			// 	amt++;
			// }else{

			let check = this.checkBounds(amt);
			if(check!=null){
				const w = new World({scale:check.scl, position:check.pos, index:amt});
				appGlobal.worlds.push(w);
				appGlobal.world = w;
				amt++;	
			}
			//}
			
		}
		appGlobal.world = appGlobal.worlds[Math.floor(Math.random()*appGlobal.worlds.length)];
		appGlobal.worldOctree = new Octree();
		appGlobal.worldOctree.fromGraphNode( appGlobal.worldsHolder );

		// for( let i = 0; i <  Math.floor( 7+appGlobal.random()*7 ); i++){
			
		// 	const pos = new Vector3();
			
		// 	if(i!=0){	
		// 		pos.x = -1+appGlobal.random()*2;
		// 		pos.y = -1+appGlobal.random()*2;
		// 		pos.z = -1+appGlobal.random()*2;
		// 	}
			
		// 	pos.multiplyScalar((appGlobal.worldScale*2.5)*(1+appGlobal.random()*2))
		// 	const scale = appGlobal.worldScale*(.6+appGlobal.random()*.8);
		// 	const w = new World({scale:scale, position:pos, index:i});
		// 	appGlobal.worlds.push(w);
		// 	if(i==0){
		// 		appGlobal.world = w;
		// 	}
			
		// }
	}

	checkBounds(int){

		const pos = new Vector3();
		
		pos.x = -1+appGlobal.random()*2;
		pos.y = -1+appGlobal.random()*2;
		pos.z = -1+appGlobal.random()*2;
	
		pos.multiplyScalar((appGlobal.worldScale*1.3)*(1+appGlobal.random()*2))
		
		const ss = appGlobal.worldScale*(.35+appGlobal.random()*.7);
		//pos.x = this.test + (ss);
		//this.test = pos.x + (ss);
		//when scale was 3, distance was 6 equal apart

		if( this.actuallyCheckBounds({pos:pos, scl:ss}) ){
			return {pos:pos, scl:ss};
		}
		return null;
	}

	actuallyCheckBounds(OBJ){
		for(let i = 0; i<appGlobal.worlds.length; i++){
			//const checkPos = new Vector3().clone(appGlobal.worlds[i].worldPosition);
			//const checkScl = appGlobal.worlds[i].scale;
			// const r2 = ((OBJ.scl) * (OBJ.scl));
			// const d2 = ((checkScl)*(checkScl));
			const dist = OBJ.pos.distanceTo( appGlobal.worlds[i].worldPosition );
			//console.log(dist);
			if( dist < ( appGlobal.worlds[i].scale + OBJ.scl )*.3 ){
				return false;
			}
		}
		return true;
	}
	
}


export { CustomScene };


