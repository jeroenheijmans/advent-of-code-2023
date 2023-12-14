import {startDay, finishDay, add} from './util.ts'
startDay(14)

let input = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`

input = Deno.readTextFileSync("./src/inputs/day14.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

interface Point {
  key: string;
  x: number;
  y: number;
}

const rocks: Point[] = []
const walls: Point[] = []

for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[0].length; x++) {
    const key = `${x};${y}`
    if (data[y][x] === "O") rocks.push({key,x,y})
    if (data[y][x] === "#") walls.push({key,x,y})
  }
}

let hasMoved = true
while (hasMoved) {
  hasMoved = false
  rocks.forEach(rock => {
    const targetKey = `${rock.x};${rock.y - 1}`
    if (rock.y > 0 && !walls.some(w => w.key === targetKey) && !rocks.some(w => w.key === targetKey)) {
      hasMoved = true
      rock.key = targetKey
      rock.y = rock.y - 1
    }
  })
}

// for (let y = 0; y < data.length; y++) {
//   let line = ""
//   for (let x = 0; x < data[0].length; x++) {
//     line += rocks.find(r => r.y === y && r.x === x) ? "O" : ".";
//   }
//   console.log(line)
// }

const part1 = rocks.map(r => data.length - r.y).reduce(add, 0)
const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
