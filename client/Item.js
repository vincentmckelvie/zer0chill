import {
	Object3D,
	CylinderGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	TorusGeometry,
	Color,
	TextureLoader,
	MeshBasicMaterial,
	AdditiveBlending,
	DoubleSide,
	SphereGeometry,
	FlatShading
} from 'three';

class Item {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		const sizeMult = 1.2+(OBJ.sizeMult*.7);
		const geo = new SphereGeometry( 1, 4, 2 );
		//const geo = new TorusGeometry( 1, .3, 16, 18 );
		const geoCylinder = new CylinderGeometry( 1.4, 1.4, (OBJ.scale*sizeMult)-OBJ.scale, 16, 1, true );
		const mat = new MeshStandardMaterial({ flatShading:true, color:new Color().setHSL( (appGlobal.hue +.45) % 1.0 , .8, .5 ),roughness:0.07});
		const tex = new TextureLoader().load( 'assets/textures/grad-vertical.png' );
		const matCyl = new MeshBasicMaterial({transparent:true, opacity:.3, map: tex, side:DoubleSide, blending:AdditiveBlending, alphaMap:tex, color:new Color().setHSL( (appGlobal.hue +.45) % 1.0 , .8, .8 ), });
		
		this.radius = 2;
		this.mesh = new Mesh(geo,mat);
		this.cyl = new Mesh(geoCylinder,matCyl);
		this.offset = new Object3D();
		this.planetRot = new Object3D();
		this.rot = new Object3D();
		
		if(!OBJ.killed){
			appGlobal.scene.add(this.offset);
			this.offset.add(this.planetRot)
			this.planetRot.add(this.rot, this.cyl);

			this.rot.add(this.mesh);
		}
		this.rot.rotation.y = Math.PI *.5;
		this.cyl.rotation.y = Math.PI *.5;
		this.cyl.position.y = ((OBJ.scale*sizeMult)+OBJ.scale)/2;
		this.rot.position.y = OBJ.scale*sizeMult;
		this.planetRot.rotation.x=OBJ.rotation.x;
		this.planetRot.rotation.y=OBJ.rotation.y;
		this.planetRot.rotation.z=OBJ.rotation.z;
		this.offset.position.copy(OBJ.position);
		
		const globalPos = new Vector3();
		this.mesh.getWorldPosition(globalPos)
		this.collider = new Sphere( globalPos, this.radius );
		this.offset.lookAt(OBJ.lookPosition);
		this.index = OBJ.index;
		this.killed = OBJ.killed;

		
	}

	update(){
		if(!this.killed){
			this.mesh.rotation.y += -appGlobal.deltaTime*1.3;
			this.handleCollision();
		}
	}


  	kill(){
  		if(!this.killed){
	  		this.killed = true;
	  		this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			this.cyl.geometry.dispose();
			this.cyl.material.dispose();
			this.rot.remove(this.mesh, this.cyl)
			this.planetRot.remove(this.rot );
			this.offset.remove(this.planetRot);
			appGlobal.scene.remove(this.offset);
		}
  	}

  	pickUp(){
  		this.kill();
  		appGlobal.soundHandler.playSoundByName({name:"health",dist:1});
  		socket.emit('getItem', { 
  			index:this.index, 
  			id:appGlobal.localPlayer.id, 
  			sound:"health", 
  			position:this.offset.position 
  		});
  // 		socket.emit('playSoundAtPosition', {
		// 	  id: appGlobal.localPlayer.id,
		// 	  sound:"health",
		// 	  position:this.offset.position
		// });
  	}

  	handleCollision(){
  		
  		if(appGlobal.localPlayer!=null){

			const start = new Vector3().copy(appGlobal.localPlayer.playerCollider.start);
			const end = new Vector3().copy(appGlobal.localPlayer.playerCollider.end);
			
			const vector = new Vector3();
			const center = vector.addVectors(start, end).multiplyScalar( 0.5 );
			const playerRadius = appGlobal.localPlayer.playerCollider.radius;
			const r = playerRadius + this.radius;
			const r2 = r * r;
			
			for ( const point of [ start, end, center ] ) {

				const d2 = point.distanceToSquared( this.collider.center );

				if ( d2 < r2 && appGlobal.localPlayer.life < 100 ) {
					//appGlobal.localPlayer.heal();
					this.pickUp();
				}

			}
		}
			
  	}
}

export { Item };
