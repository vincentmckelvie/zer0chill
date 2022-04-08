import {		
	//PerspectiveCamera
} from 'three';
import { RemotePlayer } from './RemotePlayer.js';

class RemoteController {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		this.killCount = 0;
		this.remotePlayer;
		this.id = OBJ.id;
		this.name = this.id;
		this.playing = false;
		this.dom = appGlobal.globalHelperFunctions.initPlayerDom({id:this.id, isRemote:true, killCount:this.killCount});
		
	}
	update(){
		if(this.remotePlayer!=null){
			this.remotePlayer.update();
		}
	}
	updateRemote(OBJ){
		if(this.remotePlayer != null){
			this.remotePlayer.updateRemote(OBJ);
		}
		this.killCount = OBJ.killCount;
		this.name = OBJ.name;
		appGlobal.globalHelperFunctions.updatePlayerDom({dom:this.dom, killCount:this.killCount, id:this.name});
	}

	initRemotePlayer(OBJ){
		this.remotePlayer = new RemotePlayer({id:this.id, meshName:OBJ.meshName}); 
		this.playing = true;
	}
	killRemotePlayer(){
		this.playing = false;
		if(this.remotePlayer!=null){
			this.remotePlayer.kill(); 
			this.remotePlayer = null;
		}
	}
	kill(){
		if(this.remotePlayer!=null){
			this.remotePlayer.kill(); 
			this.remotePlayer = null;
		}
		appGlobal.globalHelperFunctions.killPlayerDom(this.dom);

	}

}

export { RemoteController };
