const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
canvas.width = 30 * box;
canvas.height = 30 * box;

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
let score = 0;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    if (i === 0) {
      ctx.fillStyle = "white";
      let eyeOffsetX = direction === "LEFT" ? -4 : direction === "RIGHT" ? 4 : 0;
      let eyeOffsetY = direction === "UP" ? -4 : direction === "DOWN" ? 4 : 0;

      ctx.beginPath();
      ctx.arc(snake[i].x + box * 0.3, snake[i].y + box * 0.3, 3, 0, 2 * Math.PI);
      ctx.arc(snake[i].x + box * 0.7, snake[i].y + box * 0.3, 3, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(snake[i].x + box * 0.3 + eyeOffsetX * 0.2, snake[i].y + box * 0.3 + eyeOffsetY * 0.2, 1.5, 0, 2 * Math.PI);
      ctx.arc(snake[i].x + box * 0.7 + eyeOffsetX * 0.2, snake[i].y + box * 0.3 + eyeOffsetY * 0.2, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  if (head.x === food.x && head.y === food.y) {
    score++;
    if (window.updateScore) updateScore(score);
    if (window.playGulp) playGulp();
    food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
  } else {
    snake.pop();
  }

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    alert("Game over! Final score: " + score);
    if (window.updateScore) updateScore(score);
    running = false;
    return;
  }

  snake.unshift(head);
}

let lastTime = 0;
let running = true;

function getSpeed(score) {
  return 5 + Math.floor(score / 5); // Increase speed every 5 points
}

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  const speed = getSpeed(score);

  if (delta > 1000 / speed) {
    draw();
    lastTime = timestamp;
  }

  if (running) requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
