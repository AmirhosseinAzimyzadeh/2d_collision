import Vector2 from "./Vector2"

export default abstract class RigidBody {
  mass: number
  velocity: Vector2
  acceleration: Vector2
  constructor(mass: number, velocity: Vector2, acceleration: Vector2) {
    this.mass = mass;
    this.velocity = velocity;
    this.acceleration = acceleration;
  }

  abstract handleBorderCollision(canvas: HTMLCanvasElement): void
}