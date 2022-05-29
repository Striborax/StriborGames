import {io} from 'socket.io/client';
const socket = io('https://tileworld.org');
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;
let lastTime = (new Date()).getTime();
let currentTime = 0;

socket.emit(0x01);

//keyboard
const keyboard = {
	left: false,
	right: false,
	up: false,
	down: false
}
window.addEventListener('keydown', function(event){
	switch(event.keyCode){
		case 65:
			keyboard.left = true;
			break;
		case 68:
			keyboard.right = true;
			break;
		case 87:
			keyboard.up = true;
			break;
		case 83:
			keyboard.down = true;
			break;
		default:
			break;
	}
});
window.addEventListener('keyup', function(event){
	switch(event.keyCode){
		case 65:
			keyboard.left = false;
			break;
		case 68:
			keyboard.right = false;
			break;
		case 87:
			keyboard.up = false;
			break;
		case 83:
			keyboard.down = false;
			break;
		default:
			break;
	}
});


//player
let players = [];
class Player{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.size = 30; //width and height
		this.speed = 100;
	}
	update(delta){
		if(keyboard.up)
			this.y -= this.speed*delta;
		if(keyboard.down)
			this.y += this.speed*delta;
		if(keyboard.left)
			this.x -= this.speed*delta;
		if(keyboard.right)
			this.x += this.speed*delta;
	}
	draw(){
		ctx.fillStyle = "black";
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
}
players.push(new Player(canvas.width/2, canvas.height/2));
//@TODO handleplayers


//update
function updateGame(){
	currentTime = (new Date()).getTime();
	let delta = (currentTime - lastTime) / 1000;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//handleThings();
	players[0].update(delta);
	players[0].draw();
	//ctx.fillStyle = 'black';
    //ctx.fillText('score: ' + distance, 10, 50);
	lastTime = currentTime;
	requestAnimationFrame(updateGame);
}
updateGame();
