import {
	MeshStandardMaterial,
	Mesh,
	Vector3,
	SphereGeometry,
	BoxGeometry,
	Color,
	Object3D,
	CylinderGeometry
} from 'three';


class EnvironmentObject {

	//constructor( i = 0, parent = null, worldScale=20 ) {
	constructor( OBJ ) {
	
		this.parent = OBJ.parent;
		this.killed = false;
		this.i = OBJ.i;
		
		// const geo = new SphereGeometry(.1+appGlobal.random()*.4,6,6);
		// const mat = new MeshStandardMaterial({color:OBJ.color});
		// this.mesh = new Mesh(geo,mat);
		
		const pos = new Vector3();
		pos.x = -1.5+appGlobal.random()*3;
		pos.y = -2+appGlobal.random()*4;
		pos.z = -1.5+appGlobal.random()*3;
		pos.normalize();
		this.meshHolder = new Object3D();
		pos.multiplyScalar(OBJ.scale);
		this.meshHolder.position.copy(pos);
		this.meshHolder.lookAt(new Vector3());
		this.color = OBJ.color;
		this.holder = new Object3D;
		appGlobal.scene.add(this.holder);
		this.holder.position.copy(this.parent.position);
		this.holder.add(this.meshHolder);
		const self = this;
		self.handleMeshCreate();
		//this.parent.add(this.mesh);
		//this.rand = Math.random();


	}

	handleMeshCreate(){
		const rnd = Math.floor(appGlobal.random()*4);
		//const rnd = 3;
		switch(rnd){
			case 0:
				for(let i = 0; i<1+Math.floor(appGlobal.random()*3); i++){
					const geo = new SphereGeometry(.1+appGlobal.random()*.6,6,6);
					const mat = new MeshStandardMaterial({color:this.color});
					const mesh = new Mesh(geo,mat);
					mesh.position.x += (-1+appGlobal.random()*2)*.8;
					mesh.position.y += (-1+appGlobal.random()*2)*.8;
					this.meshHolder.add(mesh);
				}
			break;
			case 1:
				for(let i = 0; i<3; i++){
					const geo = new CylinderGeometry( 0, .1, .2+appGlobal.random(), 8 );
					const mat = new MeshStandardMaterial({color:this.color});
					const mesh = new Mesh(geo,mat);

					mesh.position.x = i*.3;
					mesh.rotation.x-=Math.PI/2;
					mesh.position.x += (-1+appGlobal.random()*2)*.8;
					mesh.position.y += (-1+appGlobal.random()*2)*.8;
					this.meshHolder.add(mesh);
				}
			break;
			case 2:
				const amt = 8;
				const height = .2+appGlobal.random()*1.5;
				const hue = appGlobal.random()*.2
				for(let i = 0; i<amt; i++){
					const geo = new SphereGeometry(.2+height*.4,6,6);
					const mat = new MeshStandardMaterial({color:new Color().setHSL(hue ,1,.6), roughness:.2});
					const mesh = new Mesh(geo,mat);
					mesh.scale.set( 1, .2, .2);
					mesh.rotation.z += (Math.PI*2)*(i/amt-1)
					this.meshHolder.add(mesh);
					mesh.position.z -= (height/2);
					mesh.position.z -= -(.12);
				}
				const geo1 = new BoxGeometry(.1,.1,height);
				const mat1 = new MeshStandardMaterial({color:this.color});
				const mesh1 = new Mesh(geo1,mat1);
				this.meshHolder.add(mesh1);
			break;
			case 3:
				//const halfSphere = new THREE.Mesh( geometry, material );

				const height2 = .8+appGlobal.random()*.7;
				
				const geo2 = new BoxGeometry(.2,.2, height2);
				const mat2 = new MeshStandardMaterial({color:this.color});
				const mesh2 = new Mesh(geo2, mat2);

				const geo3 = new SphereGeometry( .5, 8, 8, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 90 );
				const mat3 = new MeshStandardMaterial({color:this.color});
				const mesh3 = new Mesh(geo3, mat3);
				
				const geo4 = new CylinderGeometry( .5, .5, 0.01, 8, 1 );
				const mat4 = new MeshStandardMaterial( { color: this.color } );
				const mesh4 = new Mesh(geo4, mat4);

				mesh3.position.z = (-height2)+.7;
				mesh4.position.z = (-height2)+.7;
				mesh3.rotation.x = mesh4.rotation.x = -Math.PI/2;
				
				this.meshHolder.add(mesh4, mesh3, mesh2);
			break;

		}
	}

	update(OBJ){
			
		// if(!this.killed){
			
		// 	this.mesh.scale.set( 1/OBJ.size, 1/OBJ.size, 1/OBJ.size );
			
		// 	for(let i = 0; i<OBJ.envObjs.length; i++){
		// 		const p1 = new Vector3();
		// 		OBJ.envObjs[i].mesh.getWorldPosition(p1);
		// 		const p2 = new Vector3(); 
		// 		this.mesh.getWorldPosition(p2);
		// 		const dist = p1.distanceTo(p2);
				
		// 		if(dist <3){
		// 			if(this.rand < OBJ.envObjs[i].rand){
						
		// 				this.kill();
						
		// 			}
		// 		}
		// 	}
		// }
	}
	
	kill(){
		if(!this.killed){
			appGlobal.globalHelperFunctions.tearDownObject(this.meshHolder);
			this.holder.remove(this.meshHolder);
			appGlobal.scene.remove(this.holder);
			this.killed = true;
		}
	}
	
}

export { EnvironmentObject };
