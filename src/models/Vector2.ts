interface Vector2 {
  x: number
  y: number
}

export default Vector2;

export function dotProduct(a: Vector2, b: Vector2): number {
  return (a.x * b.x) + (a.y * b.y);
}

export function add(a: Vector2, b: Vector2): Vector2 {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function subtract(a: Vector2, b: Vector2): Vector2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function multiply(a: number, v: Vector2): Vector2 {
  return {
    x: a * v.x,
    y: a * v.y,
  };
}
