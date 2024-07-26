var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var resetButton = document.getElementById("reset-btn");
var canvasElement = document.getElementById("gameCanvas");
var context = canvasElement.getContext("2d");
var unitSize = 20;
var rowsCount = canvasElement.height / unitSize;
var columnsCount = canvasElement.width / unitSize;
var snakeInstance;
var fruitInstance;
var gameInterval;
var Snake = /** @class */ (function () {
    function Snake() {
        this.position = { x: 0, y: 0 };
        this.velocity = { x: unitSize, y: 0 };
        this.length = 0;
        this.body = [];
    }
    Snake.prototype.render = function () {
        context.fillStyle = "#FFFFFF";
        for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
            var segment = _a[_i];
            context.fillRect(segment.x, segment.y, unitSize, unitSize);
            context.strokeRect(segment.x, segment.y, unitSize, unitSize);
        }
        context.fillRect(this.position.x, this.position.y, unitSize, unitSize);
        context.strokeRect(this.position.x, this.position.y, unitSize, unitSize);
    };
    Snake.prototype.move = function () {
        for (var i = 0; i < this.body.length - 1; i++) {
            this.body[i] = this.body[i + 1];
        }
        this.body[this.length - 1] = __assign({}, this.position);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.x >= canvasElement.width || this.position.y >= canvasElement.height || this.position.x < 0 || this.position.y < 0) {
            this.triggerGameOver();
        }
        var scoreDisplay = document.getElementById("score");
        scoreDisplay.innerText = (this.length + 1).toString();
    };
    Snake.prototype.setDirection = function (direction) {
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
    };
    Snake.prototype.consume = function (fruit) {
        if (this.position.x === fruit.position.x && this.position.y === fruit.position.y) {
            this.length++;
            return true;
        }
        return false;
    };
    Snake.prototype.checkSelfCollision = function () {
        for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
            var segment = _a[_i];
            if (this.position.x === segment.x && this.position.y === segment.y) {
                this.triggerGameOver();
            }
        }
    };
    Snake.prototype.triggerGameOver = function () {
        var event = new Event("gameOver");
        document.dispatchEvent(event);
    };
    return Snake;
}());
var Fruit = /** @class */ (function () {
    function Fruit() {
        this.position = { x: 0, y: 0 };
    }
    Fruit.prototype.generateLocation = function () {
        this.position.x = Math.floor(Math.random() * rowsCount) * unitSize;
        this.position.y = Math.floor(Math.random() * columnsCount) * unitSize;
    };
    Fruit.prototype.render = function () {
        context.fillStyle = "red";
        context.fillRect(this.position.x, this.position.y, unitSize, unitSize);
    };
    return Fruit;
}());
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
window.addEventListener("keydown", function (event) {
    var direction = event.key.replace("Arrow", "");
    snakeInstance.setDirection(direction);
});
document.addEventListener("gameOver", function () {
    alert("Game Over!");
    restartGame();
});
resetButton.onclick = restartGame;
initializeGame();
