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


class ParticleExtra {
	//{mesh:"sphere",pos:new Vector3(), col:new Color().setHSL(0,1,.5), ani:gsap.to() }
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
	            geometry = new SphereGeometry( 2, 12, 12 );
	            material = new MeshStandardMaterial( {color:OBJ.col} );
	            //material.color = new THREE.Color( 1, 0, 0 );
	            this.mesh = new Mesh( geometry, material );
	        break;
	    }
	    
	    appGlobal.scene.add(this.mesh);
	   
	    this.pos = new Vector3().copy(OBJ.pos);
	   
	    this.mesh.position.copy(this.pos);
	    
	    const rndRot = new Vector3();
	    rndRot.x = (-OBJ.rndRot*.5)+(Math.random()*OBJ.rndRot);
	    rndRot.y = (-OBJ.rndRot*.5)+(Math.random()*OBJ.rndRot);
	    rndRot.z = (-OBJ.rndRot*.5)+(Math.random()*OBJ.rndRot);
	    
	    const rot = new Vector3().add(rndRot);
	    this.mesh.rotation.set(rot.x, rot.y, rot.z);

	    this.ani;// = OBJ.ani;
	   	
		this.killed = false;
	 //  const self = this;
		// setTimeout(function(){
		// 	self.kill();
		// }, OBJ.killTimeout)
		
	}
	
	update(){
		// if(!this.killed){
			
			
			
		// }
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

export { ParticleExtra };
