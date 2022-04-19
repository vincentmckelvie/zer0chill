import {
  Object3D,
  MeshStandardMaterial,
  MeshNormalMaterial,
  MeshBasicMaterial,
  Mesh,
  Scene,
  Color,
  DoubleSide
} from 'three';
import { Skin } from './Skin.js';
import { Swatches } from './Swatches.js';

class SkinsHandler {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
    const self = this;
    this.swatches = new Swatches({});
    this.skin = new Skin({});
    this.doms = [];
    this.meshes = [];
    this.parentDom = document.getElementById("player-skins");
    let c = "skins-non-interactive";
    //if(window.logged.in){
      c = "skins-interactive";
    //}
    this.currentSkin = "default";
    this.parentDom.className = c;

    for(let i = 0; i<this.swatches.arr.length; i++){
        this.doms.push(new SkinsDom({
          index:i, 
          character:this.swatches.arr[i].name, 
          arr:this.swatches.arr[i].swatches, 
          logged:window.logged.in, 
          parent:this.parentDom
        }))     
    }

  }

  changeSwatch(OBJ){
    this.currentSkin = OBJ.swatch;
    this.changeSwatchOnMesh( this.getSendObj(OBJ), OBJ.swatch );
  }

  addMeshes(OBJ){
    this.meshes.push(OBJ);
  }

  getCurrentSkinOnCharacter(character){
    for(let i = 0; i < this.doms.length; i++){
      if(character == this.doms[i].character){
        for(let k = 0; k< this.doms[i].buttons.length; k++){
          if(this.doms[i].buttons[k].active)
            return this.doms[i].buttons[k].swatch;  
        }
        
      }
    }
  }

  getSwatchArrayFromSkinName(character, name){
    for(let i = 0; i < this.doms.length; i++){
      if(character == this.doms[i].character){
        this.swatches
      }
    }
  }

  

  getSendObj(OBJ){
    for(let i = 0;i<this.meshes.length; i++){
      if(this.meshes[i].name == OBJ.character)
        return this.meshes[i];
    }
  }

  playerSelectSwitchCharacter(OBJ){
    const dom = this.getDomFromName(OBJ.class);
    if(dom!=null){
      this.hideAllParentDoms();
      dom.toggleVis(true);
    }
  }

  hideAllParentDoms(){
    for(let i =0;i<this.doms.length;i++){
      this.doms[i].toggleVis(false);
    }
  }
  getDomFromName(className){
    for(let i = 0; i < this.doms.length; i++){
      if(className == this.doms[i].character){
        return this.doms[i];
      }
    }
    return null;
  }
  
  changeSwatchOnMesh(OBJ, swatch){
    //this.swatchObj = OBJ.swatches.getSwatchByName(OBJ.character, OBJ.name);
    const self = this;

    const swatchObj = this.swatches.getSwatchByName(OBJ.name, swatch);

    for(let i = 0; i<OBJ.meshes.length; i++){
      OBJ.meshes[i].traverse( function ( obj ) {
        if(obj.isMesh || obj.isSkinnedMesh){
          switch(swatch){
            case "normal":

              if(obj.material.name != "directional-boost" && !obj.material.name.includes("blast") && obj.dontUpdateMaterial==null){
                const mat = new MeshNormalMaterial({
                    side:obj.material.side, 
                    name:obj.material.name
                });
                
                obj.material.dispose();
                obj.material = mat;
                obj.material.roughness = obj.material.roughness;
                obj.material.metalness = obj.material.metalness;

              }
            break;
            default:
              if(obj.material !=null ){
                const newColor = self.swatches.checkIfMaterialMatchesSwatch(obj.material, swatchObj.array);
                if( newColor != null ){
                  
                  const c = new Color().set("#"+newColor.color);
                  const e = new Color().set("#"+newColor.emissive);
                  let roughness = .5;
                  let metalness = 0;
                  if(OBJ.name=="launcher"){
                    metalness = 1;
                  }
                  if(OBJ.name =="sniper"){
                    roughness = 0.05;
                  }
                  const mat = new MeshStandardMaterial({
                      side:obj.material.side, 
                      color:c, 
                      emissive:e, 
                      metalness:metalness,
                      roughness:roughness,
                      name:obj.material.name
                  });

                  if(swatch=="wireframe"){
                    mat.wireframe=true;
                  }

                  obj.material.dispose();
                  obj.material = mat;
                  obj.material.needsUpdate = true;
                }
              }
            break;
          }
          
        }

      });

    }
  }

}

export { SkinsHandler };


class SkinsDom{

  constructor(OBJ){
    const self = this;
    this.buttons = [];
    this.parent = document.createElement("div");
    if(OBJ.index != 0){
      this.parent.style.display = "none";
    }

    OBJ.parent.append(this.parent);
    
    this.character = OBJ.character;

    for(let i = 0;i<OBJ.arr.length; i++){
      const btn = new SkinButton(OBJ, i, self, this.parent);
      this.buttons.push(btn);
      //}
    }
    
  }
  toggleVis(show){
    if(!show){
      this.parent.style.display = "none";
    }else{
      this.parent.style.display = "block";
    }
  }
  makeAllButtonsNonActive(){
    for(let i = 0; i<this.buttons.length; i++){
      this.buttons[i].active = false;
      this.buttons[i].btn.className = "swatch-btn";
    }
  }

}

class SkinButton{
  constructor(OBJ, INDEX, PARENT, DOM){
      this.character = OBJ.character
      this.parent = PARENT;
      const self = this;

      this.active = false;
      if(INDEX == 0)
        this.active = true;

      this.index = INDEX;
      this.btn = document.createElement("div");
      this.btn.className = "swatch-btn";
      //btn.style.backgroundColor = OBJ.arr[i].icon;
      DOM.append(this.btn);
      this.swatch = OBJ.arr[this.index].name;
      
      if(this.index == 0){
        this.btn.className = "swatch-btn-active"
      }
      this.btn.style.backgroundImage = "url(/assets/swatches/"+this.character+"/"+OBJ.arr[this.index].icon+".jpg)";
      //if(OBJ.logged){
        
      this.btn.addEventListener("click", function(){
        appGlobal.skinsHandler.changeSwatch({ swatch:self.swatch, character:self.character });
        self.parent.makeAllButtonsNonActive();
        self.active = true; 
        self.btn.className = "swatch-btn-active";
      });
  }

}