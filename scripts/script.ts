const resetButton = document.getElementById("reset-btn") as HTMLButtonElement;
const canvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
const context = canvasElement.getContext("2d") as CanvasRenderingContext2D;

const unitSize = 20;
const rowsCount = canvasElement.height / unitSize;
const columnsCount = canvasElement.width / unitSize;

let snakeInstance: Snake;
let fruitInstance: Fruit;

let gameInterval: number;

interface Position {
  x: number;
  y: number;
}

class Snake {
  position: Position;
  velocity: Position;
  length: number;
  body: Position[];

  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: unitSize, y: 0 };
    this.length = 0;
    this.body = [];
  }

  render() {
    context.fillStyle = "#FFFFFF";
    for (let segment of this.body) {
      context.fillRect(segment.x, segment.y, unitSize, unitSize);
      context.strokeRect(segment.x, segment.y, unitSize, unitSize);
    }
    context.fillRect(this.position.x, this.position.y, unitSize, unitSize);
    context.strokeRect(this.position.x, this.position.y, unitSize, unitSize);
  }

  move() {
    for (let i = 0; i < this.body.length - 1; i++) {
      this.body[i] = this.body[i + 1];
    }
    this.body[this.length - 1] = { ...this.position };

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.x >= canvasElement.width || this.position.y >= canvasElement.height || this.position.x < 0 || this.position.y < 0) {
      this.triggerGameOver();
    }

    const scoreDisplay: HTMLDivElement = document.getElementById("score") as HTMLDivElement;
    scoreDisplay.innerText = (this.length + 1).toString();
  }

  setDirection(direction: string) {
    switch (direction) {
      case "Up":
        if (this.velocity.y === 0) {
          this.velocity = { x: 0, y: -unitSize };
        }
        break;
      case "Down":
        if (this.velocity.y === 0) {
          this.velocity = { x: 0, y: unitSize };
        }
        break;
      case "Left":
        if (this.velocity.x === 0) {
          this.velocity = { x: -unitSize, y: 0 };
        }
        break;
      case "Right":
        if (this.velocity.x === 0) {
          this.velocity = { x: unitSize, y: 0 };
        }
        break;
    }
  }

  consume(fruit: Fruit): boolean {
    if (this.position.x === fruit.position.x && this.position.y === fruit.position.y) {
      this.length++;
      return true;
    }
    return false;
  }

  checkSelfCollision() {
    for (let segment of this.body) {
      if (this.position.x === segment.x && this.position.y === segment.y) {
        this.triggerGameOver();
      }
    }
  }

  triggerGameOver() {
    const event = new Event("gameOver");
    document.dispatchEvent(event);
  }
}

class Fruit {
  position: Position;

  constructor() {
    this.position = { x: 0, y: 0 };
  }

  generateLocation() {
    this.position.x = Math.floor(Math.random() * rowsCount) * unitSize;
    this.position.y = Math.floor(Math.random() * columnsCount) * unitSize;
  }

  render() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, unitSize, unitSize);
  }
}

function initializeGame() {
  snakeInstance = new Snake();
  fruitInstance = new Fruit();
  fruitInstance.generateLocation();

  gameInterval = window.setInterval(updateGame, 250);
}

function updateGame() {
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  fruitInstance.render();
  snakeInstance.move();
  snakeInstance.render();

  if (snakeInstance.consume(fruitInstance)) {
    fruitInstance.generateLocation();
  }

  snakeInstance.checkSelfCollision();
}

function restartGame() {
  window.clearInterval(gameInterval);
  initializeGame();
}

window.addEventListener("keydown", (event) => {
  const direction = event.key.replace("Arrow", "");
  snakeInstance.setDirection(direction);
});

document.addEventListener("gameOver", () => {
  alert("Game Over!");
  restartGame();
});

resetButton.onclick = restartGame;

initializeGame();
