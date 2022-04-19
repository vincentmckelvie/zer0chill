import {
  Object3D,
  MeshStandardMaterial,
  Mesh,
  Scene,
  Color
} from 'three';

//import { Swatches } from './Swatches.js';

class CharacterSkin {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
    const self = this;
    
    //this.swatches = new Swatches();
    //this.isSwatch = OBJ.isSwatch;
    
    // if(OBJ.fps){
    //   this.meshes = OBJ.fps
    // }
    // if(OBJ.body){
    //   this.meshes = OBJ.body;
    // }
    
    this.meshes = OBJ.meshes;

    //console.log(this.swatchObj);
    //if(this.isSwatch){
      // this.swatchObj = this.swatches.getSwatchByName(OBJ.character, OBJ.name);
      // for(let i = 0; i<this.meshes.length; i++){
      //   this.meshes[i].traverse( function ( obj ) {
      //     if(obj.isMesh || obj.isSkinnedMesh){
      //       if(obj.materials !=null ){
      //         for(let i = 0; i<obj.materials.length; i++){
      //           const newColor = self.checkIfMaterialMatchesSwatch(obj.materials[i].name, self.swatchObj.array); 
      //           if( newColor != null ){
      //             obj.materials[i].color.set(newColor.color);
      //             obj.materials[i].emissive.set(newColor.emissive);
      //           }
      //         }
      //       }
      //       if(obj.material !=null ){
      //         const newColor = self.checkIfMaterialMatchesSwatch(obj.material.name, self.swatchObj.array);
      //         //console.log(newColor) 
      //         if( newColor != null ){
      //           obj.material.color.set("#"+newColor.color);
      //           obj.material.emissive.set("#"+newColor.emissive);
      //           //obj.material.needsUpdate = true;
      //         }
      //       }
      //     }
      //   });
      // }
    //}
  }

  changeSwatch(OBJ){
    //this.swatchObj = OBJ.swatches.getSwatchByName(OBJ.character, OBJ.name);
    const swatchObj = OBJ.swatchObj;
    for(let i = 0; i<this.meshes.length; i++){
      this.meshes[i].traverse( function ( obj ) {
        if(obj.isMesh || obj.isSkinnedMesh){
          // if(obj.materials !=null ){
          //   for(let i = 0; i<obj.materials.length; i++){
          //     const newColor = self.checkIfMaterialMatchesSwatch(obj.materials[i].name, self.swatchObj.array); 
          //     if( newColor != null ){
          //       obj.materials[i].color.set(newColor.color);
          //       obj.materials[i].emissive.set(newColor.emissive);
          //     }
          //   }
          // }
          if(obj.material !=null ){
            const newColor = self.checkIfMaterialMatchesSwatch(obj.material.name, swatchObj.array);
            //console.log(newColor) 
            if( newColor != null ){
              obj.material.color.set("#"+newColor.color);
              obj.material.emissive.set("#"+newColor.emissive);
              //obj.material.needsUpdate = true;
            }
          }
        }
      });
    }
  }

  checkIfMaterialMatchesSwatch(matName, swatches){

    for(let i = 0; i<swatches.length; i++){
      if(matName == swatches[i].ogName){
        return {color:swatches[i].newColor, emissive:swatches[i].newEmissive};
      }  
    }
    return null;
     
  }

}

export { CharacterSkin };