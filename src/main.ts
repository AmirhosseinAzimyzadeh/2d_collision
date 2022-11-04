import { Circle } from "./models/Circle";
import handleCollision from "./utils/handleCollision";

// check requested width
let CANVAS_WIDTH = 800;
const requestedWidth = new URLSearchParams(window.location.search).get("width");

if (requestedWidth) {
  CANVAS_WIDTH = parseInt(requestedWidth, 10);
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas
      id="canvas"
      width=${CANVAS_WIDTH}
      height=${CANVAS_WIDTH * 0.75}
      style="background-color: #000000;"
    >
    </canvas>
    <div>
      <label for="gravity">Gravity</label>
      <input id="gravity" type="number" value="0" step="0.5" />
    </div>
  </div>
`;

const TIME_STEP = 1 / 30;
export { TIME_STEP };
const NUMBER_OF_CIRCLES = 20;

// initialize canvas
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;

let gravity = 0;

// handle gravity changes
const gravityInput = document.querySelector<HTMLInputElement>('#gravity')!;
gravityInput.addEventListener('change', (e) => {
  gravity = parseFloat((e.target as HTMLInputElement).value);
});

const circles: Circle[] = [];
// create random circles
while (circles.length < NUMBER_OF_CIRCLES) {
  // maximum possible radius
  const maxRadius = (Math.min(canvas.width, canvas.height) / NUMBER_OF_CIRCLES);
  const radius = Math.floor(Math.random() * maxRadius);
  const x = Math.floor(Math.random() * (canvas.width - radius * 2)) + radius;
  const y = Math.floor(Math.random() * (canvas.height - radius * 2)) + radius;
  const circle = new Circle(
    radius * 100,
    { x: Math.random() * (Math.random() > 0.5 ? -1 : 1) * 20,
      y: Math.random() * (Math.random() > 0.5 ? -1 : 1) * 20
    },
    { x: 0, y: 0 },
    radius,
    { x, y }
  );
  if (!circles.some((c) => c.collidesWith(circle))) {
    circles.push(circle);
  }
}

// main loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach((circle, index) => {
    circle.acceleration.y = gravity;
    const { position, velocity } = circle.getNextPosition(TIME_STEP);
    circle.velocity = velocity;
    circle.position = position;
    circle.handleBorderCollision(canvas);
    handleCollision(index, circles);
    circle.draw(ctx);
  });

  requestAnimationFrame(loop);
}

loop();

export {}