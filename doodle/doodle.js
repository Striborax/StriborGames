function playdoodle(){
	//setup
	const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 700;

	let score = 0;
	let gameFrame = 0;
	let distance = 0;
	let lastNew = 0;
	ctx.font = "50px Georgia";


	//keyboard
	const keyboard = {
		left: false,
		right: false
	}
	window.addEventListener('keydown', function(event){
		switch(event.keyCode){
			case 65:
				keyboard.left = true;
				break;
			case 68:
				keyboard.right = true;
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
			default:
				break;
		}
	});

	
	//player
	class Player{
		constructor(){
			this.x = canvas.width/2;
			this.y = canvas.height/2;
			this.height = 60;
			this.width = 50;
			this.speed = 8;
			this.velocity = 0;
		}
		update(){
			if(keyboard.left)
				this.x-=this.speed;
			if(keyboard.right)
				this.x+=this.speed;
			if(this.y > canvas.height)
				this.velocity=-25;
			if(this.x > canvas.width - this.width/2)
				this.x = canvas.width - this.width/2;
			if(this.x < this.width/2)
				this.x = this.width/2;

			if(this.velocity < 20)
				this.velocity++;
			this.y += this.velocity;
			if(this.y < canvas.height/2){
				this.y = canvas.height/2;
				distance -= this.velocity;
			}
		}
		draw(){
			ctx.fillStyle = "red";
			ctx.fillRect(this.x - this.width/2, this.y - this.height, this.width, this.height);
		}
	}
	const player = new Player;


	//things
	let thingArray = [];
	class Thing{
		constructor(){
			this.x = Math.random()*canvas.width;
			this.y = 0;
			this.height = 25;
			this.width = 100;
			this.visible = true;
		}
		update(){
			if(player.y == canvas.height/2){
				this.y-=player.velocity;
			}
			if(this.visible && player.y > this.y-this.height && player.y < this.y && player.x-player.width/2 < this.x+this.width/2 && player.x+player.width/2 > this.x-this.width/2 && player.velocity > 0){
				score++;
				player.velocity=-25;
				this.visible = false;
			}
			if(this.y > canvas.height){
				this.visible = false;
			}
		}
		draw(){
			if(this.visible){
				ctx.fillStyle = "blue";
				ctx.fillRect(this.x - this.width/2, this.y - this.height, this.width, this.height);
			}
		}
	}
	for(let i = -7; i < 7; i++){
		thingArray.push(new Thing);
		thingArray[i+7].y = i*100;
	}
	function handleThings(){
		if(distance - lastNew > 100){
			thingArray.push(new Thing);
			lastNew += 100;
		}
		for(let i = 0; i < thingArray.length; i++){
			thingArray[i].update();
			thingArray[i].draw();
			if(thingArray[i].visible == false){
				thingArray.splice(i, 1);
			}
		}
	}


	//update
	function updateGame(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		handleThings();
		player.update();
		player.draw();
		ctx.fillStyle = 'black';
        ctx.fillText('score: ' + distance, 10, 50);
		gameFrame++;
		requestAnimationFrame(updateGame);
	}
	updateGame();
}