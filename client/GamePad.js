class GamePad {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
    this.canDiscoverGamePad = true;
    this.initedSettings = false;
  }

  update(){
  
    if(this.canDiscoverGamePad){
      this.updateGamePad();
    }
    
  }

  updateGamePad(){
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads)
      return;
    
    const gp = gamepads[0];
    if(gp!=null){
       if(!this.initedSettings){
        appGlobal.settings.updateGamePad(true);
        this.initedSettings = true;
      }
      if(appGlobal.localPlayer != null){
        appGlobal.localPlayer.handleGamePad({

          xaxis:this.parseAxes((gp.axes[0])*1), 
          yaxis:this.parseAxes((gp.axes[1])*1), 
          jump:this.buttonPressed(gp.buttons[0]),
          boost:this.buttonPressed(gp.buttons[4]),
          reload:this.buttonPressed(gp.buttons[2]),
          mx:this.parseAxes((gp.axes[2])*1),
          my:this.parseAxes((gp.axes[3])*1),
          ads:this.buttonPressed(gp.buttons[6]),
          shoot:this.buttonPressed(gp.buttons[7]),
          ability1:this.buttonPressed(gp.buttons[3]),
          ability2:this.buttonPressed(gp.buttons[1]),
          w:this.axesToKeyPress(gp.axes[1], false),
          s:this.axesToKeyPress(gp.axes[1], true),
          a:this.axesToKeyPress(gp.axes[0], false),
          d:this.axesToKeyPress(gp.axes[0], true),
        })
      }else{
        if(this.buttonPressed(gp.buttons[0])){
          appGlobal.globalHelperFunctions.handleInitPlaying();  
        }
      }
      //console.log(this.b)
    }

  }

  parseAxes(val){
    if(Math.abs(val)<.2)
      return 0;
    else
      return val;
  }

  axesToKeyPress(val, pos){
    if(pos){
      if(val>.4)
        return true;
      else
        return false;  
    }else{
      if(val<-.4)
        return true;
      else
        return false;
    }
  }

  buttonPressed(b){

    if (typeof(b) == "object") {
      return b.pressed;
    }
    return false;

  }

  // gamepadHandler(event, connecting) {
  //   //const gamepad = event.gamepad;
  //   //this.gpIndex = gamepad.index;
  //   //if (connecting) {
  //   //  this.gamepads[this.gpIndex] = gamepad;
  //   //} else {
  //   //  delete gamepads[gamepad.index];
  //   //}
  //   //this.gamePad = navigator.getGamepads()[0];
  // }

}

export { GamePad };