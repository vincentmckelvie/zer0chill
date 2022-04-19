import * as THREE from 'three';
import Stats from './scripts/jsm/libs/stats.module.js';
import { GLTFLoader } from './scripts/jsm/loaders/GLTFLoader.js';
import { Octree } from './scripts/jsm/math/Octree.js';
import { Capsule } from './scripts/jsm/math/Capsule.js';

import { World } from './World.js';
import { PlayerController } from './PlayerController.js';
import { BotPlayer } from './BotPlayer.js';

import { CustomScene } from './CustomScene.js';
import { StickyBullet } from './StickyBullet.js';
import { RocketBullet } from './RocketBullet.js';
import { BotBullet } from './BotBullet.js';
import { AutoBullet } from './AutoBullet.js';
import { SniperBullet } from './SniperBullet.js';
import { GlobalParticleHandler } from './GlobalParticleHandler.js';
import { RemotePlayer } from './RemotePlayer.js';
import { ItemHandler } from './ItemHandler.js';
import { RemoteBulletHandler } from './RemoteBulletHandler.js';
import { GlobalSoundHandler } from './GlobalSoundHandler.js';
import { AbilityPlanetSwitch } from './AbilityPlanetSwitch.js';
import { AbilityPlanetSwitchBot } from './AbilityPlanetSwitchBot.js';

import { AbilityWalls } from './AbilityWalls.js';
import { AbilityDirectionalBoost } from './AbilityDirectionalBoost.js';
import { AbilityTeleport } from './AbilityTeleport.js';
import { AbilityDoubleJump } from './AbilityDoubleJump.js';
import { AbilityBlink } from './AbilityBlink.js';
import { RemoteController } from './RemoteController.js';
import { PlayerSelectScene } from './PlayerSelectScene.js';
import { TitleScene } from './TitleScene.js';
import { ParallaxGUI } from './ParallaxGUI.js';

import { Settings } from './Settings.js';
import { SkinsHandler } from './SkinsHandler.js';

import { Servers } from './Servers.js';
import { GamePad } from './GamePad.js';

const abilities = {
	planetSwitch:{
			class:AbilityPlanetSwitch,
			type:"press",
			cooldown:0,
			key:"KeyE",
			abilityKey:"E",
			killOnLand:true,
			name:"planet switch",
			abilityTime:0,
			cooldownUI:true,
			sound:"planet-switch",
	},
	walls:{
			class:AbilityWalls,
			type:"press",
			cooldown:9000,
			key:"KeyQ",
			abilityKey:"Q",
			killOnLand:false,
			name:"wall hack",
			abilityTime:3000,
			cooldownUI:true,
			sound:"wall-hack",
	},
	directionalBoost:{
			class:AbilityDirectionalBoost,
			type:"none",
			cooldown:0,
			key:"LeftShift",
			abilityKey:"Shift",
			killOnLand:false,
			name:"directional boost",//planet switch
			abilityTime:0,
			cooldownUI:false,
			sound:null,
	},
	teleport:{
			class:AbilityTeleport,
			type:"pressConfirm",
			cooldown:7000,
			key:"KeyE",
			abilityKey:"E",
			killOnLand:false,
			name:"teleport",
			abilityTime:0,
			cooldownUI:true,
			sound:"teleport",
	},
	doubleJump:{
			class:AbilityDoubleJump,
			type:"none",
			cooldown:0,
			key:"Space",
			abilityKey:"Space",
			killOnLand:false,
			name:"double jump",
			abilityTime:0,
			cooldownUI:false,
			sound:"double-jump",
	},
	blink:{
			class:AbilityBlink,
			type:"none",
			cooldown:4000,
			key:"Shift",
			abilityKey:"Shift",
			killOnLand:false,
			name:"blink",
			abilityTime:.2,
			cooldownUI:true,
			sound:"blink",
	},
	blink:{
			class:AbilityBlink,
			type:"none",
			cooldown:4000,
			key:"Shift",
			abilityKey:"Shift",
			killOnLand:false,
			name:"blink",
			abilityTime:.2,
			cooldownUI:true,
			sound:"blink",
	},
	
}
const particles = {
	explosion:{
		burst:true,
		amount:10,
	    killTimeout:400, 
	    mesh:"box", 
	    col: new THREE.Color().setHSL(.1,1,.7), 
	    pos:new THREE.Vector3(), 
	    rndPos:0.8, 
	    rot:new THREE.Vector3(), 
	    rndRot:0, 
	    rndScl:.5, 
	    scl:.1,
	    velPosScale:40,
		velRot:0,
		velScl:-5, 
		velPosRnd: 3,
		lookAt:true,
		lookAtLength:3,
		sound:"explosion"
	},
	slime:{
		burst:true,
		amount:10,
	    killTimeout:400, 
	    mesh:"box", 
	    col: new THREE.Color(0xf74ba8), 
	    pos:new THREE.Vector3(), 
	    rndPos:0.8, 
	    rot:new THREE.Vector3(), 
	    rndRot:0, 
	    rndScl:.5, 
	    scl:.1,
	    velPosScale:40,
		velRot:0,
		velScl:-5, 
		velPosRnd: 3,
		lookAt:true,
		lookAtLength:3,
		sound:"slime-thud"
	},
	shot:{
		burst:true,
		amount:2,
	    killTimeout:400, 
	    mesh:"box", 
	    col: new THREE.Color().setHSL(0,0,.4), 
	    pos:new THREE.Vector3(), 
	    rndPos:0, 
	    rot:new THREE.Vector3(), 
	    rndRot:Math.random()*(Math.PI*2), 
	    rndScl:0, 
	    scl:.15,
	    velPosScale:10,
		velRot:0,
		velScl:-1, 
		velPosRnd: 1,
		lookAt:false,
		lookAtLength:0,
		sound:null

	},
	boost:{
		burst:false,
		amount:10,
	    killTimeout:600, 
	    mesh:"box", 
	    col: new THREE.Color().setHSL(.1,1,.7), 
	    pos:new THREE.Vector3(), 
	    rndPos:.1, 
	    rot:new THREE.Vector3(), 
	    rndRot:Math.random()*(Math.PI*2), 
	    rndScl:0, 
	    scl:.17,
	    velPosScale:2,
		velRot:0,
		velScl:-8, 
		velPosRnd: 1,
		lookAt:false,
		lookAtLength:0,
		sound:null
	},
	blink:{
		burst:false,
		amount:10,
	    killTimeout:600, 
	    mesh:"box", 
	    col: new THREE.Color().setHSL(.6,1,.7), 
	    pos:new THREE.Vector3(), 
	    rndPos:1, 
	    rot:new THREE.Vector3(), 
	    rndRot:Math.random()*(Math.PI*2), 
	    rndScl:0, 
	    scl:.3,
	    velPosScale:2,
		velRot:0,
		velScl:-5, 
		velPosRnd: 1,
		lookAt:false,
		lookAtLength:0,
		sound:null
	},
	doubleJump:{
		burst:true,
		amount:5,
	    killTimeout:300, 
	    mesh:"sphere", 
	    col: new THREE.Color().setHSL(.1,1,.7), 
	    pos:new THREE.Vector3(), 
	    rndPos:1.4, 
	    rot:new THREE.Vector3(), 
	    rndRot:Math.random()*(Math.PI*2), 
	    rndScl:0, 
	    scl:.2,
	    velPosScale:2,
		velRot:0,
		velScl:-4, 
		velPosRnd: 5,
		lookAt:false,
		lookAtLength:0,
		sound:null
	},
}

const weapons = {
	sticky:{
		shootCooldown:150,    
		bullet:StickyBullet, 
		ammoAmount:16,    
		reloadCooldown:1000,  
		zoom:80,    
		adsRandom:.5, 
		impulse:60 , 
		knockParams:{pos:new THREE.Vector3(), distance:10, strength:40, gravMult:4},
		name:"sticky",
		damage:60,
		sound:"rocket2",
		abilities:[abilities.doubleJump],
		model:"sticky",
		adsMouseSenseMult:0
	},
	launcher:{
		shootCooldown:300,  
		bullet:RocketBullet, 
		ammoAmount:12,    
		reloadCooldown:1000,  
		zoom:80,    
		adsRandom:.1, 
		impulse:90, 
		knockParams:{pos:new THREE.Vector3(), distance:10, strength:40, gravMult:4},
		name:"launcher",
		damage:60,
		sound:"rocket",
		abilities:[abilities.doubleJump],
		model:"launcher",
		adsMouseSenseMult:0
	},
	automatic:{
		shootCooldown:80,  
		bullet:AutoBullet,   
		ammoAmount:30,   
		reloadCooldown:1200,  
		zoom:70,    
		adsRandom:.2, 
		impulse:180, 
		name:"automatic",
		knockParams:{pos:new THREE.Vector3(), distance:6, strength:25, gravMult:4},
		damage:23,
		//damage:1,
		sound:"automatic-2",
		abilities:[abilities.blink],
		model:"assault",
		adsMouseSenseMult:0
	},
	submachine:{
		shootCooldown:50, 
		bullet:AutoBullet,   
		ammoAmount:25,   
		reloadCooldown:800,   
		zoom:80,    
		adsRandom:.3, 
		impulse:180, 
		name:"submachine",
		knockParams:{pos:new THREE.Vector3(), distance:6, strength:15, gravMult:4},
		damage:15,
		sound:"sub",
		abilities:[abilities.blink],
		model:"submachine",
		adsMouseSenseMult:0
	},
	sniper:{
		shootCooldown:350,    
		bullet:SniperBullet,   
		ammoAmount:3,    
		reloadCooldown:1000,  
		zoom:27,    
		adsRandom:.1, 
		impulse:180, 
		contactParticle:particles.shot,
		name:"sniper",
		knockParams:{pos:new THREE.Vector3(), distance:8, strength:60, gravMult:8},
		damage:70,
		sound:"sniper2",
		abilities:[abilities.walls],
		model:"sniper",
		adsMouseSenseMult:.5
	},
	sixgun:{
		shootCooldown:200,    
		bullet:SniperBullet,   
		ammoAmount:6,    
		reloadCooldown:800,  
		zoom:70,    
		adsRandom:.2, 
		impulse:180, 
		name:"sixgun",
		knockParams:{pos:new THREE.Vector3(), distance:8, strength:50, gravMult:6},
		damage:50,
		sound:"sniper-six2",
		abilities:[abilities.walls],
		model:"sixgun",
		adsMouseSenseMult:0
	},
}



const globalHelperFunctions = {
	knockPlayer:
		function(OBJ){
			if(appGlobal.localPlayer != null){
				appGlobal.localPlayer.knockPlayer(OBJ);
			}
			//for(let i = 0; i<appGlobal.playerArray.length; i++){
				//appGlobal.playerArray[i].knockPlayer(OBJ);
			//}
		},
	playerSphereCollision:
		function(collider, id){
			//for (const obj in appGlobal.remotePlayers) {
			for (let i = 0;i<appGlobal.remotePlayers.length; i++){
				if(appGlobal.remotePlayers[i].id != id && appGlobal.remotePlayers[i].playing){
					const start = new THREE.Vector3();
					const end = new THREE.Vector3();
					appGlobal.remotePlayers[i].remotePlayer.start.getWorldPosition(start);
					appGlobal.remotePlayers[i].remotePlayer.end.getWorldPosition(end);
					const vector = new THREE.Vector3();
					const center = vector.addVectors(start, end).multiplyScalar( 0.5 );

					const playerRadius = appGlobal.remotePlayers[i].remotePlayer.radius*2;
					const r = playerRadius + collider.radius;
					const r2 = r * r;
					
					// approximation: player = 3 spheres
					let t = 0;
					for ( const point of [ start, center, end ] ) {

						const d2 = point.distanceToSquared( collider.center );

						if ( d2 < r2 ) {
							let headShot = false;
							if(t==2){
								headShot = true;
							}
							return {id:appGlobal.remotePlayers[i].id, headShot:headShot};
						}
						t++;
					}
				}
			}
			return null;
		},
	splashDamage:
		function(OBJ){
			const arr = [];
			//for (const obj in appGlobal.remotePlayers) {
			for (let i = 0;i<appGlobal.remotePlayers.length; i++){
				
				if(appGlobal.remotePlayers[i].remotePlayer != null){
					const start = new THREE.Vector3();
					appGlobal.remotePlayers[i].remotePlayer.start.getWorldPosition(start);
					const dist = start.distanceTo(OBJ.pos);
					const id = appGlobal.remotePlayers[i].id;
					if(dist < OBJ.distance){
						const s = (OBJ.distance-dist)/OBJ.distance;
						const obj = {damageMult:s, id:id};
						arr.push(obj);
					}
				}
			}
			return arr;
		},
	playerDoDamage:
		function(OBJ){
			if(appGlobal.localPlayer !=null ){
				appGlobal.localPlayer.handleDoDamage(OBJ);
			}
		},
	playerReset:
		
		function(id, resetFromKill){
			
			clearTimeout(appGlobal.serverInfoTimeout);
			appGlobal.playing = false;
			
			if(appGlobal.localPlayer != null){
				appGlobal.localPlayer.kill();
				appGlobal.localPlayer = null;
				appGlobal.controller.player = null;
			
			}

			for(let i = 0; i<appGlobal.remotePlayers.length; i++){
				appGlobal.remotePlayers[i].kill();
			}
			
			if(clockInterval!=null){
				clearInterval(clockInterval);
			}
			
			document.getElementById("instructions").innerHTML = "<div class='bots-stats-biggest'>Score:"+(clockTime+(appGlobal.totalKills*2)+(appGlobal.itemsPickedUp*10))+"</div><div class='bots-stats-lower'>Time : "+clockTime+"</div><div class='bots-stats-lower'>Kills : "+appGlobal.totalKills+" <span class='bots-score-mult'>* 2</span></div><div class='bots-stats-lower'>Items : "+appGlobal.itemsPickedUp+" <span class='bots-score-mult'>* 10</span></div>";
			document.getElementById("kills-bots").innerHTML="";
			//appGlobal.itemHandler.kill();
			appGlobal.itemHandler.resetBots();
			
			// socket.emit('handleDeath', {
			//   id: socket.id
			// });
			if(resetFromKill){
				setTimeout(function(){
					if(appGlobal.gameState=="game"){
						document.exitPointerLock();
						overlayChildDisplayHelper();
						toggleOverlay(true);
					}
				}, 3000);
			}
		},
	getRemotePlayerById:
		function(id){
			for(let i = 0;i<appGlobal.remotePlayers.length; i++){
				//console.log("id = "+id);
				//console.log("looop = "+appGlobal.remotePlayers[i].id);
				if(appGlobal.remotePlayers[i].id == id){
					return {
						controller:appGlobal.remotePlayers[i], 
						player:appGlobal.remotePlayers[i].remotePlayer, 
						index:i
					};
				}
			}
			return null;
		},
	tryToRemoveGhost:
		function(fromServerArray){
			const arr = [];
			for(let i = 0;i<appGlobal.remotePlayers.length; i++){
				if(!checkIsInArr(fromServerArray, appGlobal.remotePlayers[i].id)){
					arr.push(i);
				}
			}
			for(let x = 0; x<fromServerArray.length; x++){
				if(!fromServerArray[x].playing){
					arr.push(x);
				}
			}
			//console.log("ghost array length = "+arr.length);
			for(let t = 0; t<arr.length; t++){
				const index = arr[t];

				if(appGlobal.remotePlayers[index]!=null){
					appGlobal.remotePlayers[index].kill();
					appGlobal.remotePlayers.splice(index,1);
				}
			}
			
		},
		getDistanceForSound:
			function(position){
				if(appGlobal.controller != null){
					//3D AUDIO falloff
					const max = 60;
					const globalCamPos = new THREE.Vector3();
					appGlobal.controller.camera.getWorldPosition(globalCamPos);
					let distance = Math.abs(position.distanceTo(globalCamPos));
					const d = clamp(distance, 0.01, max );
					const final = clamp( Math.abs(1.0 - (max/d)) ,0, 1 );
					return final;
				}else{
					return 0;
				}
		},
	initPlayerDom:
		function(OBJ){
			
			if(document.getElementById('' + OBJ.id + '')!=null){
			
				return document.getElementById(''+OBJ.id+'');
			
			}else{

				let dom = document.createElement("div");
				dom.id = OBJ.id;
				if(OBJ.isRemote){
					dom.className = "player-info";
					document.getElementById("player-list").append(dom);
				}else{
					document.getElementById("player-list").prepend(dom);
					dom.className = "player-info curr-player";
				}
				dom.innerHTML = "<span class='player-name'>" + OBJ.id + "</span>    <span class='kill-count'>"+OBJ.killCount+"</span>";
				return dom;

			}

		},
	updatePlayerDom:
		function(OBJ){
			OBJ.dom.innerHTML = "<span class='player-name'>" + OBJ.id + "</span>    <span class='kill-count'>"+OBJ.killCount+"</span>";
		},
	killPlayerDom:
		function(DOM){
			DOM.remove();
		},
	checkPlaying:
		function(){
			return appGlobal.playing && appGlobal.localPlayer != null;
		},
	handleInitPlaying:
		function(){
			appGlobal.playing = true;
			appGlobal.gameState = "game";
		  	overlayChildDisplayHelper();
			toggleOverlay(false);
			
			document.body.requestPointerLock();

			appGlobal.globalHelperFunctions.setUserName();
			appGlobal.controller.initPlayer({ weapon: currentSelectWeapon, movement:currentMovement,  name:appGlobal.user});	
			appGlobal.localPlayer = appGlobal.controller.player;
			
			if(clockInterval!=null){
				clearInterval(clockInterval);
			}
			
			clockTime = 0;
			appGlobal.totalKills = 0;
			appGlobal.itemsPickedUp = 0;
			window.timeIncrease.damage = 0;
			window.timeIncrease.impulse = 0;
			window.timeIncrease.respawnSpeed = 0;
			window.timeIncrease.shootSpeed = 0;
			window.timeIncrease.chasingSwitch = 0
			window.timeIncrease.planetSwitchCheck = 0
			window.timeIncrease.planetSwitchMovementThreshold = 0;
			
			clockInterval = setInterval(function(){
				let min = Math.floor(clockTime/60);
				let sec = Math.floor(clockTime%60);
				document.getElementById('timer').innerHTML = pad(min,2)+":"+pad(sec, 2);
				
				clockTime ++;
				if(clockTime%30==0){
					window.timeIncrease.damage += 2;
					window.timeIncrease.impulse += 10;
					window.timeIncrease.respawnSpeed -= 50;
					window.timeIncrease.shootSpeed -= 50;
					window.timeIncrease.chasingSwitch += 50;
					window.timeIncrease.planetSwitchCheck += 40;
					window.timeIncrease.planetSwitchMovementThreshold += 5;
				}

			},1000);

			
			
			// socket.emit('startPlaying', {
			// 	id:socket.id,
			// 	meshName:currMeshName,
			// 	name:appGlobal.user,
			// 	movement:currMovementName
			// });

			// appGlobal.serverInfoTimeout = window.setInterval(()=> {
			
			// 	socket.emit('sendPlayerData', {
			// 		id: socket.id,
			// 		animationObject:appGlobal.localPlayer.animationObject,
			// 		pos: appGlobal.localPlayer.playerCollider.start,
			// 		rot: appGlobal.localPlayer.remoteQuaternion,
			// 		camRotation:appGlobal.localPlayer.camera.rotation.x, 
			// 		//crouching: appGlobal.localPlayer.crouching,
			// 	})
			// },1000/SERVERFPS);
		},
	setUserName:
		function(){
			// if(document.getElementById("user-name").value != "" && document.getElementById("user-name").value != null){
			// 	appGlobal.user = document.getElementById("user-name").value;
			// }
			// document.getElementById("user-name-holder").style.display = "none";
		},
	tearDownObject:
		function (object){
			object.traverse( function ( obj ) {
				if(obj.isMesh || obj.isSkinnedMesh){
					
					if(obj.materials !=null ){
						for(let i = 0; i<obj.materials.length; i++){
							if(obj.materials[i].map!=null){
								obj.materials[i].map.dispose();
							}
							if(obj.materials[i].alphaMap!=null){
								obj.materials[i].alphaMap.dispose();
							}
							obj.materials[i].dispose();
						}
					}
					if(obj.material !=null ){
						if(obj.material.map!=null){
							obj.material.map.dispose();
						}
						if(obj.material.alphaMap!=null){
							obj.material.alphaMap.dispose();
						}
						obj.material.dispose();
						
					}
					obj.geometry.dispose();
					//obj.dispose();
				}

			});
		},

}


const settings = {
	"mouseSens":1,
	"volume":1,
	"crossHairColor":"fff",
	"adsMouseSenseMult":1,
	"gamePad":"false"
}

const appGlobal = {
	gravity:50,
	worldScale:15,
	scene:null,
	keyStates:{},
	STEPS_PER_FRAME:5,
	deltaTime:0,
	world:null,
	mouse:{down:false},
	localPlayer:null,
	doingOverlay:true,
	playing:false,
	controller:null,
	particleHandler:null,
	weapons:weapons,
	globalHelperFunctions:globalHelperFunctions,
	raycaster : new THREE.Raycaster(),
	hitScanArray: [],
	worldSize:1,
	serverInfoTimeout:null,
	gameState:"pregame",
	remoteBullets:null,
	socket:null,
	particles:particles,
	worlds:[],
	grappleMeshes:[],
	characterOutlineMeshes:[],
	random:null,
	itemHandler:null,
	serverItemArr:[],
	soundHandler:null,
	hue:0,
	totalKills:0,
	itemsPickedUp:0,
	loadObjs:[
		{name:"anis",    	    	model:null, loaded:false, url:"character-anis-3.glb"},
		{name:"body-launcher",  	model:null, loaded:false, url:"models/launcher/default/body.glb"         },
		{name:"body-sticky",    	model:null, loaded:false, url:"models/sticky/default/body.glb"         },
		{name:"body-assault",   	model:null, loaded:false, url:"models/assault/default/body.glb"         },
		{name:"body-submachine",   	model:null, loaded:false, url:"models/submachine/default/body.glb"         },
		{name:"body-sixgun",    	model:null, loaded:false, url:"models/sixgun/default/body.glb"         },
		{name:"body-sniper",    	model:null, loaded:false, url:"models/sniper/default/body.glb"         },
		{name:"fps-sniper",       	model:null, loaded:false, url:"models/sniper/default/fps.glb"    },
		{name:"fps-sixgun",       	model:null, loaded:false, url:"models/sixgun/default/fps.glb"    },
		{name:"fps-launcher",     	model:null, loaded:false, url:"models/launcher/default/fps.glb"  },
		{name:"fps-sticky",       	model:null, loaded:false, url:"models/sticky/default/fps.glb"  },
		{name:"fps-submachine",   	model:null, loaded:false, url:"models/submachine/default/fps.glb"  },
		{name:"fps-assault",      	model:null, loaded:false, url:"models/assault/default/fps.glb"  },
		
		{name:"title",      		model:null, loaded:false, url:"zerochill.glb"  },
		
		{name:"assault-boost",      model:null, loaded:false, url:"models/assault/default/boost.glb"  },
		{name:"assault-directional",model:null, loaded:false, url:"models/assault/default/directional.glb"  },
		{name:"assault-teleport",   model:null, loaded:false, url:"models/assault/default/teleport.glb"  },
		
		{name:"submachine-boost",      model:null, loaded:false, url:"models/submachine/default/boost.glb"  },
		{name:"submachine-directional",model:null, loaded:false, url:"models/submachine/default/directional.glb"  },
		{name:"submachine-teleport",   model:null, loaded:false, url:"models/submachine/default/teleport.glb"  },
		
		{name:"sticky-boost",      model:null, loaded:false, url:"models/sticky/default/boost.glb"  },
		{name:"sticky-directional",model:null, loaded:false, url:"models/sticky/default/directional.glb"  },
		{name:"sticky-teleport",   model:null, loaded:false, url:"models/sticky/default/teleport.glb"  },
		
		{name:"launcher-boost",      model:null, loaded:false, url:"models/launcher/default/boost.glb"  },
		{name:"launcher-directional",model:null, loaded:false, url:"models/launcher/default/directional.glb"  },
		{name:"launcher-teleport",   model:null, loaded:false, url:"models/launcher/default/teleport.glb"  },

		{name:"sixgun-boost",      model:null, loaded:false, url:"models/sixgun/default/boost.glb"  },
		{name:"sixgun-directional",model:null, loaded:false, url:"models/sixgun/default/directional.glb"  },
		{name:"sixgun-teleport",   model:null, loaded:false, url:"models/sixgun/default/teleport.glb"  },

		{name:"sniper-boost",      model:null, loaded:false, url:"models/sniper/default/boost.glb"  },
		{name:"sniper-directional",model:null, loaded:false, url:"models/sniper/default/directional.glb"  },
		{name:"sniper-teleport",   model:null, loaded:false, url:"models/sniper/default/teleport.glb"  },
	],
	initedThree:false,
	playerSelectScene:null,
	titleScene:null,
	user:"",
	settingsParams:settings,
	settings:null,
	servers:null,
	socketRooms:[],
	currentRoom:'',
	gamePad:new GamePad(),
	remotePlayers:[],
	worldOctree:new Octree(),
	worldsHolder:null,
	parallax:new ParallaxGUI(),
	skinsHandler:new SkinsHandler(),
	bots:[],
};



window.appGlobal = appGlobal;

const planetSwitchBot = {
	class:AbilityPlanetSwitchBot,
	type:"press",
	cooldown:0,
	key:"KeyE",
	abilityKey:"E",
	killOnLand:true,
	name:"bot",
	abilityTime:0,
	cooldownUI:false,
	sound:"planet-switch",
}

const botWeapon = {

	shootCooldown:800,  
	bullet:BotBullet, 
	ammoAmount:6,    
	reloadCooldown:1200,  
	zoom:80,    
	adsRandom:.1, 
	impulse:10, 
	knockParams:{pos:new THREE.Vector3(), distance:10, strength:40, gravMult:4},
	name:"bot",
	damage:4,
	sound:"splat",
	abilities:[abilities.doubleJump],
	model:"none",
	adsMouseSenseMult:0

}

let currentSelectWeapon = appGlobal.weapons.automatic;
let currentMovement = abilities.planetSwitch;
let currMeshName = "assault";
let currMovementName = "boost"
let joinedFirstRoom = false;
let initedServers = false;
let playerIndex = "";
let playerAmount = 0;
let maxPlayers = 0;
let currLoad = 0;
let clockInterval, clockTime = 0;

//let remotePlayers = [];//window.remotePlayers = {};
let stats;
const SERVERFPS = 20;

const q = getQuery();
let seed = Math.floor(Math.random()*2000);
if(q != null){
	seed = q;
}

const timeIncrease = {
	damage:0,
	impulse:0,
	shootSpeed:0,
	respawnSpeed:0,
	chasingSwitch:0,
	planetSwitchCheck:0,
	planetSwitchMovementThreshold:0
}
window.timeIncrease = timeIncrease;
//document.getElementById("debug").innerHTML = "game";
appGlobal.random = new Math.seedrandom(seed);
playerIndex = 0;
appGlobal.gameState = "game";
appGlobal.serverItemArr = initPickups();
appGlobal.user = 'bot';
joinedFirstRoom = true;
window.history.replaceState({}, '', `${location.pathname}?seed=${seed.toString()}`);

initLoading();

function getQuery(){
    const query = window.location.search.substring(1);
   	const vars = query.split("&");
   	//console.log(vars)
    return parseQuery(vars);
}

function parseQuery(vars){
	for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if(pair != null){
        	//console.log(pair[0])
	        if (decodeURIComponent(pair[0]) == "seed") {
	        	return pair[1];
	        }
    	}
    }
    return null;
}



function initBots(){
	const names = ["assault","sixgun","launcher","sticky","submachine", "sniper"];
	for(let i = 0; i<12; i++){
		const rndName = names[Math.floor(Math.random()*names.length)]
		const bot = new BotPlayer({name:rndName, id:i, movement:"boost", ability:planetSwitchBot, weapon:botWeapon });
		appGlobal.remotePlayers.push(bot);
	}
}

function initPickups(){
	const arr = [];
	for(let i = 0;i< Math.floor(7+appGlobal.random()*10); i++ ){
		arr.push({index:i, killed:false})
	}
	return arr;
}


function initLoading(){
	
	const loader = new GLTFLoader().setPath( 'assets/' );
	for(let i = 0; i<appGlobal.loadObjs.length; i++){
		const ii = i;
		loader.load( appGlobal.loadObjs[i].url, function ( gltf ) {
			handleLoad(ii,gltf);
		});
	}
	
}


function handleLoad(index, gltf){
	currLoad++;
	appGlobal.loadObjs[index].loaded = true;
	appGlobal.loadObjs[index].model = gltf;
	document.getElementById("loaded").innerHTML = currLoad;
	document.getElementById("loading-total").innerHTML = appGlobal.loadObjs.length;
	if(checkLoaded()){
		document.getElementById('loading').style.display = "none";
		document.getElementById('overlay').style.display = "block";
		initThree();
	}
}

function checkLoaded(){
	for(let i = 0; i<appGlobal.loadObjs.length; i++){
		if(!appGlobal.loadObjs[i].loaded)
			return false;	
	}
	return true;
}

function initThree(){

	document.getElementById("class-button-automatic").className = "class-btn-active";
	document.getElementById("movement-button-planet").className = "movement-btn-active";
	
	overlayChildDisplayHelper();
	
	appGlobal.settings = new Settings();
	appGlobal.scene = new CustomScene();
	appGlobal.particleHandler = new GlobalParticleHandler();
	appGlobal.controller = new PlayerController({id:100, user:appGlobal.user});
	appGlobal.remoteBullets = new RemoteBulletHandler();
	appGlobal.itemHandler = new ItemHandler();
	appGlobal.soundHandler = new GlobalSoundHandler();
	appGlobal.playerSelectScene = new PlayerSelectScene();
	appGlobal.titleScene = new TitleScene();
	
	appGlobal.scene.reset();

	initBots();
	
	const container = document.getElementById( 'container' );
	container.appendChild( appGlobal.scene.renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	appGlobal.initedThree = true;
	
	//const worldOctree = new Octree();
	animate();
}

function overlayChildDisplayHelper(){

	document.getElementById("class-select").style.display="none";
	document.getElementById("game-over").style.display="none";
	document.getElementById("player-list").style.display="none";

	switch(appGlobal.gameState){
		case"pregame":
		case "game":
			if(appGlobal.playing){
				document.getElementById("player-list").style.display="block";
			}else{
				document.getElementById("class-select").style.display = "block";
			}
			toggleOverlay(true);
		break;
		case "postgame":
			document.getElementById("game-over").style.display = "block";
			document.getElementById("player-list").style.display="block";
			toggleOverlay(true);
		break;
	}
}

function resetHelper(){
	for(let i = 0; i<appGlobal.worlds.length; i++){
		appGlobal.worlds[i].kill();
	}
	appGlobal.worlds = [];
	appGlobal.particleHandler.kill();
	appGlobal.remoteBullets.kill();
	appGlobal.itemHandler.kill();
	appGlobal.scene.kill();

	appGlobal.hitScanArray = [];
	appGlobal.grappleMeshes = [];
	
	appGlobal.scene.reset();
	appGlobal.controller.controls.reset();
	//appGlobal.itemHandler.reset();
	//appGlobal.scene = new CustomScene();
	//appGlobal.world = new World();
}


document.addEventListener( 'keydown', ( event ) => {
	if(appGlobal.globalHelperFunctions.checkPlaying()){
		if(checkShoulPreventDefault()){
			event.stopPropagation();event.preventDefault();
		}
	}

	appGlobal.keyStates[ event.code ] = true;
	
	if(appGlobal.globalHelperFunctions.checkPlaying()){
		//if(appGlobal.localPlayer!=null)
		appGlobal.localPlayer.handleKeyDown(event.code)
	}
	
	if(event.code=="Tab"){
		
		if( !appGlobal.doingOverlay ){
			if(appGlobal.gameState == "game" && appGlobal.globalHelperFunctions.checkPlaying()){
				overlayChildDisplayHelper();
				toggleOverlay(true)	
			}
		}
	}

});

document.addEventListener( 'keyup', ( event ) => {
	if(appGlobal.globalHelperFunctions.checkPlaying()){
		if(checkShoulPreventDefault()){
			event.stopPropagation();event.preventDefault();
		}
	}
	appGlobal.keyStates[ event.code ] = false;
	if(appGlobal.globalHelperFunctions.checkPlaying()){
		if(appGlobal.localPlayer!=null)
			appGlobal.localPlayer.handleKeyUp(event.code)
	}
	if(event.code == "Tab"){
		
		if(appGlobal.gameState=="game" && appGlobal.globalHelperFunctions.checkPlaying()){
			window.focus();
			toggleOverlay(false)
		}

	}

});

document.addEventListener('pointerlockchange', function(){

}, false);

document.addEventListener( 'mousedown', (event) => {
	
	if(appGlobal.globalHelperFunctions.checkPlaying()){
		event.preventDefault();
		if(event.button==0){
			document.body.requestPointerLock();
			appGlobal.mouse.down = true;
		}else if(event.button == 2){
			appGlobal.localPlayer.ads(true);
		}
	}

});


// function checkPlaying(){
// 	return appGlobal.playing && appGlobal.localPlayer != null;
// }

function checkShoulPreventDefault(){
	return event.code=="Tab" || event.code=="LeftControl" || event.code == "KeyW" || event.code=="KeyD" || event.code=="KeyS" || event.code=="KeyA"
}

document.addEventListener( 'mouseup', ( event ) => {
	event.preventDefault();
	if(event.button==0){
		appGlobal.mouse.down = false;
	}else if(event.button == 2){
		
		if(appGlobal.globalHelperFunctions.checkPlaying()){
			appGlobal.localPlayer.ads(false);
		}

	}
	//player.handleMouseUp();
	//throwBall();
});

document.body.addEventListener( 'mousemove', ( event ) => {
	if ( document.pointerLockElement === document.body ) {
		if(appGlobal.globalHelperFunctions.checkPlaying()){
			appGlobal.localPlayer.updateMouseMove(event);
			
		}
	}else{
		if(!appGlobal.playing){
			if(appGlobal.titleScene!=null)
				appGlobal.titleScene.updateMouseMove(event);
				appGlobal.parallax.updateMouseMove(event);
		}
	}
} );

window.addEventListener( 'resize', function(){
	if(appGlobal.scene){
		appGlobal.scene.updateWindowSize();
	}
});

function animate() {
	
	if(!appGlobal.playing){
		appGlobal.playerSelectScene.update();
		appGlobal.titleScene.update();
		appGlobal.parallax.update();
	}

	// for(let i = 0; i<appGlobal.bots.length;i++){
	// 	appGlobal.bots[i].update();
	// }

	appGlobal.gamePad.update();
	appGlobal.scene.update();
	
	
	// for(let i = 0; i<appGlobal.remotePlayers.length; i++){
	// 	appGlobal.remotePlayers[i].update();	
	// }

	stats.update();
	requestAnimationFrame( animate );

}


function toggleOverlay(showOverlay){
	appGlobal.doingOverlay = showOverlay;
	if(showOverlay){
		document.getElementById("hud").style.display="none";
		document.getElementById("overlay").style.display="block";	
	}else{
		document.getElementById("hud").style.display="block";
		document.getElementById("overlay").style.display="none";
	}
}

document.getElementById("class-button-sticky").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.sticky);
	currentSelectWeapon = appGlobal.weapons.sticky;
	currMeshName = "sticky";
	handleSwitchClass(document.getElementById("class-button-sticky"), "class-btn-active", "class-btn", {type:"class", class:"sticky"});
});
document.getElementById("class-button-automatic").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.automatic);
	currentSelectWeapon = appGlobal.weapons.automatic;
	currMeshName = "assault";
	handleSwitchClass(document.getElementById("class-button-automatic"), "class-btn-active", "class-btn", {type:"class", class:"assault"});
});
document.getElementById("class-button-sub").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.submachine);
	currentSelectWeapon = appGlobal.weapons.submachine;
	currMeshName = "submachine";
	handleSwitchClass(document.getElementById("class-button-sub"), "class-btn-active", "class-btn", {type:"class", class:"submachine"});
});
document.getElementById("class-button-sniper").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.sniper);
	currentSelectWeapon = appGlobal.weapons.sniper;
	currMeshName = "sniper";
	handleSwitchClass(document.getElementById("class-button-sniper"), "class-btn-active", "class-btn",  {type:"class", class:"sniper"});
});
document.getElementById("class-button-launcher").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.launcher);
	currentSelectWeapon = appGlobal.weapons.launcher;
	currMeshName = "launcher";
	handleSwitchClass(document.getElementById("class-button-launcher"), "class-btn-active", "class-btn", {type:"class", class:"launcher"});
});
document.getElementById("class-button-sixgun").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.sixgun);
	currentSelectWeapon = appGlobal.weapons.sixgun;
	currMeshName = "sixgun";
	handleSwitchClass(document.getElementById("class-button-sixgun"), "class-btn-active", "class-btn",  {type:"class", class:"sixgun"});
});

document.getElementById("movement-button-planet").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.sixgun);
	currMovementName = "boost";
	currentMovement = abilities.planetSwitch;
	handleSwitchClass(document.getElementById("movement-button-planet"), "movement-btn-active", "movement-btn",  {type:"movement", name:"planet switch"});
});
document.getElementById("movement-button-directional").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.sixgun);
	currMovementName = "directional";
	currentMovement = abilities.directionalBoost;
	handleSwitchClass(document.getElementById("movement-button-directional"), "movement-btn-active", "movement-btn", {type:"movement", name:"directional"});
});
document.getElementById("movement-button-teleport").addEventListener("click", function (){
	//handleInitPlaying(appGlobal.weapons.sixgun);
	currMovementName = "teleport";
	currentMovement = abilities.teleport;
	handleSwitchClass(document.getElementById("movement-button-teleport"), "movement-btn-active", "movement-btn", {type:"movement", name:"teleport"});
});

document.getElementById("play-btn").addEventListener("click", function (){
	appGlobal.globalHelperFunctions.handleInitPlaying();
	// overlayChildDisplayHelper();
	// toggleOverlay(false);
	// document.getElementById("hud").style.display="none";
});

document.getElementById("spectate-btn").addEventListener("click", function (){
	overlayChildDisplayHelper();
	toggleOverlay(false);
	document.getElementById("hud").style.display="none";
});

function handleSwitchClass(elem, activeName, nonActiveName, OBJ){
	const collection = document.getElementsByClassName(activeName);
	for(let i = 0; i<collection.length; i++){
		collection[i].className = nonActiveName;
	}
	elem.className = activeName;
	if(OBJ.type == "class")
		appGlobal.playerSelectScene.handleCharacterSwitch( {class:OBJ.class, movement:currMovementName} );
	else if(OBJ.type=="movement")
		appGlobal.playerSelectScene.handleMovementSwitch( {movement:currMovementName, class:currMeshName} );
}

// function handleInitPlaying(){
	
// }


function isSocketRoom(name){
	for(let i = 0; i<appGlobal.socketRooms.length; i++){
		if(appGlobal.socketRooms[i]==name)
			return true;
	}
	return false;
}

function checkIfWinnerId(socketid, winnersArray){
	for(let i = 0; i<winnersArray.length; i++){
		if(socketid == winnersArray[i])
			return true;
	}
	return false;
}

function clamp(num, min, max){
	return Math.min(Math.max(num, min), max)
}

function checkIsInArr(arr,id){
	for(let i = 0; i<arr.length; i++){
		if(arr[i].id==id){
			return true;
		}
	}
	return false;
}


function nullHelper(){

}

function updateURL(){
	const params = new URLSearchParams(location.search);
	params.set('game', appGlobal.roomName);
	params.toString(); // => test=123&cheese=yummy
	window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
}


function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// function switchRooms(){

// 	for(let i = 0; i<appGlobal.remotePlayers.length;i++){
// 		appGlobal.remotePlayers[i].killRemotePlayer();
// 	}

// 	appGlobal.random = new Math.seedrandom(""+data.seed+"");
// 	appGlobal.gameState = data.state;
// 	appGlobal.globalHelperFunctions.playerReset(socket.id, false);

// 	resetHelper();
// 	overlayChildDisplayHelper();

	
// 	socket.on('endGame', (data) => {
// 	document.getElementById("debug").innerHTML = data.state;
// 	appGlobal.gameState = data.state;

// 	appGlobal.globalHelperFunctions.playerReset(socket.id, false);
	
// 	document.exitPointerLock();
// 	overlayChildDisplayHelper();

// }
