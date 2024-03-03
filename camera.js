"use strict"
function GameCam(target){

this.target = target ? target : undefined
this.position = createVector(width/2,height/2,1)
this.transform = 0;
}

GameCam.prototype.update = function(){

	//lock player smoothly to camera boundary
	//if out of camera-bounds, add difference past boundary to cameraTransform
	let wouldBePosition = this.target.worldPos.x+this.transform
	let wbp_L = wouldBePosition-this.target.r;
	let wbp_R = wouldBePosition+this.target.r;
	
	if(wbp_L < bg.leftEdge )
		this.transform+= bg.leftEdge-wbp_L
	if(wbp_R > bg.rightEdge)
		this.transform+= bg.rightEdge-wbp_R
}


GameCam.prototype.setTarget = function(target){
	this.target = target;
	//this.scrollTo(target);
}


GameCam.prototype.scrollTo = function(value){
	throw new Error('Not implemented')
//	this.transform = lerp(this.transform,value,.05)
}



//debug methods
GameCam.prototype.drawScreenCenter = function(){
	push()
	stroke(255)
	strokeWeight(1)

	line(this.position.x-10,this.position.y,this.position.x+10,this.position.y)
	line(this.position.x,this.position.y-10,this.position.x,this.position.y+10)

	line(width*.33,height*.25,width*.33,height*.75)
	line(width*.66,height*.25,width*.66,height*.75)
	pop()
}

GameCam.prototype.drawBoundaries = function(){
	push()
	stroke(255)
  strokeWeight(1)
  strokeCap(SQUARE)
  noFill();
  //draw world center point
  if(gameCam.transform >= 0 && gameCam.transform <= width){
  	drawingContext.setLineDash([5,5]);
  	line(gameCam.transform,bg.floorY,gameCam.transform,height)
  	drawingContext.setLineDash([])
  }
	rect(0,0,width-1,height-1)
  line(bg.leftEdge,  0, bg.leftEdge,  height)
  line(bg.rightEdge, 0, bg.rightEdge, height);
	pop()
}

