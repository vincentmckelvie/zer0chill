require('dotenv').config();
const weaponStats = require('./WeaponStats.js');
let express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http,{
  cors: {
    origin: "*"
  }
});

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

const socketRooms = [
  "room1",
  "room2",
  "room3",
  "room4",
  "room5",
  "room6",
];

class Game{
  constructor(OBJ){
    this.index = OBJ.index;
    this.maxPlayers = 8;
    this.currPlayers = 0;
    this.playersArray = [];
    this.state = "pregame";
    this.roomName = OBJ.room;
    this.seed = Math.floor( Math.random()*10000 );
    this.itemArr = [];
    this.time = 0;

    this.endGameLength = 2;
    this.gameLength = 200;
    //this.gameLength = 20;
    this.timerInterval;
    this.currentWinners = [];

    // for(let i = 0; i < 10+Math.random()*10; i ++){
    //   this.itemArr.push(new Item({index:i}));
    // }

    this.timerInterval = null;
    const self = this;
    self.resetGame();
  }

  update(){
    
    switch(this.state){
      case "pregame":
      case "game":
        this.updateGameLoop();
      break; 
      case "postgame":
      break;
    }
  }

  updateGameLoop(){
    this.currPlayers = this.playersArray.length;
    io.to(this.roomName).emit('updateAll', {players:this.playersArray});
  }

  getWinners(){
    let currMaxKills = 0;
    let winnersArr = [];
    for(let i = 0; i<this.playersArray.length; i++){
      if(this.playersArray[i].killCount > currMaxKills){
        currMaxKills = this.playersArray[i].killCount;
        winnersArr = [];
        winnersArr.push(this.playersArray[i].id);
      }else if(this.playersArray[i].killCount==currMaxKills){
        winnersArr.push( this.playersArray[i].id);
      }
    }
    return winnersArr;
  }

  getEndGamePackage(){
    const pkg = [];
    for(let i = 0; i<this.playersArray.length; i++){
      pkg.push({id:this.playersArray[i].id, xpAdd:this.playersArray[i].xpAdd, deathCount:this.playersArray[i].deathCount, killCount:this.playersArray[i].killCount})
    }
    return pkg;
  }

  getPlayerAmount(){
    let amt = 0;
    for(let i = 0; i < this.playersArray.length; i++){
      if(this.playersArray[i].playing){
        amt++;
      }
    }
    return amt;
  }

  resetGame(){
    
    this.state = "pregame";
    this.seed = Math.floor( Math.random()*10000 );
    this.itemArr = [];
    for(let i = 0; i < 10+Math.random()*10; i ++){
      this.itemArr.push(new Item({index:i}));
    }
    const data = {seed:this.seed, state:this.state};
    io.to(this.roomName).emit('resetGame', data);
    
    if(this.timerInterval!=null){
      clearInterval(this.timerInterval);
    }
    const self = this;
    setTimeout(function(){
      self.startGame();
    }, 100);

  }

  startGame(){
   
    this.state = "game";
    const d = {state:this.state};
    io.to(this.roomName).emit('startGame', d);
    
    if(this.timerInterval!=null){
      clearInterval(this.timerInterval);
    }
    
    this.time = this.gameLength;
    const self = this;
    this.timerInterval = setInterval(function(){
      self.time--;
      io.to(self.roomName).emit('serverTimer', {serverTime:self.time, info:getJustGameInfo() }); 
      if(self.index==0){
        io.to("join").emit('serverTimer', {serverTime:0, info:getJustGameInfo()});   
      }
      if(self.time<=0){
        self.endGame();
      }
    },1000);
  }

  endGame(){
    //console.log("end game");
    this.state = "postgame";
    this.itemArr = [];
    this.currentWinners = this.getWinners();
    const data = {state:this.state, winners:this.currentWinners, endGamePackage: this.getEndGamePackage() };
    io.to(this.roomName).emit('endGame', data);
    for(let i = 0; i < this.playersArray.length; i++){
      this.playersArray[i].stopPlaying();
      this.playersArray[i].resetVars();
      
    }

    if(this.timerInterval!=null){
      clearInterval(this.timerInterval);
    }
    
    this.time = this.endGameLength;
    const self = this;
    this.timerInterval = setInterval(function(){
      self.time--;
      io.to(self.roomName).emit('serverTimer', {serverTime:self.time, info:getJustGameInfo()}); 
      if(self.index==0){
        io.to("join").emit('serverTimer', {serverTime:0, info:getJustGameInfo()});   
      }
      if(self.time<=0){
        self.resetGame();
      }
    },5000);
    
  }

  getInitPackage(){
    return {
      seed : this.seed,
      state : this.state,
      itemArr : this.itemArr,
      roomName : this.roomName
    }
  }
}

class Item{
  constructor(OBJ){
    this.killed = false;
    this.index = OBJ.index;
  }
  kill(){
    this.killed = true;
  }
}

class Player{
  constructor(OBJ){
    //ALWAYS SET DEFAULTS
    this.game = OBJ.game;
    this.id = OBJ.id;
    this.name = "bot"+Date.now()+"";
    this.killed = false;
    this.health = 100;
    this.position = {x:0, y:0, z:0};
    this.rotation = {_x:0, _y:0, _z:0, _w:0};
    this.playing = false;
    this.killCount = 0;
    this.animationObject = {
      yAxis:0, 
      xAxis:0, 
      jump:true,
      boost:false,
      adsing:false
    };
    this.meshName = "assault";
    this.camRotation = 0;
    this.movement = "boost";
    this.xpAdd = 0;
    this.deathCount = 0;
    this.skin = "default"
  }
  
  update(OBJ){
    //this.playing = true;
    this.position = OBJ.pos;
    this.rotation = OBJ.rot;
    this.animationObject = OBJ.animationObject;
    this.camRotation = OBJ.camRotation;
    //console.log(this.camRotation)
    //this.crouching = OBJ.crouching;
  }

  kill(){
    this.killed = true;
  }

  doDamage(OBJ){//player does damage to this player
    let fnlDamage = this.getDmgFromName(OBJ.name);
    if(OBJ.headShot){
      fnlDamage *= 1.51;
    }
    this.health -= Math.ceil(fnlDamage);
    if(this.health <= 0){
      this.deathCount++;
      this.playing = false;
    }
  }

  didDamage(OBJ){//did damage to another player
    let fnlDamage = this.getDmgFromName(OBJ.name);
    if(OBJ.headShot){
      fnlDamage *= 1.51;
    }
    this.xpAdd += Math.ceil(fnlDamage*.5);
    //this.totalDamage += Math.ceil(fnlDamage);
  }

  getDmgFromName(name){
    for(let i = 0; i<weaponStats.WeaponStats.length; i++){
      if(name == weaponStats.WeaponStats[i].name){
        return weaponStats.WeaponStats[i].damage;
      }
    }
    return 0;
  }

  didGetKill(OBJ){
    this.killCount++;
    this.xpAdd += 50;
  }

  heal(){
    this.xpAdd += 10;
    this.health += 50;
    if(this.health > 100)
      this.health = 100;
  }
  startPlaying(OBJ){
    this.meshName = OBJ.meshName;
    this.movement = OBJ.movement;
    this.name = OBJ.name;
    this.skin = OBJ.skin;
    this.playing = true;
    this.health = 100;
  }
  stopPlaying(){
    this.playing = false;
  }
  resetVars(){
    this.xpAdd = 0;
    this.killCount = 0;
    this.deathCount = 0;
  }
  
}


const games = [];
for(let i =0; i<socketRooms.length; i++){
  games.push(new Game({room:socketRooms[i], index:i}));
}

setInterval(function(){
  for(let i = 0; i<games.length; i++){
    games[i].update();
  }
},1000/20);


io.on('connection', (socket) => {
    
    socket.on('disconnect', () => {
    
      const p = getPlayerById(socket.id);
      if(p!=null){
        io.to(p.player.game).emit('playerDisconnect', socket.id);
      }
      removePlayerFromArray(socket.id);
    
    });

    socket.on('sendPlayerData', (data)=> {
      const p = getPlayerById(data.id);
      if(p!=null){
        p.player.update(data);
      }
    });

    socket.on('startPlaying', (data)=> {
      const p = getPlayerById(data.id);
      if(p != null){
        p.player.startPlaying({meshName:data.meshName, name:data.name, movement:data.movement, skin:data.skin});
      }
    });

    socket.on('shoot', (data)=> {
      const p = getPlayerById(data.id);
        if(p != null){
          io.to(p.player.game).emit('serverShoot', data);
        }
    });
    
    socket.on('doDamage', (data)=> {

      const p = getPlayerById(data.id);
      const fromDamage = getPlayerById(data.fromDamageId);
      
      if(p != null){
        
        p.player.doDamage(data);
        data.health = p.player.health;
        
        if(fromDamage != null){
          fromDamage.player.didDamage(data);
        }
        
        if(p.player.health<=0){
          if(fromDamage != null){
            fromDamage.player.didGetKill(data);
          }
          io.to(p.player.game).emit('serverUpdateDead', data);
        }
        io.to(p.player.game).emit('serverDoDamage', data);
      }
      
    });
    
    socket.on("clientDoTestShooting", (data)=>{
      const p = getPlayerById(data.id);
      if(p != null){
          console.log("client do test shooting");
          io.to(p.player.game).emit('serverDoTestShooting', data);
      }
    });

    socket.on('abilityVisual', (data)=> {
      const p = getPlayerById(data.id);
      if(p != null){
          io.to(p.player.game).emit('serverAbilityVisual', data);
      }
    });

    socket.on('abilityExtras', (data)=> {
      const p = getPlayerById(data.id);
      if(p != null){
          io.to(p.player.game).emit('serverAbilityExtras', data);
      }
    });


    socket.on('getItem', (data)=> {
      const p = getPlayerById(data.id);
      if(p != null && p.game.itemArr[data.index] != null){
        if(!p.game.itemArr[data.index].killed){
          //const game = getGameByName(p.player.room);
          p.player.heal();
          data.health = p.player.health;
          data.killed = p.game.itemArr[data.index].killed;
          io.to(p.player.game).emit('serverKillItem', data);
          p.game.itemArr[data.index].kill();
        }
        
      }
    });

    socket.on('switchRooms', (data)=> {
      
      const p = getPlayerById(data.id);
      if(p != null){
        
        io.to(p.player.game).emit('playerDisconnect', socket.id);
        removePlayerFromArray(socket.id);
        
        const obj = {data:data, socket:socket};
        joinGame(obj, false);

      }else{ // first join
        const obj = {data:data, socket:socket};
        joinGame(obj, true)
      }

    });

    socket.join("join");
    const game = getAvailableGameInfo();
    io.to("join").emit('serverInitialPing', {id:socket.id, gameToJoin:game.name, info:game.infoArray});

});

function joinGame(OBJ, firstJoin){
  OBJ.socket.leave(OBJ.data.gameToLeave);
  const game = getGameByName(OBJ.data.gameToJoin);

  if( game !=null && game.currPlayers < game.maxPlayers ){
    const send = game.getInitPackage();
    send.id =  OBJ.socket.id;
   
    OBJ.socket.join(OBJ.data.gameToJoin);
    const player = new Player({id:OBJ.socket.id, game:OBJ.data.gameToJoin});
    game.playersArray.push(player); 
    
    send.user = player.name;

    if(firstJoin){
      io.to(game.roomName).emit('serverInitJoinGame', send);
    }else{
      io.to(game.roomName).emit('serverSwitchGames', send);
    }

  }else{

    OBJ.socket.join("join");
    io.to("join").emit('serverCantJoinGame', {id:OBJ.socket.id});

  }
}

function getAvailableGameInfo(){
  const arr = [];
  const infoArr = [];
  for(let i = 0; i<games.length; i++){
    infoArr.push({name:games[i].roomName, currPlayerAmount:games[i].currPlayers})
    if(games[i].currPlayers < games[i].maxPlayers){
      arr.push([games[i], games[i].currPlayers]);
    }
  }
  if(arr.length > 0){
    arr.sort(function(a, b) {
        return a[1] - b[1];
    });
    return {name:arr[arr.length-1][0].roomName, infoArray:infoArr};
  }else{
    return {name:"join", infoArray:infoArr};
  }
}

function getJustGameInfo(){
  const infoArr = [];
  for(let i = 0; i<games.length; i++){
    infoArr.push({name:games[i].roomName, currPlayerAmount:games[i].currPlayers});
  }
  return infoArr;
}


function getGameByName(name){
  for(let i = 0; i<games.length; i++){
    if(games[i].roomName == name){
      return games[i];
    }
  }
  return null;
}

function removePlayerFromArray(id){
  const p = getPlayerById(id);
  if(p !=null ){
    p.game.playersArray.splice(p.index, 1);
  }
}

function getPlayerById(id){
  for(let i = 0; i < games.length; i++){
    for(let k = 0; k < games[i].playersArray.length; k++){
      if(games[i].playersArray[k].id == id){
        return {player:games[i].playersArray[k], index:k, game:games[i]};
      }
    }
  }
}

http.listen(process.env.PORT||3000 , () => {
  console.log('listening on *:3000');
});
