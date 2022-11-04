import { TIME_STEP } from "../main";
import { Circle } from "../models/Circle";
import Vector2, { add, dotProduct, multiply } from "../models/Vector2";

// conservation of momentum [m1v1 + m2v2 = m1v1' + m2v2']
// conservation of kinetic energy [m1(v1^2) + m2(v2^2) = m1(v1'^2) + m2(v2'^2)]

export default function handleCollision(
  targetBodyIndex: number,
  circles: Circle[],
) {
  const targetBody = circles[targetBodyIndex];
  for (let i = 0; i < circles.length; i++) {
    if (i === targetBodyIndex) { continue; }
    // check next time step position
    const nextTargetPosition = targetBody.getNextPosition(TIME_STEP).position;
    const nextOtherPosition = circles[i].getNextPosition(TIME_STEP).position;
    const distance = Math.sqrt(
      Math.pow(nextTargetPosition.x - nextOtherPosition.x, 2) +
      Math.pow(nextTargetPosition.y - nextOtherPosition.y, 2)
    );
    const willIntersect = distance < targetBody.radius + circles[i].radius;

    if (!targetBody.collidesWith(circles[i]) && !willIntersect) { continue; }

    // normal vector
    const normal: Vector2 = {
      x: circles[targetBodyIndex].position.x - circles[i].position.x,
      y: circles[targetBodyIndex].position.y - circles[i].position.y,
    }

    const magnitude = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    normal.x /= magnitude;
    normal.y /= magnitude;

    // tangent vector
    const tangent: Vector2 = {
      x: -normal.y,
      y: normal.x,
    }

    // projecting velocities onto normal and tangent vectors
    const targetBodyNormalVelocity = dotProduct(targetBody.velocity, normal);
    // tangential velocity remains the same after collision
    const targetBodyTangentVelocity = dotProduct(targetBody.velocity, tangent);

    const otherBodyNormalVelocity = dotProduct(circles[i].velocity, normal);
    // tangential velocity remains the same after collision
    const otherBodyTangentVelocity = dotProduct(circles[i].velocity, tangent);

    // velocity in normal direction after collision
    const newTargetBodyNormalVelocity = (
      (targetBody.mass - circles[i].mass) * targetBodyNormalVelocity +
      2 * circles[i].mass * otherBodyNormalVelocity
    ) / (targetBody.mass + circles[i].mass);

    const newOtherBodyNormalVelocity = (
      (circles[i].mass - targetBody.mass) * otherBodyNormalVelocity +
      2 * targetBody.mass * targetBodyNormalVelocity
    )/ (targetBody.mass + circles[i].mass);

    const newTargetVelocityVectorN = multiply(newTargetBodyNormalVelocity, normal);
    const newOtherVelocityVectorN = multiply(newOtherBodyNormalVelocity, normal);
    const newTargetVelocityVectorT = multiply(targetBodyTangentVelocity, tangent);
    const newOtherVelocityVectorT = multiply(otherBodyTangentVelocity, tangent);

    const newTargetVelocity = add(newTargetVelocityVectorN, newTargetVelocityVectorT);
    const newOtherVelocity = add(newOtherVelocityVectorN, newOtherVelocityVectorT);

    circles[targetBodyIndex].velocity = newTargetVelocity;
    circles[i].velocity = newOtherVelocity;
  }

}
