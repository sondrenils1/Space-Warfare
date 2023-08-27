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
backgroundMusic.loop = true; // Loop the background music // Start playing the background music
backgroundMusic.volume = 0.3;

  
const gameOverSound = new Audio("game-over.wav");
gameOverSound.volume = 0.5 // Replace with the actual sound file



const bulletController = new BulletController(canvas);
const player = new Player(
  canvas.width / 2.2,
  canvas.height / 1.3,
  bulletController
);

const enemies = [
  //new Enemy(50, 20, "green", 5),
  //new Enemy(150, 20, "red", 5),
  //new Enemy(250, 20, "gold", 2),
  //new Enemy(350, 20, "green", 2),
  //new Enemy(450, 20, "gold", 10),
  //new Enemy(50, 100, "green", 5),
  //new Enemy(150, 100, "red", 5),
  //new Enemy(250, 100, "gold", 2),
  //new Enemy(350, 100, "green", 2),
  //new Enemy(450, 100, "gold", 20),
];

let gameStarted = false;
let gameOverFlag = false;

function spawnRandomEnemy() {
  const x = Math.random() * (canvas.width - 50); // Adjust the width of the enemy
  const y = 0; // Start enemies from the top
  const colors = ["green", "red", "gold"];
  const color = colors[Math.floor(Math.random() * colors.length)]; // Random color
  const health = Math.floor(Math.random() * 10) + 1; // Random health between 1 and 10
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

  // Instantiate and push new enemies
  const initialEnemyCount = 2;
  for (let i = 0; i < initialEnemyCount; i++) { // Adjust the number of initial enemies as needed
    enemies.push(spawnRandomEnemy());
  }
}


function gameOver() {
  gameStarted = false;
  gameOverFlag = true;
  backgroundMusic.pause();
  gameOverSound.play();


  // Implement your game over logic here,
  // such as stopping the game loop, displaying a game over message, etc.
}

let spawnTimer = 0;

function gameLoop() {
  setCommonStyle();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  bulletController.draw(ctx);
  player.draw(ctx);

  if (!gameStarted) {
    // Waiting for game start
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Press Tab to Start", canvas.width / 2 - 125, canvas.height / 2);
    return;
  }

  if (gameOverFlag) {
    // Display game over message
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Press Enter to Restart", canvas.width / 2 - 115, canvas.height / 2 + 40);
    return;
  }

  // Enemy logic
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (bulletController.collideWith(enemy)) {
      enemy.takeDamage(1);
      if (enemy.health <= 0) {
        playerScore += enemy.initialHealth;
        enemies.splice(i, 1);
        totalDamageDealt += enemy.initialHealth; // Increment total damage dealt
        
      }
    } else {
      enemy.draw(ctx);
      enemy.y += 1; // Move enemy downwards
      if (enemy.y + enemy.height >= canvas.height) {
        // Enemy hits the bottom
        gameOver();
        return;
      }
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        // Enemy collides with player
        gameOver();
        return;
      }
    
    }
    ctx.fillText(`Score: ${playerScore}`, canvas.width - 160, 90);
    if (gameStarted) {
      const currentTime = new Date();
      const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`Time: ${Math.floor(elapsedTime)} seconds`, canvas.width - 160, 30);
    }
  }



  // Spawn new enemies based on different intervals
  spawnTimer++;
  if (spawnTimer % 120 === 0) { // Spawn every 2 seconds
    enemies.push(spawnRandomEnemy());
  }

  // Rest of your game loop logic
}

// Rest of your code...


document.addEventListener("keydown", (event) => {
  if (gameOverFlag && event.code === "Enter") {
    // Restart the game
    startGame();
  } else if (!gameStarted && event.code === "Tab") {
    // Start the game
    startGame();
  } else {
    // Handle player input during the game
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
