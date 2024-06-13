import Player from "./classes/Player";
import Obstacle from "./classes/Obstacle";
import { Vect2D } from "./classes/Vect2D";
import Rect2D from "./classes/Rect2D";
import { AABBIntersect } from "./utils";
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

  // globalClickListener = window.addEventListener("keydown", (e) => {
  //   if (e.key.toLowerCase() === "r") {
  //     if (Game_Over) {
  //       Game_Over = false;
  //       Score = 0;

  //       obsArray = [];
  //       setupGame();
  //     }
  //   }
  // });
}

function waitTillAssetsLoaded() {
  if (!imagesLoaded) {
    // imagesLoaded = true;
    console.log("timeout");
    setTimeout(() => waitTillAssetsLoaded(), 100);
    return;
  }
  beginGame();
}

function main() {
  setupCanvas();
  waitTillAssetsLoaded();

  // player = new Player()
  // setupGame();
  // update();
}

function beginGame() {
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
  console.log("untouched: ", delta);
  // console.log("update");
  while (delta > 0) {
    let updateDelta = Math.min(MAX_DELTA_SIZE / 1000, delta);
    console.log(updateDelta, MAX_DELTA_SIZE / 1000, delta);
    player.update(updateDelta);

    player.updatePseudoSprites();
    // console.log(player.rigidBody);
    obsArray.forEach((obs) => {
      obs.spriteRenderer.update(updateDelta);
      // obs.rect.y += 1;
      if (obs.rect.y > canvas.height) {
        activeObsCount = OBS_GEN + 1 - Math.floor(score / 250);
        console.log("activeObsCount:", activeObsCount, "OBS_GEN:", OBS_GEN);
        activeObsCount = Math.max(7 * 2, activeObsCount);
        console.log(
          "score: ",
          score.toFixed(0),
          activeObsCount,
          obsArray.length,
          obsArray
        );
        if (activeObsCount < obsArray.length && Math.random() > 0.1) {
          obsArray.splice(obsArray.indexOf(obs), 1);
          return;
        }
        let topObs = obsArray.indexOf(obs) - 1;
        topObs = topObs < 0 ? obsArray.length - 1 : topObs;
        // console.log(
        //   obsArray[topObs].rect.y,
        //   canvas.height,
        //   canvas.height / activeObsCount,
        //   activeObsCount
        // );
        let reqY =
          obsArray[topObs].rect.y - (2 * canvas.height) / (activeObsCount - 1);
        let tempV = getValidSpawnPoint(
          Math.random() * (canvas.width - obs.rect.width),
          reqY,
          true
        );
        obs.rect.y = tempV.y;
        obs.rect.x = tempV.x;
      }
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
  player.spriteRenderer.render(ctx);
  player.pseudoSpriteLeft.render(ctx);
  player.pseudoSpriteRight.render(ctx);
  obsArray.forEach((obs) => {
    obs.spriteRenderer.render(ctx);
  });

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.roundRect(5, 5, 10 + 160 + 15 * Math.log10(score>0?score:1), 15 + 32,[30]);
  ctx.fill()
  ctx.font = "32px Inter";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score.toFixed(0), 32, 10 + 32);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 60, canvas.height / 2 - 60);
  ctx.fillText(
    "Your Score: " + score.toFixed(0),
    canvas.width / 2 -120,
    canvas.height / 2
  );
  ctx.fillText(
    "High Score: " + highScoreNumber.toFixed(0),
    canvas.width / 2 -120,
    canvas.height / 2 + 30
  );
  ctx.fillText(
    "Press R to restart",
    canvas.width / 2 -120,
    canvas.height / 2 + 60
  );
}

// function gameLogic() {}

main();
