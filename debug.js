class Debug{
  frameRates=[];
  frameAvgs=0;
  longestKey = 0;
  debugLines = new Map();

  runDebug(...args){
    push();
    gameCam.drawBoundaries();
    //  gameCam.drawScreenCenter();

    
    textFont("monospace")
    fill(255);
    noStroke();
    textSize(10);
    textAlign(LEFT,TOP);
    let t = textSize();
    let linesUsed = 0;
    let xCord;
    let yCord;
  
    if(args.length==0){
      xCord=10;
      yCord=10;
    }
  
    this.debugLines.forEach((v,k) => {
      k = k.padStart(this.longestKey," ")
      if(v.x != undefined && v.y != undefined){
        text(`${k} x:${v.x}`,xCord,yCord+linesUsed*t);
        linesUsed++; 

        text(`${"".padStart(k.length)} y:${v.y}`,xCord,yCord+linesUsed*t);
        linesUsed++;
        }
  
      else{
        text(`${k} ${v}`,xCord,yCord+linesUsed*t);
        linesUsed++;
        }
    });
  
  pop();
  }//runDebug

  debugNumFormatted(val){

    if(typeof val === "number"){
        if(!Number.isInteger(val)){
          val = val.toFixed(2)
        }
      //coerced to s
      return (val >= 0 ? ` ` : ``)+val
    }
    else{
      return val}
  }//debugNumFormatted

  addDebugLine(valName, val){

    let builtTemplate = val;

    if(val.x != undefined && val.y != undefined){
        builtTemplate = {x:this.debugNumFormatted(val.x),y:this.debugNumFormatted(val.y)}
      }

    this.debugLines.set(valName, this.debugNumFormatted(builtTemplate))

    this.longestKey=[...this.debugLines.keys()].reduce((a,c) => {return Math.max(a,c.length)},0)
  }


  calcFrameAvg(f){
    let framesToAverage = f ? f : 30;
    this.frameRates.push(frameRate());
    if(this.frameRates.length>framesToAverage){
      this.frameRates.shift();
    }
    if(frameCount==1 || (frameCount)%10 == 0){
      this.frameAvgs = floor(this.frameRates.reduce((acc, iV) => acc + iV, 0)/this.frameRates.length);
    }
    return [this.frameAvgs,framesToAverage]
  }//calcFrameAvg

}