function playshooterclassic(){
	//setup
	const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

	let score = 0;
	let gameFrame = 0;
	let lastred = 0;
	let bulletFrameLimit = 2;
	let lastBulletFierd = 0;
	ctx.font = "50px Georgia";


	//mouse
	let canvasPosition = canvas.getBoundingClientRect();
    const mouse = {
        x: canvas.width/2,
        y: canvas.height/2,
    }
	window.addEventListener('mousemove', function(event){
		mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
	})

	//keyboard
	const keyboard = {
		up: false,
		down: false,
		left: false,
		right: false
	}
	window.addEventListener('keydown', function(event){
		switch(event.keyCode){
			case 87:
				keyboard.up = true;
				break;
			case 65:
				keyboard.left = true;
				break;
			case 83:
				keyboard.down = true;
				break;
			case 68:
				keyboard.right = true;
			default:
				break;
		}
	});
	window.addEventListener('keyup', function(event){
		switch(event.keyCode){
			case 87:
				keyboard.up = false;
				break;
			case 65:
				keyboard.left = false;
				break;
			case 83:
				keyboard.down = false;
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
			this.vx = 0;
			this.vy = 0;
			this.radius = 25;
		}
		update(){
			if(keyboard.up && this.vy > -1){this.vy-=0.1;}
			if(keyboard.down && this.vy < 1){this.vy+=0.1;}
			if(keyboard.left && this.vx > -1){this.vx-=0.1;}
			if(keyboard.right && this.vx < 1){this.vx+=0.1;}
			if(this.vx < 0.1 && this.vx > -0.1){this.vx = 0};
			if(this.vy < 0.1 && this.vy > -0.1){this.vy = 0};
			if(this.vx < 0){this.vx+=0.02;}
			if(this.vx > 0){this.vx-=0.02;}
			if(this.vy < 0){this.vy+=0.02;}
			if(this.vy > 0){this.vy-=0.02;}
			this.y+=6*this.vy;
			this.x+=6*this.vx;
		}
		draw(){
			ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
			ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
		}
	}
	const player = new Player;


	//bullet
	const bulletArray = [];
	class Bullet{
		constructor(){
			this.x = player.x;
			this.y = player.y;
			this.dx = this.x - mouse.x;
			this.dy = this.y - mouse.y;
			this.radius = 10;
		}
		update(){
			this.x -= this.dx/Math.sqrt(this.dx*this.dx + this.dy*this.dy)*5;
			this.y -= this.dy/Math.sqrt(this.dx*this.dx + this.dy*this.dy)*5;
		}
		draw(){
			ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
		}
	}
	function handleBullets(){
		if(gameFrame - lastBulletFierd > bulletFrameLimit){
			bulletArray.push(new Bullet);
			lastBulletFierd = gameFrame;
		}
		for(let i = 0; i < bulletArray.length; i++){
			bulletArray[i].update();
			bulletArray[i].draw();
			if(bulletArray[i].x > canvas.width || bulletArray[i].x < 0 || bulletArray[i].y > canvas.height || bulletArray[i].y < 0){
				bulletArray.splice(i, 1);
			}
		}
	}


	//enemy
	let enemyArray = [];
	class Enemy{
		constructor(){
			if(Math.random() > 0.5){
				this.direction = -1;
				this.x = canvas.width;
			}else{
				this.direction = 1;
				this.x = 0;
			}
			this.y = Math.random() * canvas.height;
			this.radius = Math.random() * 50 + 10;
			this.dx = 0;
			this.dy = 0;
			this.distance = 0;
			this.playerDistance = 0;
			this.visible = true;
		}
		update(){
			for(let i = 0; i < bulletArray.length; i++){
				this.dx = bulletArray[i].x - this.x;
				this.dy = bulletArray[i].y - this.y;
				this.distance = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
				if(this.distance < this.radius + bulletArray[i].radius && this.visible){
					this.radius-=5;
					score++;
					bulletArray.splice(i, 1);
				}
			}
			this.playerDistance = Math.sqrt((player.x-this.x)**2 + (player.y-this.y)**2);
			if(this.playerDistance < this.radius + player.radius && this.visible){
				score -= this.radius | 0;
				this.visible = false;
				lastred = gameFrame;
			}
			this.x += 5*this.direction;
		}
		draw(){
			ctx.fillStyle = "red"
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
		}
	};
	function handleEnemies(){
		if(gameFrame % 15 == 0){
			enemyArray.push(new Enemy());
		}
		for(let i = 0; i < enemyArray.length; i++){
			enemyArray[i].update();
			enemyArray[i].draw();
			if(enemyArray[i].radius < 10){
				enemyArray[i].visible = false;
			}
			if(enemyArray[i].direction == 1 && enemyArray[i].x > canvas.width){
				enemyArray[i].visible = false;
			}
			if(enemyArray[i].direction == -1 && enemyArray[i].x < 0){
				enemyArray[i].visible = false;
			}
			if(enemyArray[i].visible == false){
				enemyArray.splice(i, 1);
			}
		}
	}


	//update
	function updateGame(){
		if(gameFrame - lastred < 40){
			ctx.fillStyle = '#fbb';
		}else{
			ctx.fillStyle = '#fff';
		}
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		handleEnemies();
		handleBullets();
		player.update();
		player.draw();
		ctx.fillStyle = 'black';
        ctx.fillText('score: ' + score, 10, 50);
		gameFrame++;
		requestAnimationFrame(updateGame);
	}
	updateGame();
}
