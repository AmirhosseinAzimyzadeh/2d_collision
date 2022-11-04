import Drawable from "./interfaces/Drawable";
import RigidBody from "./RigidBody";
import Vector2 from "./Vector2";

export class Circle extends RigidBody implements Drawable {
  radius: number;
  position: Vector2;
  private color: string;
  reduceVelocityAfterBorderCollision: boolean = false;

  constructor(
    mass: number,
    velocity: Vector2,
    acceleration: Vector2,
    radius: number,
    position: Vector2
  ) {
    super(mass, velocity, acceleration);
    this.radius = radius;
    this.position = position;

    // generate random color
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    this.color = `rgb(${r}, ${g}, ${b})`;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  collidesWith(other: Circle) {
    const distance = Math.sqrt(
      Math.pow(this.position.x - other.position.x, 2) +
        Math.pow(this.position.y - other.position.y, 2)
    );
    return distance <= (this.radius + other.radius);
  }

  getNextPosition(timeStep: number): { position: Vector2; velocity: Vector2 } {
    const velocity = {
      x: this.velocity.x + this.acceleration.x * timeStep,
      y: this.velocity.y + this.acceleration.y * timeStep,
    }
    const position = {
      x: this.position.x + velocity.x * timeStep,
      y: this.position.y + velocity.y * timeStep,
    }
    return { position, velocity };
  }

  handleBorderCollision(canvas: HTMLCanvasElement): void {
    // right border
    if (this.position.x + this.radius >= canvas.width) {
      this.position.x = canvas.width - this.radius;
      this.velocity.x *= -1;
    }
    // left border
    if (this.position.x - this.radius <= 0) {
      this.position.x = this.radius;
      this.velocity.x *= -1;
    }

    // bottom border
    if (this.position.y + this.radius >= canvas.height) {
      this.position.y = canvas.height - this.radius;
      this.velocity.y *= -1;
    }

    // top border
    if (this.position.y - this.radius <= 0) {
      this.position.y = this.radius;
      this.velocity.y *= -1;
    }

    if (this.reduceVelocityAfterBorderCollision) {
      this.velocity.x *= 0.999;
      this.velocity.y *= 0.999;
    }
  }
}