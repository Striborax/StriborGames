function playdoodle(){
	//setup
	const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 700;

	let lastCrnac = 0;
	let distance = 0;
	let lastNew = 0;
	ctx.font = "50px Georgia";


	//keyboard
	const keyboard = {
		left: false,
		right: false,
		shoot: false
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
				keyboard.shoot = true;
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
				keyboard.shoot = false;
				break;
			default:
				break;
		}
	});

	
	//player
	class Player{
		constructor(){
			this.x = canvas.width/2;
			this.y = canvas.height/2;
			this.visible = false;
			this.bulletX = -100;
			this.bulletY = 0;
			this.height = 60;
			this.width = 50;
			this.speed = 10;
			this.velocity = 0;
		}
		update(){
			if(keyboard.left)
				this.x-=this.speed;
			if(keyboard.right)
				this.x+=this.speed;
			if(this.y > canvas.height){
				this.velocity=-25;
				distance = 0;
				lastNew = 0;
			}
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
				this.bulletY -= this.velocity;
			}
			//bullet
			if(keyboard.shoot){
				this.bulletX = this.x;
				this.bulletY = this.y;
				this.visible = true;
			}
			if(this.visible)
				this.bulletY-=20;
			if(this.bulletY < 0){
				this.bulletX = -100;
				this.visible = false;
			}
			console.log(this.visible);
		}
		draw(){
			ctx.fillStyle = "red";
			ctx.fillRect(this.x - this.width/2, this.y - this.height, this.width, this.height);
			//bullet
			if(this.visible){
				ctx.fillStyle = "black";
				ctx.fillRect(this.bulletX - 5, this.bulletY - 5, 10, 10);
			}
		}
	}
	const player = new Player;


	//things
	let thingArray = [];
	class Thing{
		constructor(crnac){
			this.x = Math.random()*canvas.width;
			this.y = 0;
			this.height = 25;
			this.width = 100;
			this.visible = true;
			this.feder = Math.random()*100 < 5;
			this.crnac = crnac;
		}
		update(){
			if(player.y == canvas.height/2){
				this.y-=player.velocity;
			}
			if(this.visible && player.y > this.y-this.height && player.y < this.y && player.x-player.width/2 < this.x+this.width/2 && player.x+player.width/2 > this.x-this.width/2 && player.velocity > 0){
				if(this.feder)
					player.velocity=-100;
				else if(this.crnac){
					distance = 0;
					lastNew = 0;
				}
				else
					player.velocity=-25;
				this.visible = false;
			}
			if(this.y > canvas.height)
				this.visible = false;
			if(this.visible && player.visible && player.bulletY > this.y-this.height && player.bulletY < this.y && player.bulletX < this.x+this.width/2 && player.bulletX > this.x-this.width/2 && this.crnac){
				this.crnac = false;
				player.visible = false;
			}
		}
		draw(){
			if(this.visible){
				if(this.feder)
					ctx.fillStyle = "#cc0";
				else if(this.crnac)
					ctx.fillStyle = "black";
				else
					ctx.fillStyle = "blue";
				ctx.fillRect(this.x - this.width/2, this.y - this.height, this.width, this.height);
			}
		}
	}
	for(let i = -7; i < 7; i++){
		thingArray.push(new Thing(false));
		thingArray[i+7].y = i*100;
	}
	function handleThings(){
		if(distance - lastNew > 100){
			thingArray.push(new Thing(false));
			lastNew += 100;
		}
		if(distance - lastCrnac > 1000){
			thingArray.push(new Thing(true));
			lastCrnac += 1000;
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
		requestAnimationFrame(updateGame);
	}
	updateGame();
}