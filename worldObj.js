class worldObj {
	constructor(collider,index){
		this.collider=collider;
		this.id=worldObjId;
		this.index=index

		worldObs.push(this)
		worldObjId++

		Object.defineProperty(this, 'onScreen', {
  		get() {
    		return floor(this.screenPos.x+this.width) >0 &&
           		 floor(this.width) <= windowWidth
  		},
 		});

  	if(this.collider){
    	colliders.push(this)
  	}
  }
 	
	collided=false;

}

class Platform extends worldObj{

	width=300;
	height=100;

	worldPos = createVector(this.index*this.width*1.1+100,bg.floorY-200*this.index)
	screenPos= createVector(this.worldPos.x+gameCam.transform,this.worldPos.y);
	center=createVector(this.worldPos.x+this.width/2,this.worldPos.y+this.height/2)


	color=[120,100,100,1]

	update(){
	this.screenPos.x=this.worldPos.x+gameCam.transform;
	this.screenPos.y=this.worldPos.y;
	this.center.x=this.worldPos.x+this.width/2
	this.center.y=this.worldPos.y+this.height/2;


  	};

	display(){
		if(this.screenPos.x < -this.width){this.worldPos.x+=2000}
		if(this.screenPos.x > windowWidth){this.worldPos.x-=2000}
		push();
		fill(this.color)
    	noStroke();
    	rect(this.screenPos.x, this.screenPos.y, this.width, this.height);
    pop();
    	
	};
}

class Coin extends worldObj{

	worldPos = createVector(0,0);
	screenPos = createVector(0,0);
	width=15
	drawwidth=this.width
	height=this.width*1.6
	color=[53,78,93]
	stroke=[[51,82,74],2]
	center=createVector(this.worldPos.x+this.width/2,this.worldPos.y+this.height/2)


	update(){
		this.center.set(this.worldPos.x+this.width/2,this.worldPos.y+this.height/2)
		if(debug){
			this.drawwidth=this.width
			}
		else{
		this.drawwidth = this.width*abs(cos(frameCount/30))
		}
		this.screenPos.x=this.worldPos.x+gameCam.transform+this.width/2
		this.screenPos.y=this.worldPos.y+this.height/2
	}

	display(){
		if(this.onScreen){
			push();
			stroke(0)
			strokeWeight(2)
	 		fill(this.color)
			stroke(this.stroke[0])
			strokeWeight(this.stroke[1])
			ellipse(this.screenPos.x,this.screenPos.y,this.drawwidth,this.height)
			line(this.screenPos.x,this.screenPos.y-floor(this.height*.2),this.screenPos.x,this.screenPos.y+floor(this.height*.2))
			pop();
		}
	}
}

class Baddie extends worldObj{
}