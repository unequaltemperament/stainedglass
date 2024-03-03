"use strict"
function Background(){

  let floorHeight = 60;
  this.floorY = windowHeight - floorHeight;
  let stripeWidth = 25;
  let slideMaxSpeed = 4;
  let slideSpeed = 0;
  let slideAccel = .125;
  let slideDamp = .03

  this.numWindows = 30;
  this.drawnWins = 0;
  this.windows = [];
  this.scrolling = 0;
  this.leftEdge = 90;
  this.rightEdge = width-this.leftEdge;

  //-1: player moving left (bg scrolling right)
  // 0: not scrolling
  // 1: player moving right (bg scrolling left 
  this.scrolling = 0;

  //floor collision
  

  this.update = function(p){

    //TODO: player.velocity instead?
    if(player.accel.x<0 && player.screenPos.x <= this.leftEdge+player.r){
      
      if(slideSpeed < slideMaxSpeed){
         slideSpeed+=slideAccel
      }
    }

    else if(slideSpeed>0){
      slideSpeed = lerp(slideSpeed,-2,slideDamp)
      if(slideSpeed<.01)slideSpeed=0
      }

    if(player.accel.x>0 && player.screenPos.x >= this.rightEdge-player.r ){
      if(slideSpeed>-slideMaxSpeed){
         slideSpeed-=slideAccel
      }
    }
    else if(slideSpeed<0){
      slideSpeed = lerp(slideSpeed,2,slideDamp)
      if(slideSpeed>-.01)slideSpeed=0
    }

    this.scrolling = -Math.sign(slideSpeed)

    for(const w of this.windows){
      w.updatePosition(slideSpeed,8); 
      if(this.scrolling && !w.renderable){
          w.relocateWindow(this.scrolling,slideSpeed);
          this.windows.sort((a,b) => b.area-a.area);
          w.updatePosition(slideSpeed);
        }
      } 


  }//update

  this.display = function(){
    push();
    let w = this.windows.filter((e) => {if(e.onScreen)e.drawWindow();return e.onScreen})
    this.drawnWins=w.length;
    pop();
  }//display

  this.drawFloor = function(){
    push();
    noStroke();
    let n = floor(abs(gameCam.transform)/stripeWidth)%2
    for(let i=-stripeWidth;i<width+stripeWidth;i+=stripeWidth){

      let scrollingCoord = (gameCam.transform%stripeWidth)+i
      let stripeNumber = (i+stripeWidth)/stripeWidth;
      
      if(n > 0){
        stripeNumber%2 > 0 ? fill(200,70,80,100) : fill(210,70,80,100);
      }
      else{
        stripeNumber%2 > 0 ? fill(210,70,80,100) : fill(200,70,80,100);
      }

      quad(scrollingCoord,this.floorY,
           scrollingCoord+stripeWidth,this.floorY,
           scrollingCoord+stripeWidth,height,
           scrollingCoord,height)
    }
    pop();
  }//drawFloor()



}//Background