import Player from "./Player.js";
import Enemy from "./Enemy.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 550;
canvas.height = 520;
let playerScore = 0;
let startTime = null;

const backgroundMusic = new Audio("heisann.mp3");
backgroundMusic.loop = true; 
backgroundMusic.volume = 0.3;

  
const gameOverSound = new Audio("game-over.wav");
gameOverSound.volume = 0.5 



const bulletController = new BulletController(canvas);
const player = new Player(
  canvas.width / 2.2,
  canvas.height / 1.3,
  bulletController
);

const enemies = [
 
];

let gameStarted = false;
let gameOverFlag = false;

function spawnRandomEnemy() {
  const x = Math.random() * (canvas.width - 50); 
  const y = 0; 
  const colors = ["green", "red", "gold"];
  const color = colors[Math.floor(Math.random() * colors.length)]; 
  const health = Math.floor(Math.random() * 10) + 1; 
  return new Enemy(x, y, color, health);
}


function startGame() {
  gameStarted = true;
  enemies.length = 0; // Clear existing enemies
  player.x = canvas.width / 2.2; // Reset player position
  player.y = canvas.height / 1.3;
  gameOverFlag = false;
  startTime = new Date();
  backgroundMusic.play();

  
  const initialEnemyCount = 2;
  for (let i = 0; i < initialEnemyCount; i++) { 
    enemies.push(spawnRandomEnemy());
  }
}


function gameOver() {
  gameStarted = false;
  gameOverFlag = true;
  backgroundMusic.pause();
  gameOverSound.play();


}

let spawnTimer = 0;

function gameLoop() {
  setCommonStyle();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  bulletController.draw(ctx);
  player.draw(ctx);

  if (!gameStarted) {
    
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Press Tab to Start", canvas.width / 2 - 125, canvas.height / 2);
    return;
  }

  if (gameOverFlag) {
    
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Press Enter to Restart", canvas.width / 2 - 115, canvas.height / 2 + 40);
    return;
  }


  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (bulletController.collideWith(enemy)) {
      enemy.takeDamage(1);
      if (enemy.health <= 0) {
        playerScore += enemy.initialHealth;
        enemies.splice(i, 1);
        totalDamageDealt += enemy.initialHealth; 
        
      }
    } else {
      enemy.draw(ctx);
      enemy.y += 1; 
      if (enemy.y + enemy.height >= canvas.height) {
       
        gameOver();
        return;
      }
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        
        gameOver();
        return;
      }
    
    }
    ctx.fillText(`Score: ${playerScore}`, canvas.width - 160, 90);
    if (gameStarted) {
      const currentTime = new Date();
      const elapsedTime = (currentTime - startTime) / 1000; 
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`Time: ${Math.floor(elapsedTime)} seconds`, canvas.width - 160, 30);
    }
  }



  
  spawnTimer++;
  if (spawnTimer % 120 === 0) { 
    enemies.push(spawnRandomEnemy());
  }

  
}




document.addEventListener("keydown", (event) => {
  if (gameOverFlag && event.code === "Enter") {
    
    startGame();
  } else if (!gameStarted && event.code === "Tab") {
    
    startGame();
  } else {
    
    player.keydown(event);
  }
});


document.addEventListener("keyup", player.keyup);

//div>Move</div>
     // <div>Arrow Keys</div>
     // <div>Shoot</div>
     // <div>Space bar</div>

function setCommonStyle() {
  ctx.shadowColor = "#d5";
  ctx.shadowBlur = 20;
  ctx.lineJoin = "bevel";
  ctx.lineWidth = 5;
}

setInterval(gameLoop, 1000 / 60);
