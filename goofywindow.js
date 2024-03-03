"use strict"
function GoofyWindow(winNum){

  const zBuckets = 15;
  const maxGWinHeight=300;
  const maxGWinWidth=450;
  const minWinDim=50;
  const mag = 8;
  const vertWiggle = 2;
  let LslideSpeed=0;
  let offsetAmount=0;
  let ran1 = 0;
  let ran2 = 0;
  let ran3 = 0;
  let ran4 = 0;

  this.color;
  this.area;

  this.winW = 0;
  this.winH = 0;
  this.winX = 0;
  this.winY = 0;

  this.z = 0;

  //vertices
  this.TL = {x:0,y:0};
  this.TR = {x:0,y:0};
  this.BR = {x:0,y:0};
  this.BL = {x:0,y:0};

  //control points
  this.TC1 = {x:0,y:0};
  this.TC2 = {x:0,y:0};

  this.RC1 = {x:0,y:0};
  this.RC2 = {x:0,y:0};

  this.BC1 = {x:0,y:0};
  this.BC2 = {x:0,y:0};

  this.LC1 = {x:0,y:0};
  this.LC2 = {x:0,y:0};

  Object.defineProperty(this, 'renderable', {
  get() {
    return floor(this.winX+this.winW+mag) >0 &&
           floor(this.winX-mag) <= width
  },
  });

  Object.defineProperty(this, 'onScreen', {
  get() {
    return floor(this.winX+this.winW) >0 &&
           floor(this.winX) <= width
  },
  });
  

  this.generateDimensions = function(){
    this.winW = floor(random(minWinDim, maxGWinWidth));
    this.winH = floor(random(minWinDim, maxGWinHeight));
    //bigger windows are further back, bucketed by total area
    this.area = this.winW*this.winH;
    this.z = floor(map(this.area,0,maxGWinWidth*maxGWinHeight,zBuckets,1))
  }//generateDimensions


  this.generateCoordinates = function(){
    if(this.winW==0 && this.winH==0){
      this.generateDimensions()
    }

    this.winX= floor(random(0-this.winW*.9, width))
    this.winY= floor(random(0-this.winH*.9, bg.floorY-this.winH*.33));

    this.calcVerts();
  }//generateCoordinates

  this.relocateWindow = function(dir){
    this.generateDimensions();
    this.generateColor();
    switch(dir){
      case 1:  this.winX = width+floor(random(0,this.maxGWinWidth));
               break;
      case -1: this.winX = -this.winW-floor(random(0,this.maxGWinWidth))
               break;
    }
    this.winY = floor(random(0-this.winH*.9, bg.floorY-this.winH*.33));
  }//relocateWindow

  this.generateColor = function(){

    this.color = {H: abs(floor(random(200, 240)+map(gameCam.transform,0,-5000,0,360))%360),
                  S: floor(random(30, 60)),
                  B: floor(random(100, 150)),
                  //alpha between 20% & 80% depending on total area
                  A: 1/floor(map(this.z,1,zBuckets,2,8))
    }

  }//generateColor


  this.drawWindow = function(){
    push();
    stroke(this.color.H, this.color.S, this.color.B, this.color.A);
    fill(this.color.H, this.color.S, this.color.B, this.color.A);

    //draw boring rectangles
    if(debug){
      strokeWeight(2);
      rect(this.winX, this.winY, this.winW, this.winH);
      strokeWeight(4)
      stroke(this.color.H, this.color.S, this.color.B, .8)
      point(this.winX+this.winW/2, this.winY+this.winH/2)
      // draw control points
      // point(this.TC1.x,this.TC1.y)
      // point(this.TC2.x,this.TC2.y)
      // point(this.RC1.x,this.RC1.y)
      // point(this.RC2.x,this.RC2.y)
      // point(this.BC1.x,this.BC1.y)
      // point(this.BC2.x,this.BC2.y)
      // point(this.LC1.x,this.LC1.y)
      // point(this.LC2.x,this.LC2.y)
    }

    else{
      strokeWeight(2);
      beginShape();
      vertex(this.TL.x, this.TL.y);
      bezierVertex(this.TC1.x,  this.TC1.y, this.TC2.x, this.TC2.y, this.TR.x,  this.TR.y);
      bezierVertex(this.RC1.x,  this.RC1.y, this.RC2.x, this.RC2.y, this.BR.x,  this.BR.y);
      bezierVertex(this.BC1.x,  this.BC1.y, this.BC2.x, this.BC2.y, this.BL.x,  this.BL.y);
      bezierVertex(this.LC1.x,  this.LC1.y, this.LC2.x, this.LC2.y, this.TL.x,  this.TL.y);
      endShape();
    }
    pop();
  }//drawWindow

  this.controlPoint= function(p1,p2,distance){
    
    let Cx,Cy
    let randY = (mag == 0) ? 0 : floor(random(-mag, mag))
    let randX = (mag == 0) ? 0 : floor(random(-mag, mag))

    //top&bottom
    if(p1.y==p2.y){
      Cx = floor(p1.x+((p2.x-p1.x)*distance));
      Cy = floor(p1.y + randY);
    }

    //side
    else{
      Cx = floor(p1.x + randX);
      Cy = floor(p1.y+((p2.y-p1.y)*distance)); 
    }

    return {x:Cx,y:Cy};
  }//controlPoint

  this.calcVerts= function(){
    this.TL.x=this.winX+ran1
    this.TL.y=this.winY+ran2

    this.TR.x=this.winX+this.winW+ran1+ran3
    this.TR.y=this.winY+ran2

    this.BR.x=this.winX+this.winW+ran1+ran3
    this.BR.y=this.winY+this.winH+ran2+ran4
    
    this.BL.x=this.winX+ran1
    this.BL.y=this.winY+this.winH+ran2+ran4

    this.TC1 = this.controlPoint(this.TL,this.TR,.33);
    this.TC2 = this.controlPoint(this.TL,this.TR,.66);

    this.RC1 = this.controlPoint(this.TR,this.BR,.33);
    this.RC2 = this.controlPoint(this.TR,this.BR,.66);

    this.BC1 = this.controlPoint(this.BR,this.BL,.33);
    this.BC2 = this.controlPoint(this.BR,this.BL,.66);

    this.LC1 = this.controlPoint(this.BL,this.TL,.33);
    this.LC2 = this.controlPoint(this.BL,this.TL,.66);
  }//calcVerts

  this.updatePosition = function(slideSpeed,frameSkip=1){
    
    if(frameCount%frameSkip==0){

      ran1 = floor(random(-vertWiggle, vertWiggle));
      ran2 = floor(random(-vertWiggle, vertWiggle));
      ran3 = floor(random(-vertWiggle, vertWiggle));
      ran4 = floor(random(-vertWiggle, vertWiggle));
    
      this.calcVerts();  
    }

    //mult by z = parallax
    this.winX +=slideSpeed*this.z/3

    this.TL.x+=slideSpeed*this.z/3
    this.TR.x+=slideSpeed*this.z/3
    this.BR.x+=slideSpeed*this.z/3
    this.BL.x+=slideSpeed*this.z/3

    this.TC1.x+=slideSpeed*this.z/3
    this.TC2.x+=slideSpeed*this.z/3
    this.RC1.x+=slideSpeed*this.z/3
    this.RC2.x+=slideSpeed*this.z/3
    this.BC1.x+=slideSpeed*this.z/3
    this.BC2.x+=slideSpeed*this.z/3
    this.LC1.x+=slideSpeed*this.z/3
    this.LC2.x+=slideSpeed*this.z/3
  }//updatePosition

  this.generateCoordinates();
  this.generateColor();
  this.updatePosition(0);
}//GoofyWindow