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
	PMREMGenerator
} from 'three';
import { RoomEnvironment } from './scripts/jsm/environments/RoomEnvironment.js';

//import { clone } from "./scripts/jsm/utils/SkeletonUtils.js"

class TitleScene {

	constructor() {

		const self = this;
		this.scene = new Scene();

		//this.scene.background = new Color( 0x88ccff );
		this.w = 500;
		this.h = 170;
		this.renderer = new WebGLRenderer( { antialias: false, alpha:true } );
		//this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.w, this.h );
		
		this.camera = new PerspectiveCamera( 50, this.w / this.h, 0.1, 1000 );
		this.camera.position.z = 1.5;
		
		const pmremGenerator = new PMREMGenerator( this.renderer );
		this.scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.01 ).texture;


		this.title = self.getModelByName("title").scene;
		this.title.traverse( function ( obj ) {
			if(obj.isMesh){
				obj.material.environmentMap = self.scene.environment;
			}
		});
		const s = .07;
		this.title.scale.set(s,s,s);
		//title.position.x-=.5;

		const container = document.getElementById( 'title' );
		container.appendChild( this.renderer.domElement );
		
		this.holder = new Object3D();
		this.scene.add(this.holder);
		this.holder.add(this.title);
		
		// const ambientlight = new AmbientLight( 0x6688cc);
		// this.scene.add( ambientlight );
		
		// const fillLight1 = new DirectionalLight( 0xf0f0f0, 0.5 );
		// fillLight1.position.set( 1, .5, 1 );
		// this.scene.add( fillLight1 );

		// const fillLight2 = new DirectionalLight( 0xaaaaaa, 10.2 );
		// fillLight2.position.set( 0, 0, 10 );
		// this.scene.add( fillLight2 );

		//const directionalLight = new DirectionalLight( 0xffffff, 2.2 );
		//directionalLight.position.set( 0, .5, 3 );
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
		//directionalLight.shadow.bias = - 0.00006;
		 //this.scene.add( directionalLight );
		 this.targX = 0;
		 this.targY = 0;
		
	}
	updateMouseMove(event){
		this.targX = ((window.innerWidth/2-event.pageX)*.0002 )*-1;
		this.targY = ( (200-event.pageY) *.0002)*-1;
	}
	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name==""+NAME)
				return appGlobal.loadObjs[i].model;	
		}
		
	}

	update(){
		this.title.rotation.y += (this.targX-this.title.rotation.y)*(appGlobal.deltaTime*30);
		this.title.rotation.x += (this.targY-this.title.rotation.x)*(appGlobal.deltaTime*30);
		this.renderer.render( this.scene, this.camera );
	}

	kill(){
		
	}
	
}


export { TitleScene };


