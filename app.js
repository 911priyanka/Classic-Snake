let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("food_eat.mp3");
const gameOverSound = new Audio("game_over.mp3");
const moveSound = new Audio("moves.mp3");
const musicSound = new Audio("music.mp3");

let speed = 6;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let musicStarted = false;
let isPaused = false;

// Start music once on first interaction (keyboard or touch)
function startMusicOnce() {
  if (!musicStarted) {
    musicSound.loop = true;
    musicSound.play();
    musicStarted = true;
  }
}

// Game Loop
function main(ctime) {
  window.requestAnimationFrame(main);
  if (isPaused) return;
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = ctime;
  gameEngine();
}

// Collision Check
function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  return (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  );
}

// Game Logic
function gameEngine() {
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    alert("💀 Game Over! Press any key or button to restart.");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerHTML = "Score: " + score;
    musicSound.currentTime = 0;
    musicSound.play();
  }

  // Eat Food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    let a = 2, b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random())
    };
  }

  // Move Snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Render Snake & Food
  board.innerHTML = "";
  snakeArr.forEach((e, i) => {
    const segment = document.createElement("div");
    segment.style.gridRowStart = e.y;
    segment.style.gridColumnStart = e.x;
    segment.classList.add(i === 0 ? "head" : "snake");
    board.appendChild(segment);
  });

  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// High Score
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

// Start Game Loop
window.requestAnimationFrame(main);

// Keyboard Controls
window.addEventListener("keydown", (e) => {
  startMusicOnce();
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      inputDir = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      inputDir = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      inputDir = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      inputDir = { x: 1, y: 0 };
      break;
  }
});

// Touch Controls
document.getElementById("up").addEventListener("click", () => {
  inputDir = { x: 0, y: -1 };
  moveSound.play();
  startMusicOnce();
});
document.getElementById("down").addEventListener("click", () => {
  inputDir = { x: 0, y: 1 };
  moveSound.play();
  startMusicOnce();
});
document.getElementById("left").addEventListener("click", () => {
  inputDir = { x: -1, y: 0 };
  moveSound.play();
  startMusicOnce();
});
document.getElementById("right").addEventListener("click", () => {
  inputDir = { x: 1, y: 0 };
  moveSound.play();
  startMusicOnce();
});

// Pause Button
document.getElementById("pause").addEventListener("click", () => {
  isPaused = !isPaused;
  document.getElementById("pause").innerText = isPaused ? "▶" : "⏸";
});
