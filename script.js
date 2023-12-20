// ⬇️all game sounds
const gameStart = new Audio("song/gamestart.mp3");
const gameOver = new Audio("song/over.wav");
const eatSound = new Audio("song/eat.wav");
const bgMusic = new Audio("song/bgmusic.mp3");

let inputDir = { x: 0, y: 0 };
const myscore = document.querySelector('h2');
myscore.textContent = `score ➡️${0}`;

let score = 0;
// game spped and fps control  🕹️🕹️🕹️
let speed = 10;
let lastpaintTime = 0;
// snake intail position
let snakeArr = [{ x: 10, y: 5 }];
// food intial position
let food = { x: 8, y: 6 };
const highRank = document.querySelector('.rankers');
const startbtn = document.querySelector('.start');
const snakediv = document.querySelector(".snake-div");

// pause and continue variable
const pauseBtn = document.querySelector('#pause');
let isPaused = false;

function main(ctime) {
  // ⬇️control the game continue and pause 
  if (!isPaused) {
    requestAnimationFrame(main);
  }

  // ✂️logic for fps control
  if ((ctime - lastpaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastpaintTime = ctime;
  gameEngine();
}

// all the main thins in this function
function gameEngine() {
  function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
      // 🐍snake bump their own body
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        return true;
      }
    }

    // snake bump the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
      return true;
    }
  }

  // game over function
  if (isCollide(snakeArr)) {
    gameOver.play();
    gameOver.playbackRate=2;
    bgMusic.pause();
    inputDir = { x: 0, y: 0 };
    alert('Game is over! 🤖🤖please again play.');
    snakeArr = [{ x: 15, y: 14 }];
    gameStart.play();
    location.reload();
  }

    // 🍴snake eat function and score increase functionality and localstorage to  store user score
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    eatSound.play();
    eatSound.playbackRate=1.5;
    score++;
    myscore.textContent = `score ➡️${score}`;
    localStorage.setItem('userscore', score);

    snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
    let a = 2;
    let b = 16;
    food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
  }

  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  snakediv.innerHTML = "";
  // 😌create snake element
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("snakehead");
    } else {
      snakeElement.classList.add("snake");
    }
    snakediv.append(snakeElement);
  });
  
  // 😌create food element
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  snakediv.append(foodElement);
}

window.requestAnimationFrame(main);

// get the user high score from the localstorage
highRank.addEventListener('click', () => {
  let Rank = localStorage.getItem('userscore');
  highRank.textContent = `your highscore 🕹️${Rank}`;
});

// start game click the start btn
startbtn.addEventListener("click", (e) => {
  startbtn.style.display = 'none';
  inputDir = { x: 0, y: 1 };
  bgMusic.play();
  pauseBtn.style.display = 'block'; // Show the pause button
  
  // only work in laptop key click🕹️🕹️
  document.addEventListener("keydown", (event) => {
    gameStart.play();
    gameStart.playbackRate=2;
    switch (event.key) {
      case 'ArrowUp':
        inputDir.x = 0;
        inputDir.y = -1;
        break;
      case 'ArrowDown':
        inputDir.x = 0;
        inputDir.y = 1;
        break;
      case 'ArrowLeft':
        inputDir.x = -1;
        inputDir.y = 0;
        break;
      case 'ArrowRight':
        inputDir.x = 1;
        inputDir.y = 0;
        break;
      default:
        break;
    }
  });
});

// Add click event listener for the pause button
pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;

  if (isPaused) {
    bgMusic.pause();
    pauseBtn.textContent = 'Continue';
  } else {
    bgMusic.play();
    pauseBtn.textContent = 'Pause';
    requestAnimationFrame(main); // Resume the game loop
  }
});
