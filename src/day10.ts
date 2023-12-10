import {start, finish} from './util.ts'
start(10)

let input = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`

input = Deno.readTextFileSync("./src/inputs/day10.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

class Pipe {
  key = ""
  connected: Pipe[] = []
  constructor(public x: number, public y: number, public shape: string) {
    this.key = `${x};${y}`
  }

  getConnectedDebugInfo() {
    return this.connected.map(b => `${b.shape} (${b.key})`)
  }
}

let root: Pipe = new Pipe(-1, -1, "X");

const lookup: Record<string, Pipe> = {};

const items: Pipe[] = data
  .map((line, y) => line.split("")
    .map((letter, x) => new Pipe(x, y, letter))
  )
  .flat()
  .filter(p => p.shape !== ".")

items.forEach(i => { lookup[i.key] = i; });

items.forEach(i => {
  switch (i.shape) {
    case "|":
      i.connected.push(lookup[`${i.x};${i.y-1}`])
      i.connected.push(lookup[`${i.x};${i.y+1}`])
      break
    case "-":
      i.connected.push(lookup[`${i.x-1};${i.y}`])
      i.connected.push(lookup[`${i.x+1};${i.y}`])
      break
    case "L":
      i.connected.push(lookup[`${i.x};${i.y-1}`])
      i.connected.push(lookup[`${i.x+1};${i.y}`])
      break
    case "J":
      i.connected.push(lookup[`${i.x};${i.y-1}`])
      i.connected.push(lookup[`${i.x-1};${i.y}`])
      break
    case "7":
      i.connected.push(lookup[`${i.x-1};${i.y}`])
      i.connected.push(lookup[`${i.x};${i.y+1}`])
      break
    case "F":
      i.connected.push(lookup[`${i.x+1};${i.y}`])
      i.connected.push(lookup[`${i.x};${i.y+1}`])
      break
    case "S":
      root = i;
      break
    case ".":
      break
    default:
      throw "Unknown bend";
  }
})

function findPathLengthToStart(current: Pipe): number {
  const visited: string[] = [current.key]
  current = current.connected.find(p => p !== root) as Pipe
  visited.push(current.key)
  let i = 0
  while (current !== root) {
    current = current.connected.find(p => !visited.includes(p.key)) as Pipe
    visited.push(current.key)
  }
  // console.log(visited.map(key => `${key} ${lookup[key].shape}`).join ("\n"))
  // console.log()
  return visited.length
}

const part1 = [
    lookup[`${root.x + 0};${root.y - 1}`],
    lookup[`${root.x + 0};${root.y + 1}`],
    lookup[`${root.x - 1};${root.y + 0}`],
    lookup[`${root.x + 1};${root.y + 0}`],
  ]
  .filter(x => x)
  .map(x => findPathLengthToStart(x))
  [0] / 2

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
