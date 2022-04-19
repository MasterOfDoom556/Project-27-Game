//This is a load event listener. It waits for assets to be loaded in before it runs the code within the callback function.
//Its an nameless function. It's really important that majority of the game needs to be ran inside of the function
window.addEventListener('load', function(){
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 720;
// setting up the canvas the game will run on and telling the browser the context in which to run the code. its 2d. i have neither the time or budget for a 3d game.
let Opps = [];
let score = 0;
let GameOver = false;
//additional things that need declaring. I didn't say it, i declaerd it
class InputHandler {
    constructor(){
        this.keys = [];
        window.addEventListener('keydown', z =>{
            if ((z.key === 'ArrowDown' ||
                z.key === 'ArrowUp' ||
                z.key === 'ArrowLeft' ||
                z.key === 'ArrowRight')
                && this.keys.indexOf(z.key) === -1){
                this.keys.push(z.key);
            }

        });
        window.addEventListener('keyup', z =>{

            if (z.key === 'ArrowDown' ||
                z.key === 'ArrowUp' ||
                z.key === 'ArrowLeft' ||
                z.key === 'ArrowRight'){
                this.keys.splice(this.keys.indexOf(z.key), 1);
            }
            // The way this works is simple, there is an empty array and key presses will be entered into the array and removed once the key is no longer pressed.
        });
    }
} // keeps track of keystroke
class dog {
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.height = 195;
        this.width = 300;
        this.x = 0;
        this.y = this.gameHeight - this.height;
        this.image = document.getElementById('dog');
        this.frameX = 0;
        this.maxFrames = 20;
        this.frameY = 0;
        this.fps = 45;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        this.speed = 0;
        this.vy = 0;
        this.gravity = 1;
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.width, 0*this.height,
         this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update(input, deltaTime, Opps){
        //Collision detection. Somehow worse than animation
        Opps.forEach(enemy =>{
            const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
            const dy = (enemy.y +enemy.height) - (this.y + this.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if(distance < enemy.width/2 + this.width/2){
               GameOver = true;
            }
        });
        // dog animation. I did not draw this dog, instead i found the assets on a creative common hub. It did not require me to mention the author, just that i didn't make it.
        if(this.frameTimer > this.frameInterval) {
            if(this.frameX >= this.maxFrames) {
            this.frameX = 0;
            }
            else this.frameX++;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime
        }

        //movement
        if(input.keys.indexOf('ArrowRight') > -1){
            this.speed = 5;
        } else if (input.keys.indexOf('ArrowLeft') > -1){
            this.speed = -5;
        } else if (input.keys.indexOf('ArrowUp') > -1 && this.isGrounded()){
            this.vy -= 30;
        } else {
            this.speed = 0;
        }
        //horizontal movement. Right and Left
        this.x += this.speed;
        if(this.x < 0) this.x = 0;
        else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
        // Vertical movement. Up
        this.y += this.vy;
        if(!this.isGrounded()){
            this.vy += this.gravity;
            this.frameY = 1;
        } else {
            this.vy = 0;
            this.frameY = 0;
        }
        if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }
    isGrounded(){
        return this.y >= this.gameHeight - this.height;
    }
} // keeps track of the player and reacts to keystroke
class background{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById('scrollingbg');
        this.x = 0;
        this.y = 0;
        this.height = 720;
        this.width = 800;
        this.speed = 10;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.width) this.x = 0;
    }
} //keeps track of the background
class opps{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 160;
        this.height = 119;
        this.image = document.getElementById('opps');
        this.x = this.gameWidth;
        this.y = this.gameHeight - this.height;
        this.frameX = 0;
        this.maxFrames = 5;
        this.fps = 20;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        this.speed = 8;
        this.NameInDeathNote = false;
    }
    draw(context){

        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update(deltaTime){
        if(this.frameTimer > this.frameInterval){
            if(this.frameX >= this.maxFrames) this.frameX = 0;
            else this.frameX++;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }

        this.x-= this.speed;
        if(this.x < 0 - this.width) {
            this.NameInDeathNote = true;
            score++;
        }
    }

} // handles enemies generation.
function ControlOpps(deltaTime){
    if(OppTimer > enemyInterval + RandomEnemyInterval){
    Opps.push(new opps(canvas.width, canvas.height));
    RandomEnemyInterval = Math.random() * 1000 + 500;
    OppTimer = 0;
    } else{
        OppTimer += deltaTime;
    }
    Opps.forEach(enemy =>{
        enemy.draw(ctx);
        enemy.update(deltaTime);
    });
    Opps = Opps.filter(opps => !opps.NameInDeathNote);
}; // animates enemies into and out of the game.

function DisplayText(context){
    context.fillStyle = 'red';
    context.font = "40px Helvetica"
    context.fillText('Score: ' + score, 20, 50)
    context.fillStyle = 'orange';
    context.fillText('Score: ' + score, 22, 52)
    if(GameOver){
        context.textAlign = 'center';
        context.fillStyle = 'orange';
    context.fillText('Game Over', canvas.width/2, 200)
    }
} // handles the displaying of text, think scoreboard (unless i change it, which i might) and game over screens

const input = new InputHandler();
const player = new dog(canvas.width, canvas.height);
const Background = new background(canvas.width, canvas.height);

let previousTime = 0;
let OppTimer = 0;
let enemyInterval = 1000;
let RandomEnemyInterval = Math.random() * 1000 + 500;

function animate(timeStamp){
    const deltaTime = timeStamp - previousTime;
    previousTime = timeStamp;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    Background.draw(ctx);
	Background.update();
    player.draw(ctx);
    player.update(input, deltaTime, Opps);
    ControlOpps(deltaTime);
    DisplayText(ctx);
    if(!GameOver) requestAnimationFrame(animate);
} // bane of my existance. handles animation.
animate(0);
});
