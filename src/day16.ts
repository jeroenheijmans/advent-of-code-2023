import {startDay, finishDay, Point, drawGrid} from './util.ts'
startDay(16)

let input = Deno.readTextFileSync("./src/inputs/day16_example.txt") // Backslashes in example are awkward to inline
input = Deno.readTextFileSync("./src/inputs/day16.txt")

interface Beam {
  position: Point;
  direction: Point;
}

class Body {
  key = "";

  constructor(public x: number, public y: number, public char: string) {
    this.key = `${x};${y}`
  }

  changeBeam(beam: Beam) {
    switch(this.char) {
      case "|":
        if (beam.direction.x === 0) return [beam]
        return [
          {position: {x: beam.position.x, y: beam.position.y}, direction: {x: 0, y: -1}},
          {position: {x: beam.position.x, y: beam.position.y}, direction: {x: 0, y: +1}},
        ]
      case "-":
        if (beam.direction.y === 0) return [beam]
        return [
          {position: {x: beam.position.x, y: beam.position.y}, direction: {x: -1, y: 0}},
          {position: {x: beam.position.x, y: beam.position.y}, direction: {x: +1, y: 0}},
        ]

      case "/":
             if (beam.direction.x === +1) beam.direction = { x:  0, y: -1 }
        else if (beam.direction.x === -1) beam.direction = { x:  0, y: +1 }
        else if (beam.direction.y === +1) beam.direction = { x: -1, y: 0 }
        else if (beam.direction.y === -1) beam.direction = { x: +1, y: 0 }
        return [beam]

      case "\\":
             if (beam.direction.x === +1) beam.direction = { x:  0, y: +1 }
        else if (beam.direction.x === -1) beam.direction = { x:  0, y: -1 }
        else if (beam.direction.y === +1) beam.direction = { x: +1, y: 0 }
        else if (beam.direction.y === -1) beam.direction = { x: -1, y: 0 }
        return [beam]

      default:
        throw "Unknown body";
    }
  }
}

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

const bodies = data
  .map((line, y) => line
    .split("")
    .map((char, x) => new Body(x, y, char))
  )
  .flat()

const lookup = bodies
  .filter(b => b.char !== ".")
  .reduce((result, body) => {
    result[body.key] = body
    return result
  }, {} as Record<string, Body>)

const emptySpaces = new Set(bodies.filter(b => b.char === ".").map(b => b.key))
const energized = new Set<string>()
const visited = new Set<string>()
const beamKeys = new Set<string>()
let beams = [{position: {x:-1, y:0}, direction: {x:1, y:0}}]

while (beams.length > 0) {
  const newBeams: Beam[] = []

  beams.forEach(current => {
    const key = `${current.position.x};${current.position.y}`
    
    if (emptySpaces.has(key)) energized.add(key)
    visited.add(key)
    
    current.position.x += current.direction.x
    current.position.y += current.direction.y
    
    const newKey = `${current.position.x};${current.position.y}`
    const body = lookup[newKey]

    if (body) {
      // console.log("Encountered body", body);
      // drawGrid(data[0].length, data.length, (x, y) => visited.has(`${x};${y}`) ? (energized.has(`${x};${y}`) ? "#" : lookup[`${x};${y}`].char) : ".")
      // console.log()
      body.changeBeam(current).forEach(b => newBeams.push(b));
    }
    else if (emptySpaces.has(newKey)) {
      newBeams.push(current)
    }
  })

  beams = newBeams.filter(b => !beamKeys.has(`${b.position.x};${b.position.y};${b.direction.x};${b.direction.y}`))
  beams.forEach(b => beamKeys.add(`${b.position.x};${b.position.y};${b.direction.x};${b.direction.y}`))
}

// drawGrid(data[0].length, data.length, (x, y) => visited.has(`${x};${y}`) ? (energized.has(`${x};${y}`) ? "#" : lookup[`${x};${y}`].char) : ".")

const part1 = visited.size
const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
