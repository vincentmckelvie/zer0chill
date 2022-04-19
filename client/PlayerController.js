import {		
	PerspectiveCamera
} from 'three';
import { Player } from './Player.js';
import { OrbitControls } from './scripts/jsm/controls/OrbitControls.js';

class PlayerController {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		
		this.playerCamera = new PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );		
		this.playerCamera.rotation.order = 'YXZ';
		this.nonPlayingCam = new PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.nonPlayingCam.position.z = appGlobal.worldScale*5;
		this.camera = this.nonPlayingCam;
		this.player = null;

		this.controls = new OrbitControls( this.nonPlayingCam, appGlobal.scene.renderer.domElement );
		//this.controls.listenToKeyEvents( window ); // optional

		//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

		this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.05;

		this.controls.screenSpacePanning = true;
		this.controls.autoRotate = true;
		this.controls.minDistance = appGlobal.worldScale*.1;
		this.controls.maxDistance = 700;
		this.id = OBJ.id;
		this.name = OBJ.user;
		this.killCount = 0;
		this.dom = appGlobal.globalHelperFunctions.initPlayerDom({id:this.id, isRemote:false, killCount:this.killCount});
		
	}

	updateKillCount(kc){
		this.killCount = kc;
	}
	
	update = function(){
		if(appGlobal.playing){
			this.player.update();
			this.controls.enabled=false;
			this.camera = this.playerCamera;
			this.controls.enabled = false;
			appGlobal.globalHelperFunctions.updatePlayerDom({dom:this.dom, id:this.name, killCount:this.killCount});
		}else{
			this.controls.enabled=true;
			this.controls.update();
			this.camera = this.nonPlayingCam;
		}
	}

	initPlayer(OBJ){
		this.name = OBJ.name;
		OBJ.id = this.id;
		this.player = new Player(OBJ); 
	}
	
	////appGlobal.globalHelperFunctions.killPlayerDom(this.dom);
  		
	updateWindowSize(){
		this.playerCamera.aspect = window.innerWidth / window.innerHeight;
		this.playerCamera.updateProjectionMatrix();
		this.nonPlayingCam.aspect = window.innerWidth / window.innerHeight;
		this.nonPlayingCam.updateProjectionMatrix();
	}

}

export { PlayerController };
