//import defaultExport from "./debug.js"
/*global
createCanvas,windowWidth,windowHeight,colorMode,HSB,textAlign,CENTER,GameCam,Background,Player,
Debug,Platform,background,push,pop,text,width,height,keyCode,ESCAPE,isLooping,noLoop,loop
*/
"use strict";

let debug = true;
let record = false;

let gameCam;
let bg;
let player;

let bug;

let startMillis;
let capturer;

let cnv;

let worldObjId = 0;
let worldObs = [];
let colliders = [];
let score = 0;
let f

function setup() {
  cnv = createCanvas(windowWidth, windowHeight).style("display", "block");
  colorMode(HSB);

  //randomSeed(105);
  //noiseSeed(50);
  //frameRate(4);

  gameCam = new GameCam();
  bg = new Background();

  for(let i=0;i<bg.numWindows;i++){
  bg.windows[i] = new GoofyWindow();
  }
  bg.windows.sort((a,b) => b.area-a.area);

  player = new Player(bg.leftEdge);
  
  if (debug) {
    bug = new Debug();
  }

  for(let i = 1; i < 3; i++) {
   new Platform(true, i);
  }
  f = new Platform(true, 1)

  f.height = 60
  f.width = windowWidth -bg.leftEdge*2
  f.worldPos.set(bg.leftEdge,bg.floorY)
  for(let i=0;i<300;i++){
  let coin = new Coin(true)
  coin.worldPos.set((coin.width+20)*i+400,bg.floorY-coin.height)
  }
  f.update = function(){this.worldPos.x = bg.leftEdge-gameCam.transform;Platform.prototype.update.call(this)}
  f.display = ()=>{}
  gameCam.setTarget(player);
} //setup



function draw() {

  /****DO THESE FIRST******/
  if(bug){
    bug.debugLines.clear();
  }
  background(0);
  /************************/

  if(record){
    recordAnimation()
  }

  player.update();
  worldObs.forEach((e) => e.update());
  bg.update(player);
  gameCam.update();

  player.collisions(colliders);

  bg.display();
  bg.drawFloor();
  worldObs.forEach((e) => e.display());
  player.display();
  text(score,200,textSize())

  if (debug) {
    if(!bug){
      //debug enabled after initialization
      bug = new Debug();
    }
   // bug.addDebugLine("Heap",performance.memory.usedJSHeapSize)
    bug.addDebugLine("pVel",player.velocity)
    bug.addDebugLine("pAcc",player.accel)
    // bug.addDebugLine("screen width", width);
    bug.addDebugLine("camTransform", gameCam.transform);
    // bug.addDebugLine("windows drawn", bg.drawnWins);
    bug.addDebugLine("fps average", bug.calcFrameAvg()[0]);
    bug.addDebugLine("player wCoord", player.worldPos);
    bug.addDebugLine("player sCoord", player.screenPos);
    bug.addDebugLine("grounded",player.grounded)
    //bug.addDebugLine("FoG",player.framesOnGround)
    bug.addDebugLine("singleJump",player.state.singleJump)
    bug.addDebugLine("doubleJump",player.state.doubleJump)
    bug.runDebug();
  }

  if(record){
  capturer.capture(document.getElementById('defaultCanvas0'));
  }

} //draw


function recordAnimation(format="png",fps=60,duration=3000){

    if(typeof capturer != "CCapture"){
      capturer = new CCapture({format:format,framerate:fps});
    }

    if(frameCount===1){
      capturer.start()
    }
  
    if(startMillis == null){
      startMillis = millis()
    }

    let elapsed = millis() - startMillis
    let t = map(elapsed,0,duration,0,1)

    //or for frames, assuming 60fps
    //if(frameCount > duration/1000*60)
    //TODO: test the difference between these
    
    if(t>1){
      noLoop();
      capturer.stop();
      capturer.save();
      return;
    }
}

//TODO: make a real input handler
function keyPressed() {
  if (keyCode === 32) {
    player.jump();
  }

  if (keyCode === ESCAPE) {
    return (
      isLooping()
      ? noLoop()
      : loop()
    );
  }
  if (keyCode === 192) {
    debug = !debug
  }
}
