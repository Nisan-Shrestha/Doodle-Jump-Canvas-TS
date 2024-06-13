import Player from "./classes/Player";
import Obstacle from "./classes/Obstacle";
import { Vect2D } from "./classes/Vect2D";
import Rect2D from "./classes/Rect2D";
import { AABBIntersect } from "./utils";
import { Button } from "./utils";
// import Rect2D from './classes/Rect2D';
let score = 0;
let player: Player;
let obsArray: Obstacle[] = [];
let lastTimestamp = Date.now();
let imagesLoaded = false;
let OBS_GEN = 30;
let activeObsCount = OBS_GEN + 1;
let Game_Over = false;
// let global_listener;
let MAX_DELTA_SIZE = 1000 / 60;
// Retrieve high score from local storage
let highScore = localStorage.getItem("DoodleJumpHighScore");
if (highScore === null) {
  highScore = "0";
}
let highScoreNumber = parseInt(highScore);
let playListener: EventListener;
// let globalClickListener ;
const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

//sprites defination
let pendingLoad = 0;
let playerSprite = new Image();
loadSprite(playerSprite, "img/playerSheet.png");
let obstacleSprite = new Image();
loadSprite(obstacleSprite, "img/enemySheet.png");
let menuSprite= new Image();
loadSprite(menuSprite, "img/start.png");
let playSprite= new Image();
loadSprite(playSprite, "img/play.png");

//sprites Loading

function loadSprite(resHolder: HTMLImageElement, src: string) {
  resHolder.src = src;
  pendingLoad++;
  resHolder.onload = () => {
    console.log("loaded: ", src);
    pendingLoad--;
    checkSpriteLoaded();
  };
}

function checkSpriteLoaded() {
  if (pendingLoad == 0) {
    imagesLoaded = true;
    return true;
  } else {
    imagesLoaded = false;
    return false;
  }
}

function setupCanvas() {
  if (canvas.parentElement) {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    canvas.style.background = "url(img/bg.png)";
    canvas.style.backgroundSize = "cover";
    canvas.style.backgroundPositionX = "center";
    canvas.style.backgroundPositionY = "bottom";
    // canvas.style.border = "red 1px solid"
  }
  ctx.save();
  ctx.fillStyle = "cyan";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.roundRect(
    canvas.height / 3,
    canvas.width / 4,
    canvas.width / 2,
    canvas.height / 4,
    [30]
  );
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.font = "48px Comic Sans MS";
  ctx.fillText("Loading", canvas.width / 3, canvas.height / 2);
}

function waitTillAssetsLoaded() {
  if (!imagesLoaded) {
    // imagesLoaded = true;
    console.log("timeout");
    setTimeout(() => waitTillAssetsLoaded(), 100);
    return;
  }
  showMenu();
}

function showMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(menuSprite, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(playSprite, 50, 250, 120, 40);


  ctx.font = "48px Helvetica Neue";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";

  // Draw the buttons
  ctx.font = "24px Helvetica Neue";
  let playButton = {
    text: "Play",
    rect: new Rect2D(50, 250, 120, 40),
    active: true,
    onClick: () => {
      playButton.active = false;
      Game_Over = false;
      beginGame();
    },
  };
  renderButton(playButton, "rgba(0,0,0,0.0)","rgba(0,0,0,0.0)");

  canvas.addEventListener("click", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    const clickRect = new Rect2D(mouseX, mouseY, 1, 1);
    console.log(playButton.active, AABBIntersect(clickRect, playButton.rect));
    if (playButton.active && AABBIntersect(clickRect, playButton.rect)) {
      playButton.onClick();
    }
  });
}

function main() {
  setupCanvas();
  waitTillAssetsLoaded();

  // player = new Player()
  // setupGame();
  // update();
}

function beginGame() {
  obsArray = [];
  if (player) {
    window.removeEventListener("keydown", player.addKey);
    window.removeEventListener("keydown", player.removeKey);
    window.removeEventListener("deviceorientation", player.handleTilt);
  }
  player = new Player(
    {
      left: "a",
      right: "d",
      fire: " ",
    },
    canvas.width / 2,
    canvas.height - 100,
    62,
    62,
    playerSprite,
    [new Vect2D(0, 0)],
    ctx
  );
  player.spriteRenderer.setSourceFrameSize(new Vect2D(92, 92));
  player.pseudoSpriteLeft.setSourceFrameSize(new Vect2D(92, 92));
  player.pseudoSpriteRight.setSourceFrameSize(new Vect2D(92, 92));
  let obs = new Obstacle(
    canvas.width / 2 - 124 / 2,
    canvas.height - 40,
    124,
    35,
    obstacleSprite
  );
  obsArray.push(obs);

  obs.spriteRenderer.setSourceFrameSize(new Vect2D(124, 35));
  for (let i = 0; i < OBS_GEN; i++) {
    let tempx = Math.random() * (canvas.width - 124);
    let tempy =
      -canvas.height + ((2 * canvas.height) / OBS_GEN) * (OBS_GEN - i - 1);
    let validVect = getValidSpawnPoint(tempx, tempy, true);
    let obs = new Obstacle(validVect.x, validVect.y, 124, 35, obstacleSprite);
    obs.spriteRenderer.setSourceFrameSize(new Vect2D(124, 35));
    // obs.spriteRenderer.setSourceFrameSize(new Vect2D(124, 35));
    obsArray.push(obs);
    console.log("added");
  }
  console.log(obsArray[obsArray.length - 1]);
  lastTimestamp = Date.now();
  update();
}

function getValidSpawnPoint(
  x: number,
  y: number,
  constantY: boolean = false
): Vect2D {
  let valid = true;
  do {
    valid = true;
    for (let presentObs of obsArray) {
      if (AABBIntersect(new Rect2D(x, y, 124, 35), presentObs.rect)) {
        x = Math.random() * (canvas.width - 124);
        if (!constantY) y = Math.random() * canvas.height;
        valid = false;
        break;
      }
    }
  } while (!valid);
  return new Vect2D(x, y);
}

function update() {
  if (player.rect.y > canvas.height + player.rect.height + 10) {
    console.log("Game Over");
    if (score > highScoreNumber) {
      highScoreNumber = score;
      localStorage.setItem("DoodleJumpHighScore", highScoreNumber.toString());
    }

    // Retrieve high score from local storage and update UI
    if (!Game_Over)
      setTimeout(() => {
        drawGameOverScreen();
        // alert("Game Over: Press R to restart \n Your Score: " + Score);
      }, 200);
    if (!Game_Over) Game_Over = true;
  }
  if (Game_Over) return;
  let now = Date.now();
  let delta = (now - lastTimestamp) / 1000;
  lastTimestamp = now;
  while (delta > 0) {
    let updateDelta = Math.min(MAX_DELTA_SIZE / 1000, delta);
    player.update(updateDelta);

    player.updatePseudoSprites();
    // Check if platform out of view
    obsArray.forEach((obs) => {
      obs.spriteRenderer.update(updateDelta);
      if (obs.rect.y > canvas.height) {
        obs.reset();
        activeObsCount = OBS_GEN + 1 - Math.floor(score / 250);
        // console.log("activeObsCount:", activeObsCount, "OBS_GEN:", OBS_GEN);
        activeObsCount = Math.max(7 * 2, activeObsCount);
        if (activeObsCount < obsArray.length && Math.random() > 0.1) {
          obsArray.splice(obsArray.indexOf(obs), 1);
          return;
        }
        let topObs = obsArray.indexOf(obs) - 1;
        topObs = topObs < 0 ? obsArray.length - 1 : topObs;

        let reqY =
          obsArray[topObs].rect.y - (2 * canvas.height) / (activeObsCount - 1);
        let tempV = getValidSpawnPoint(
          Math.random() * (canvas.width - obs.rect.width),
          reqY,
          true
        );
        if (Math.random() < Math.min(score / 100000, 0.3) + 0.1) {
          obs.reset();
          obs.makeMoving(Math.random() * 10 - 5);
        }
        if (Math.random() < Math.min(score / 100000, 0.3) + 0.1) {
          obs.reset();
          obs.makeBreakable(player);
        }
        obs.rect.y = tempV.y;
        obs.rect.x = tempV.x;
      }
      obs.update(ctx);
    });
    // console.log(player.rect);
    checkCollision();
    moveCanvas();
    delta -= MAX_DELTA_SIZE / 1000;
    delta = Math.max(0, delta);
  }
  // gameLogic();

  render();

  requestAnimationFrame(update);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.render(ctx);
  obsArray.forEach((obs) => {
    obs.render(ctx);
  });

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.beginPath()
  ctx.roundRect(
    5,
    5,
    10 + 160 + 15 * Math.log10(score > 0 ? score : 1),
    15 + 32,
    [30]
    );
  ctx.closePath()
  ctx.fill();
  ctx.font = "32px Inter";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score.toFixed(0), 100, 10 + 32);
}

function checkCollision() {
  player.isGrounded = false;
  obsArray.forEach((obs) => {
    if (
      AABBIntersect(player.rect, obs.rect) &&
      player.rect.y + player.rect.height < obs.rect.y + obs.rect.height &&
      player.rigidBody.vy >= 0
    ) {
      player.rect.y = obs.rect.y - player.rect.height;
      player.rigidBody.vy = 0;
      player.isGrounded = true;
      if (obs.breakable && !obs.broken) {
        obs.broken = true;
        obs.rect.height = 0;
        obs.rect.width = 0;
        console.log("broken");
      }
      console.log("collided");
    }
  });
}

function moveCanvas() {
  if (player.rect.y < canvas.height / 2) {
    const playerExcess = canvas.height / 2 - player.rect.y;
    player.rect.y = canvas.height / 2;
    obsArray.forEach((obs) => {
      obs.rect.y += playerExcess;
    });
    score += playerExcess;
  }
}
function drawGameOverScreen() {
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") {
      if (Game_Over) {
        Game_Over = false;
        score = 0;

        obsArray = [];
        beginGame();
      }
    }
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 60, canvas.height / 2 - 60);
  ctx.fillText(
    "Your Score: " + score.toFixed(0),
    canvas.width / 2 - 120,
    canvas.height / 2
  );
  ctx.fillText(
    "High Score: " + highScoreNumber.toFixed(0),
    canvas.width / 2 - 120,
    canvas.height / 2 + 30
  );
  const playAgainButton: Button = {
    text: "Play Again",
    rect: new Rect2D(canvas.width / 2 - 60, canvas.height / 2 + 60, 120, 40),
    active: true,
    onClick: () => {
      playAgainButton.active = false;
      Game_Over = false;
      beginGame();
    },
  };
  renderButton(playAgainButton);

  canvas.addEventListener("click", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    const clickRect = new Rect2D(mouseX, mouseY, 1, 1);
    console.log(
      playAgainButton.active,
      AABBIntersect(clickRect, playAgainButton.rect)
    );
    if (
      playAgainButton.active &&
      AABBIntersect(clickRect, playAgainButton.rect)
    ) {
      playAgainButton.onClick();
    }
  });
}

function renderButton(button: Button, color : string = "white", textColoe: string = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(
    button.rect.x,
    button.rect.y,
    button.rect.width,
    button.rect.height
  );
  ctx.fillStyle =textColoe;
  ctx.font = "20px Arial";
  ctx.fillText(
    button.text,
    button.rect.x +
      button.rect.width / 2 -
      ctx.measureText(button.text).width / 2,
    button.rect.y + button.rect.height / 2 + 8
  );
}

// function gameLogic() {}

main();
