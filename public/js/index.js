import { Character } from "./Character.js";
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

let app = new PIXI.Application({
  width: 960,
  height: 540,
  antialias: true, // default: false
  transparent: false, // default: false
  resolution: 1,
});
app.renderer.background.color = 0x061639;
/** FOR FULLSCREEN
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.resizeTo = window;
 */

const displayDiv = document.querySelector("#display");
displayDiv.appendChild(app.view);

let ninja = new Character(app, "Super Ninja", Character.Types.Ninja);
ninja.load().then(() => {
  ninja.addToStage();
});

// PIXI.Assets.load([
//   "../img/ninja/png/Idle__000.png",
//   "../img/ninja/png/Idle__001.png",
//   "../img/ninja/png/Idle__002.png",
//   "../img/ninja/png/Idle__003.png",
//   "../img/ninja/png/Idle__004.png",
//   "../img/ninja/png/Idle__005.png",
//   "../img/ninja/png/Idle__006.png",
//   "../img/ninja/png/Idle__007.png",
//   "../img/ninja/png/Idle__008.png",
//   "../img/ninja/png/Idle__009.png",
// ]).then(() => {
//   let ninjaImages = [
//     "../img/ninja/png/Idle__000.png",
//     "../img/ninja/png/Idle__001.png",
//     "../img/ninja/png/Idle__002.png",
//     "../img/ninja/png/Idle__003.png",
//     "../img/ninja/png/Idle__004.png",
//     "../img/ninja/png/Idle__005.png",
//     "../img/ninja/png/Idle__006.png",
//     "../img/ninja/png/Idle__007.png",
//     "../img/ninja/png/Idle__008.png",
//     "../img/ninja/png/Idle__009.png",
//   ];

//   let ninjaTextureArray = [];
//   for (let i = 0; i < ninjaImages.length; i++) {
//     const texture = PIXI.Texture.from(ninjaImages[i]);
//     ninjaTextureArray.push(texture);
//   }
//   let nijaSprite = new PIXI.AnimatedSprite(ninjaTextureArray);
//   nijaSprite.animationSpeed = 1 / 6; // 6 fps
//   nijaSprite.play();

//   app.stage.addChild(nijaSprite);
// });

PIXI.Assets.load("../img/graveyardtilesetnew/png/BG.png").then(() => {
  const background = PIXI.Sprite.from(
    PIXI.Texture.from("../img/graveyardtilesetnew/png/BG.png")
  );
  app.stage.scale.x = app.view.width / background.width;
  app.stage.scale.y = app.view.height / background.height;
  app.stage.addChild(background);
});

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;
// Tell our application's ticker to run a new callback every frame, passing
// in the amount of time that has passed since the last tick
app.ticker.add((delta) => {
  // Add the time to our total elapsed time
  elapsed += delta;
  // Update the sprite's X position based on the cosine of our elapsed time.  We divide
  // by 50 to slow the animation down a bit...
  //nijaSprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
});
