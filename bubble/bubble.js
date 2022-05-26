function playbubble(){
    //setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    let score = 0;
    let gameFrame = 0;
    let colour = 'black';
    let lastRed = 0;
    let lastYellow = 0;
    ctx.font = "50px Georgia";

    //mouse
    let canvasPosition = canvas.getBoundingClientRect();
    const mouse = {
        x: canvas.width/2,
        y: canvas.height/2
    }
    window.addEventListener('mousemove', function(event){
		mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
	})

    //player
    class Player{
        constructor(){
            this.x = canvas.width/2;
            this.y = canvas.height/2;
            this.radius = 50;
        }
        update(){
            if(mouse.x > canvas.width){mouse.x = canvas.width;}
            if(mouse.x < 0){mouse.x = 0;}
            if(mouse.y > canvas.height){mouse.y = canvas.height;}
            if(mouse.y < 0){mouse.y = 0;}
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            if(gameFrame < 20000){
                this.x -= dx/(20-gameFrame/1000);
                this.y -= dy/(20-gameFrame/1000);
            }
            else{
                this.x -= dx/3;
                this.y -= dy/3;
            }
        }
        draw(){
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            if(gameFrame - lastYellow > 20){
                colour = 'black';
            }
            ctx.fillStyle = colour;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    }
    const player = new Player();

    //bubbles
    const bubblesArray = [];
    class Bubble{
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = 100 + canvas.height;
            this.radius = 50;
            this.speed = Math.random() * 5 + gameFrame/1000;
            this.distance;
            this.counted = false;
        }
        update(){
            this.y -= this.speed;
            const dx = this.x - player.x;
            const dy = this.y - player.y;
            this.distance = Math.sqrt(dx*dx + dy*dy);
        }
        draw(color){
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    }
    function handleBubbles(){
        if(gameFrame % 50 == 0){
            bubblesArray.push(new Bubble());
        }
        for(let i = 0; i < bubblesArray.length; i++){
            bubblesArray[i].update();
            bubblesArray[i].draw('#55f');
        }
        for(let i = 0; i < bubblesArray.length; i++){
            if(bubblesArray[i].y < 0 - bubblesArray[i].radius*2){
                score -= 10;
                lastRed = gameFrame;
                bubblesArray.splice(i, 1);
            }
            if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
                if(!bubblesArray[i].counted){
                    score++;
                    colour = '#0aa';
                    lastYellow = gameFrame;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                }
            }
        }
    }

    //animation
    function animate(){
        if(gameFrame - lastRed > 30){
            ctx.fillStyle = '#ff0';}
        else{
            ctx.fillStyle = '#fa0';}
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        handleBubbles();
        player.update();
        player.draw();
        ctx.fillStyle = 'blue';
        ctx.fillText('score: ' + score, 10, 50);
        gameFrame++;
        requestAnimationFrame(animate);
    }
    animate();
}
