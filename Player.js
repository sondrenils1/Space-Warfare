export default class Player {
  constructor(x, y, bulletController) {
    this.x = x;
    this.y = y;
    this.bulletController = bulletController;
    this.width = 50;
    this.height = 50;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 30;
    this.speed = 4;
    //this.image = document.getElementById("spaceship");
    this.image = new Image();
    this.image.src = "spakeship.jpg";

    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  draw(ctx) {
    this.move();
    //ctx.strokeStyle = "yellow";
    //ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.frameX*this.width, this.frameY*this.height, this.width, this.height
      ,this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, 380, 0, 750, 1500, this.x, this.y, 60, 80);

    this.shoot();
  }



  shoot() {
    if (this.shootPressed) {
      const speed = 5;
      const delay = 7;
      const damage = 1;
      const bulletX = this.x + this.width / 2;
      const bulletY = this.y;
      this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
    }

  }


  move() {
    if (this.downPressed && (this.y + this.speed + this.height) <= 480) {
      this.y += this.speed;
    }
    if (this.upPressed && (this.y - this.speed) >= 0) {
      this.y -= this.speed;
    }
    if (this.leftPressed && this.x - this.speed >= 0) {
      this.x -= this.speed;
    }
    if (this.rightPressed && this.x + this.speed + this.width <= 530) {
      this.x += this.speed;
    }
  }
  

  keydown = (e) => {
    if (e.code === "ArrowUp") {
      this.upPressed = true;
    }
    if (e.code === "ArrowDown") {
      this.downPressed = true;
    }
    if (e.code === "ArrowLeft") {
      this.leftPressed = true;
    }
    if (e.code === "ArrowRight") {
      this.rightPressed = true;
    }
    if (e.code === "Space") {
      this.shootPressed = true;
    }
  };

  keyup = (e) => {
    if (e.code === "ArrowUp") {
      this.upPressed = false;
    }
    if (e.code === "ArrowDown") {
      this.downPressed = false;
    }
    if (e.code === "ArrowLeft") {
      this.leftPressed = false;
    }
    if (e.code === "ArrowRight") {
      this.rightPressed = false;
    }
    if (e.code === "Space") {
      this.shootPressed = false;
      const shootSound = new Audio("laser.mp3"); // Replace with the actual sound file
      shootSound.play();
    }
  };
}
