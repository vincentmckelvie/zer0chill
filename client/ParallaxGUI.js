
class ParallaxGUI {

	constructor() {

		const self = this;
		this.targX = 0;
		this.targY = 0;
		this.x = 0; 
		this.y = 0;
		
	}
	updateMouseMove(event){
		this.targX = ((window.innerWidth/2-event.pageX)  *.0002 )*-1;
		this.targY = ((window.innerHeight/2-event.pageY) *.0002)*-1;
	}

	update(){
		this.x += (this.targX-this.x)*(appGlobal.deltaTime*30);
		this.y += (this.targY-this.y)*(appGlobal.deltaTime*30);
		this.parallaxIt("title", 160);
		this.parallaxIt("planet-switching-select-title", 160);
		this.parallaxIt("class-select-title", 100);
		this.parallaxIt("instructions", 60);
		this.parallaxIt("all-classes", 160);
		this.parallaxIt("player-select-character", 160);
		this.parallaxIt("movement-select-holder", 120);
		this.parallaxIt("play-holder", 60);
		this.parallaxIt("player-skins", 60);
	}

	kill(){
		
	}


	parallaxIt(target, movement) {
		document.getElementById(target).style.transform = "translate("+this.x*movement+"px, "+this.y*movement+"px)";		
	}
	
};

	
	


export { ParallaxGUI };


