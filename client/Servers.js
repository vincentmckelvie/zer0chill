class Servers {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
    const self = this;
    //self.killCookies();
    //this.serversHolder = document.getElementById("servers");
    //console.log(this.serversHolder)
    this.maxPlayers = 8;
    this.domArray = [];
    
    for(let i = 0; i<OBJ.info.length; i++){
      appGlobal.socketRooms.push(OBJ.info[i].name);
      const dom = document.createElement("div");
      dom.className = "servers-sub" ;
      
      const name = document.createElement("div");
      name.className = "servers-left";
      name.innerHTML = OBJ.info[i].name;
      

      const amt = document.createElement("div");
      amt.className = "servers-right";
      amt.innerHTML = OBJ.info[i].currPlayerAmount +" / "+this.maxPlayers ;

      const clear = document.createElement("div");
      clear.className = "clear";
      
      dom.append(name);
      dom.append(amt);
      dom.append(clear);
      document.getElementById("servers-center").prepend(dom);
      dom.addEventListener("click",function(){
        socket.emit("switchRooms", {id:socket.id, gameToJoin:OBJ.info[i].name, gameToLeave:appGlobal.roomName});
        document.getElementById("servers").style.display = "none";
      })
      this.domArray.push({dom:dom, amtDom:amt, nameDom:name, name:OBJ.info[i].name});
    }
    document.getElementById("servers-btn").addEventListener("click", function (){
      document.getElementById("servers").style.display = "block";
    });
    document.getElementById("close-servers-btn").addEventListener("click", function (){
      document.getElementById("servers").style.display = "none";
    });
    
  }

  updateServerInfo(OBJ){
    for(let i = 0; i<this.domArray.length; i++){ 
       this.domArray[i].dom.className = "servers-sub";
    }
    for(let i = 0; i<OBJ.info.length; i++){
      const domToUpdate = this.getAmountDomFromName( OBJ.info[i].name );
      domToUpdate.amt.innerHTML =  OBJ.info[i].currPlayerAmount +" / "+this.maxPlayers;
      if(OBJ.info[i].name == appGlobal.roomName){
        domToUpdate.dom.className = "server-active";
      }
    }  

      
  }

  getAmountDomFromName(name){
    for(let i = 0; i<this.domArray.length; i++){
      if(this.domArray[i].name == name){
        return {amt:this.domArray[i].amtDom, dom:this.domArray[i].dom};
      }
    }
  }

}

export { Servers };