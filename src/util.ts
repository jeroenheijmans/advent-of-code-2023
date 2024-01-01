let timeout: number;
let startedAt: Date;

export function startDay(day: number, maxRunTime = 5000) {
  startedAt = new Date();
  console.log(`%cAdvent of Code DAY ${day.toString().padStart(2, "0")}, running at ${startedAt.toLocaleTimeString()}, ${startedAt.toLocaleDateString()}`, 'color: lime');
  timeout = setTimeout(() => { throw Error(`Script timed out after ${maxRunTime}ms!`); }, maxRunTime);
}

export function finishDay() {
  const finishedIn = new Date().getTime() - startedAt.getTime();
  console.log(`%cFinished in ${finishedIn}ms.`, 'color: gray');
  console.log("");
  clearTimeout(timeout);
}

export async function checkTimeout() {
  // Make the process that calls this function switch threads
  // so we allow the start/finish timeout check to run. This
  // is a poor-man's hack to give the `start(...)` setTimeout
  // a chance to run if needed.
  //
  // Might be better to just synchronously check if the script
  // has timed out here, but oh well, this is AoC. :-)
  await new Promise(resolve => setTimeout(resolve));
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 extends Vector2 {
  z: number;
}

export interface Ray2D extends Vector2 {
  vx: number
  vy: number
}

export interface Ray3D extends Vector3 {
  vx: number
  vy: number
  vz: number
}

// I caved and asked ChatGPT for a ray intersection function...
export function findRayIntersection(ray1: Ray2D, ray2: Ray2D): Vector2 | null {
  const determinant = ray1.vx * ray2.vy - ray1.vy * ray2.vx

  if (determinant === 0) return null // If determinant is 0, the rays are parallel and do not intersect

  const t1 = ((ray2.x - ray1.x) * ray2.vy - (ray2.y - ray1.y) * ray2.vx) / determinant
  const t2 = ((ray2.x - ray1.x) * ray1.vy - (ray2.y - ray1.y) * ray1.vx) / determinant

  // Check if intersection point is within the rays
  if (t1 >= 0 && t2 >= 0) {
    return {
      x: ray1.x + t1 * ray1.vx,
      y: ray1.y + t1 * ray1.vy,
    }
  }

  return null // rays do not intersect
}

export function getCombinations<T>(items: T[]) {
  const result: T[][] = []
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      result.push([items[i], items[j]])
    }
  }
  return result
}

export function add(a: number, b: number) {
  return a + b;
}

export function multiply(a: number, b: number) {
  return a * b;
}

export function naiveReverse(str: string) {
  return str.split("").reverse().join("")
}

export function areArraysEqual<T>(left: T[], right: T[]) {
  return left && right && left.length === right.length && left.every((val, i) => val === right[i])
}

declare global {
  interface String {
    replaceAt(index: number, replacement: string): string
    trimCharacter(character: string): string
  }
}

// https://stackoverflow.com/a/55292366/419956 by @JasonLarke
String.prototype.trimCharacter = function(character: string) {
  let start = 0, end = this.length;

  while(start < end && this[start] === character)
      ++start;

  while(end > start && this[end - 1] === character)
      --end;

  return (start > 0 || end < this.length) ? this.substring(start, end) : this as string;
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

export function drawGrid(maxx: number, maxy: number, draw: (x: number, y: number) => string) {
  for (let y = 0; y < maxy; y++) {
    let line = ""
    for (let x = 0; x < maxx; x++) {
      line += draw(x, y)
    }
    console.log(line)
  }
}

export const isString = (value: unknown) => typeof value === 'string' || value instanceof String;
