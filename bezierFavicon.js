function setup(){
createCanvas(500,500)
f = new GoofyWindow(1)
}

function draw(){
	colorMode(HSB,360,100,100,100)
	background(255)
	f.drawWindow()
	noLoop();
}