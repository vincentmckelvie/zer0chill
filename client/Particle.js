import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	BoxGeometry,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	Color
} from 'three';


class Particle {
	
	constructor(OBJ) {

		this.mesh;   
		let geometry;
	    let material;

	    switch(OBJ.mesh){
	        case "box":
	            geometry = new BoxGeometry( 1, 1, 1 );
	            material = new MeshStandardMaterial( {color:OBJ.col} );
	            this.mesh = new Mesh( geometry, material );
	        break;
	        case "sphere":
	            geometry = new SphereGeometry( 2, 8, 8 );
	            material = new MeshStandardMaterial( {color:OBJ.col} );
	            //material.color = new THREE.Color( 1, 0, 0 );
	            this.mesh = new Mesh( geometry, material );
	        break;
	    }
	    
	    appGlobal.scene.add(this.mesh);
	   
	    this.pos = new Vector3().copy(OBJ.pos);
	    const rndPos = new Vector3();
	    rndPos.x = -.5+Math.random();//(-OBJ.rndPos*.5)+(Math.random()*OBJ.rndPos);
	    rndPos.y = -.5+Math.random();//(-OBJ.rndPos*.5)+(Math.random()*OBJ.rndPos);
	    rndPos.z = -.5+Math.random();//(-OBJ.rndPos*.5)+(Math.random()*OBJ.rndPos);
	    rndPos.multiplyScalar(OBJ.rndPos);
	    this.mesh.position.copy(this.pos).add(rndPos);
	    
	    const rndRot = new Vector3();
	    rndRot.x = (-OBJ.rndRot*.5)+(Math.random()*OBJ.rndRot);
	    rndRot.y = (-OBJ.rndRot*.5)+(Math.random()*OBJ.rndRot);
	    rndRot.z = (-OBJ.rndRot*.5)+(Math.random()*OBJ.rndRot);
	    
	    const rot = new Vector3().add(rndRot);
	    this.mesh.rotation.set(rot.x, rot.y, rot.z);

	    this.scl = new Vector3();
	    var rndScl = (-OBJ.rndScl*.5)+(Math.random()*OBJ.rndScl);
	    this.scl.x = OBJ.scl+rndScl;
	    this.scl.y = OBJ.scl+rndScl;
	    this.scl.z = OBJ.scl+rndScl;

	    this.mesh.scale.copy(this.scl);
	    // this.mesh.scale.copy(this.scl);//.x;
	    // //this.mesh.scale.y = this.scl.y;
	    // //this.mesh.scale.z = this.scl.z;
	    
	    const rr = OBJ.velPosRnd;
		const rx = ((-rr*.5)+Math.random()*rr);
		const ry = ((-rr*.5)+Math.random()*rr);
		const rz = ((-rr*.5)+Math.random()*rr);
		const rnd = new Vector3().set( rx,ry,rz );
		//return new Vector3().copy(this.obj.pos).sub(new Vector3()).normalize().add(rnd).multiplyScalar(this.obj.velPosScale);
		
		const vel = new Vector3().copy(this.mesh.position).sub(new Vector3()).normalize().add(rnd).multiplyScalar(OBJ.velPosScale)
			
	    this.velPos = new Vector3().copy(vel);//, OBJ.velPos.y, OBJ.velPos.z);

	    const velRotRnd = new Vector3();
	    velRotRnd.x = ((-OBJ.velRot*.5)+Math.random()*OBJ.velRot);
	    velRotRnd.y = ((-OBJ.velRot*.5)+Math.random()*OBJ.velRot);
	    velRotRnd.z = ((-OBJ.velRot*.5)+Math.random()*OBJ.velRot);
	    this.velRot = new Vector3().copy(velRotRnd);//.x, OBJ.velRot.y, OBJ.velRot.z);
	    this.velScl = new Vector3().set(OBJ.velScl,OBJ.velScl,OBJ.velScl);//.x, OBJ.velScl.y, OBJ.velScl.z);
	  	this.shoulLookAt = OBJ.lookAt;
	  	this.lookAtScaleMult = OBJ.lookAtLength;

		this.killed = false;
	    const self = this;
	    
		setTimeout(function(){
			self.kill();
		}, OBJ.killTimeout)
		
	}
	
	update(){
		if(!this.killed){
			
			this.mesh.position.addScaledVector( this.velPos, window.appGlobal.deltaTime );
			
			if(!this.shoulLookAt){
				this.mesh.rotateX( this.velRot.x );
				this.mesh.rotateY( this.velRot.y );
				this.mesh.rotateZ( this.velRot.z );
			}

			this.scl.addScaledVector( this.velScl, window.appGlobal.deltaTime );

			if(this.scl.x<0.001){
			    this.scl.x = 0.001;
			}
			if(this.scl.y<0.001){
			    this.scl.y = 0.001;
			}
			if(this.scl.z<0.001){
			    this.scl.z = 0.001;
			}
			
			this.mesh.scale.copy(this.scl);

			if(this.shoulLookAt){
				this.mesh.lookAt(this.pos);
				//this.mesh.scale.z = this.scl.y*this.lookAtScaleMult;
				this.mesh.scale.z = this.scl.y*this.lookAtScaleMult;
			}
			
		}
	}

	kill(){
		if(!this.killed){
			this.killed = true;
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			appGlobal.scene.remove(this.mesh);
		}
	}

	

}

export { Particle };
