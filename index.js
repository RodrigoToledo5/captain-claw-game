const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      );
    }
  });
});

const gravity = 0.1;

const player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: "./img/warrior/idleclaw.png",
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "./img/warrior/idleclaw.png",
      frameRate: 8,
      frameBuffer: 18,
    },
    Run: {
      imageSrc: "./img/warrior/Run.png",
      frameRate: 10,
      frameBuffer: 18,
    },
    Jump: {
      imageSrc: "./img/warrior/Jump.png",
      frameRate: 7,
      frameBuffer: 18,
    },
    Fall: {
      imageSrc: "./img/warrior/Fall.png",
      frameRate: 5,
      frameBuffer: 9,
    },
    FallLeft: {
      imageSrc: "./img/warrior/FallLeft.png",
      frameRate: 5,
      frameBuffer: 9,
    },
    RunLeft: {
      imageSrc: "./img/warrior/RunLeft.png",
      frameRate: 10,
      frameBuffer: 18,
    },
    IdleLeft: {
      imageSrc: "./img/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 18,
    },
    JumpLeft: {
      imageSrc: "./img/warrior/JumpLeft.png",
      frameRate: 7,
      frameBuffer: 9,
    },
    Hit: {
      imageSrc: "./img/warrior/Attack1.png",
      frameRate: 4,
      frameBuffer: 9,
    },
    HitLeft: {
      imageSrc: "./img/warrior/AttackLeft.png",
      frameRate: 4,
      frameBuffer: 9,
    },
  },
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  Control: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const backgroundImageHeight = 432;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);
  background.update();
  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update()
  // })

  // platformCollisionBlocks.forEach((block) => {
  //   block.update()
  // })

  player.checkForHorizontalCanvasCollision();
  player.update();

  player.velocity.x = 0;
  if (keys.Control.pressed && player.lastDirection === "right") {
    player.switchSprite("Hit");
    player.hit(true);
  } if (keys.Control.pressed && player.lastDirection === "left") {
    player.switchSprite("HitLeft");
    player.hit(true);
  } 
  else if (keys.d.pressed) {
    player.switchSprite("Run");
    player.velocity.x = 1;
    player.lastDirection = "right";
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (keys.a.pressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -1;
    player.lastDirection = "left";
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right" && !keys.Control.pressed) {
      player.switchSprite("Idle");
      player.hit(false);
    } else if (player.lastDirection === "left" && !keys.Control.pressed) {
      player.switchSprite("IdleLeft");
      player.hit(false);
    }
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }

  c.restore();
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Control":
      if (keys.Control.pressed === false) keys.Control.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      player.velocity.y = -4;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "Control":
      keys.Control.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});
