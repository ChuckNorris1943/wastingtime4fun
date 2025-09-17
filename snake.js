const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // size of snake segment
let snake = [{x: 9 * box, y: 10 * box}];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
let score = 0;

// Listen to arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function draw() {
  // Clear canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      // Head
      ctx.fillStyle = "lime";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);

      // Eyes (direction-aware)
      ctx.fillStyle = "white";
      let eyeOffsetX = 0;
      let eyeOffsetY = 0;

      if (direction === "LEFT") eyeOffsetX = -4;
      if (direction === "RIGHT") eyeOffsetX = 4;
      if (direction === "UP") eyeOffsetY = -4;
      if (direction === "DOWN") eyeOffsetY = 4;

      // Left eye
      ctx.beginPath();
      ctx.arc(snake[i].x + box * 0.3, snake[i].y + box * 0.3, 3, 0, 2 * Math.PI);
      ctx.arc(snake[i].x + box * 0.7, snake[i].y + box * 0.3, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Pupils
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(snake[i].x + box * 0.3 + eyeOffsetX * 0.2, snake[i].y + box * 0.3 + eyeOffsetY * 0.2, 1.5, 0, 2 * Math.PI);
      ctx.arc(snake[i].x + box * 0.7 + eyeOffsetX * 0.2, snake[i].y + box * 0.3 + eyeOffsetY * 0.2, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Body
      ctx.fillStyle = "green";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }

  // Move snake
  let head = {x: snake[0].x, y: snake[0].y};
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Check collision with food
  if (head.x === food.x && head.y === food.y) {
    score++;
    if (window.updateScore) updateScore(score);
    if (window.playGulp) playGulp();
    food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
  } else {
    snake.pop();
  }

  // Check collision with walls or self
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head, snake)) {
    clearInterval(game);
    alert("Game over! Final score: " + score);
    if (window.updateScore) updateScore(score);
    return;
  }

  snake.unshift(head);
}

// Collision helper
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

// Run game loop (slower for easier start)
let game = setInterval(draw, 200); // 200ms instead of 100ms
