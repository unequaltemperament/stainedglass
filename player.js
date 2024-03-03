"use strict"
const Player = function(startPos){

  this.r = 15;

  this.minRad = this.r/3

  this.maxVelocity = 15;
  this.minVelocity = -this.maxVelocity;
  this.maxAccel = .55;
  this.minAccel = -this.maxAccel;

  this.smooshX = 1;
  this.smooshY = 1;
  let posHistory = [];
  let posLen = 40;

  this.velocity = createVector(0,0);
  this.accel = createVector(0,0);

  this.prevVelocity = this.velocity.copy();
  this.prevAccel = this.accel.copy();

  this.accelInc = createVector(.15,0)
  this.accelDec = this.accelInc.copy().mult(10);

  this.gravityInc = createVector(0,.15);
  this.jumpVelocity = createVector(0,-15);
  this.doubleJumpVelocity = this.jumpVelocity.copy().mult(1);
  let startHeight = bg.floorY*.66//floorHeight
  this.worldPos = createVector(startPos+this.r*2,startHeight)
  this.prevPos = this.worldPos.copy();
  this.screenPos = this.worldPos.copy();
  const compass = [
    createVector(0,1), //U
    createVector(1,0), //R
    createVector(0,-1),//D
    createVector(-1,0) //L
  ]
  let closestPoint = createVector(0,0)
  let diff = createVector(0,0)
  let amtX
  let amtY
  this.framesOnGround = 0

  /*Object.defineProperty(this, 'grounded', {
  get() {
    return this.worldPos.y >= bg.floorY-this.r*this.smooshY
    },
  });*/
  this.grounded=false;

  this.state = {
    singleJump: false,
    doubleJump: false
  }

  this.angle=PI;
  this.scrolling = 0;

      //TODO: jump stuff is all a mess
  this.jump = function(){

    if(this.state.singleJump==false){
      if(this.grounded){
        this.state.singleJump=true;
        this.grounded=false; 
        this.velocity.y=this.jumpVelocity.y
        this.framesOnGround = 0;
      }
    }
    
    else if(this.state.doubleJump==false){
      this.velocity.y = this.doubleJumpVelocity.y
      this.state.doubleJump=true;
    }
  }

  this.attach = function(target){
  }
  
  this.update = function(){

   /* if(this.smooshY!=1){
      s = this.smooshY > 1
      this.smooshY = lerp(this.smooshY,this.smooshX,.02)
      if(s != (this.smooshY > 1))
        this.smooshY = 1
     
    }
    this.smooshX = 1/this.smooshY 
    */
    this.prevAccel = this.accel.copy();
    //this.accel.set(0)
    if(!this.grounded){
      this.accel.add(this.gravityInc)
    
      if(this.velocity.y >0){
        this.accel.add(p5.Vector.mult(this.gravityInc,3));
      }
    }
    else{
      this.accel.set(this.accel.x,0)
    }

    if(keyIsDown(LEFT_ARROW)){
      this.accel.sub(this.maxAccel,0);
    }

    if(keyIsDown(RIGHT_ARROW)){
      this.accel.add(this.maxAccel,0);
    }  

    if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)){
      this.accel.x=0;
      let f = Math.sign(this.velocity.x)*-1*this.maxAccel
      this.accel.add(f,0)
      if(Math.sign(this.velocity.x+this.accel.x) != Math.sign(this.prevVelocity.x)){
        this.accel.x=0
        this.velocity.x=0;
      }
    }

    //constraining seperately means we move "too fast" in non-axis aligned vector directions
    //so velocity range is actually +-sqrt(2)*maxVelocity
    this.accel.x = constrain(this.accel.x,this.minAccel,this.maxAccel);
    this.accel.y = constrain(this.accel.y,this.minAccel,this.maxAccel)
    this.prevVelocity = this.velocity.copy();
    this.velocity.add(this.accel) 

    this.velocity.x = constrain(this.velocity.x,this.minVelocity,this.maxVelocity);
    this.velocity.y = constrain(this.velocity.y,this.minVelocity,this.maxVelocity); 
    this.prevPos = this.worldPos.copy();
    this.worldPos.add(this.velocity)
    //this.worldPos.y = constrain(this.worldPos.y,this.r,windowHeight)

    this.scrolling=Math.sign(this.velocity.x)
    this.angle = round(((-(this.worldPos.x-startPos-this.r*2))/50+PI)%TWO_PI,2)

  }//update

  this.collisions = function(collidersArray){
    let col = false;
    for(const c of collidersArray){
      switch(c.constructor.name){
        case "Platform": 
                  col = collidedCircleRect(this,c)
                  if(col.collided){
                    doCollision(this,col,c);
                  }
                  break;

        case "Coin":
                  col = collidedCircleRect(this,c)
                  if(col.collided){
                    const i = collidersArray.indexOf(c)
                    collidersArray.splice(i,1)
                    worldObs.splice(i,1)
                    score++;
                  }
                  break;
      }
    }
  }//collisons

  function collidedCircleRect(c,r) {
      closestPoint = p5.Vector.sub(c.worldPos,r.center)
      closestPoint.add(r.center);
      closestPoint.x=constrain(closestPoint.x,r.worldPos.x,r.worldPos.x+r.width)
      closestPoint.y=constrain(closestPoint.y,r.worldPos.y,r.worldPos.y+r.height)
      diff = p5.Vector.sub(closestPoint,c.worldPos)
      let max=0;
      let match=-1;
      if(diff.mag() < c.r){    
        for(let i=0;i<4;i++){
          let dp = diff.dot(compass[i])
          if(dp > max){
            max = dp;
            match = i;
          }
        }
      r.collided=true;
      return {collided:true,direction:match,amount:diff}
      }
    r.collided=false;
    return {collided:false}
  }//collidedCircleRect

  function doCollision(p,col,c){

      let amt = 0;
      //horizontal
      if(col.direction == 1 || col.direction == 3){
        
         amt = p.r - abs(col.amount.x)
         p.velocity.x *= -1;
        //boxRight
        if(col.direction == 3){
          p.worldPos.x += amt 
        }
        //boxLeft
        else{
          p.worldPos.x -= amt 
        }
      }

      //vertical
      else{
        amt = p.r - abs(col.amount.y) 
        //boxTop
        if(col.direction == 0){

          p.worldPos.y -= amt
          p.state.singleJump=false;
          p.state.doubleJump=false;
          if(Math.abs(p.velocity.y)<p.maxAccel){
            p.velocity.y=0
            p.grounded=true;
            p.attach(c);
          }
          else{
            p.velocity.y*=-.25;
          }

        }
        //boxBottom
        else{
          //bonk head, no bouncy
          p.worldPos.y += amt
          p.velocity.y=0;
        }
      }
  }//doCollision

  this.display = function(){
    push();

    this.screenPos.x = this.worldPos.x+gameCam.transform
    this.screenPos.y = this.worldPos.y

    noStroke();
    fill(10,85,255);
    ellipse(this.screenPos.x,this.screenPos.y,this.r*2,this.r*2);

    stroke(0)
    strokeWeight(2)  
    line(this.screenPos.x,
         this.screenPos.y,
         this.screenPos.x+(this.r-1)*sin(this.angle),
         this.screenPos.y+(this.r-1)*cos(this.angle));

    pop();
  }//display

}//Player