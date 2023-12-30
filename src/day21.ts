import {startDay, finishDay, Vector2} from './util.ts'
startDay(21)

let input = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`

// input = `
// ...........
// ...........
// ...........
// ...........
// ...........
// .....S.....
// ...........
// ...........
// ...........
// ...........
// ...........
// `

input = Deno.readTextFileSync("./src/inputs/day21.txt")

interface Location extends Vector2 {
  key: string
  char: string
}

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split(""))

const gridSize = data.length
const midPoint = Math.floor(gridSize / 2)

const grid = data
  .map((line, y) => line
    .map((char, x) => ({
      x: x - midPoint,
      y: y - midPoint,
      char,
    }))
    .map(loc => ({ ...loc, key: `${loc.x};${loc.y}` }))
  )

const locations = grid
  .flat()

const lookup = locations.reduce((result, next) => {
  result[next.key] = next
  return result
}, {} as Record<string, Location>)


const location0 = locations.find(l => l.char === "S") as Location
const start = { x: location0.x, y: location0.y }
location0.char = "."

const maxi = 64
const directions = [{dx:-1, dy:0},{dx:+1, dy:0},{dx:0, dy:-1},{dx:0, dy:+1}]
let options = [start]
let part1 = 0

for (let i = 0; i < maxi; i++) {
  if (i % 65 === 0) console.log(options.length)

  const newOptions: Vector2[] = []
  const considered = new Set<string>()

  options.forEach(option => {
    directions.forEach(dir => {
      const newPos = { x: option.x + dir.dx, y: option.y + dir.dy }
      const newKey = `${newPos.x};${newPos.y}`

      if (considered.has(newKey)) return
      considered.add(newKey)

      const lookupX = newPos.x > midPoint ? (newPos.x > midPoint ? newPos.x - gridSize : newPos.x) : (newPos.x < -midPoint ? gridSize + newPos.x : newPos.x)
      const lookupY = newPos.y > midPoint ? (newPos.y > midPoint ? newPos.y - gridSize : newPos.y) : (newPos.y < -midPoint ? gridSize + newPos.y : newPos.y)
      const target = lookup[`${lookupX};${lookupY}`]

      if (!target) console.error("Found no target at newPos = ", newPos, " --- lookup:", lookupX, lookupY)
      if (target.char !== ".") return

      newOptions.push(newPos)
    })
  }) 

  options = newOptions

  if (i === 63) part1 = options.length
}

console.log(locations.filter(l => l.char === "."&& (l.x + l.y) % 2 === 1 && 
  (Math.abs(65 - l.x) + Math.abs(65 - l.y) <= 65)
).length)


function draw() {
  const displaySize = Math.ceil(maxi / midPoint) * midPoint

  for (let y = -displaySize; y <= displaySize; y++) {
    let line = ""
    for (let x = -displaySize; x <= displaySize; x++) {
      const lookupX = x > midPoint ? (x > midPoint ? x - gridSize : x) : (x < -midPoint ? gridSize + x : x)
      const lookupY = y > midPoint ? (y > midPoint ? y - gridSize : y) : (y < -midPoint ? gridSize + y : y)
      const target = lookup[`${lookupX};${lookupY}`]
      line += options.find(o => o.x === x && o.y === y) ? "X" : target.char.replace(".", "·").replace("#", "█")
      // const cls = options.find(o => o.x === x && o.y === y) ? "o" : target.char.replace("#", "x").replace(".", "p")
      // line += `<div class="${cls}"></div>`
    }
    // console.log(`<div class="row">${line}</div>`)
    console.log(line)
  }
}

draw()

console.log("Part 1:", part1)
console.log("Part 2:", 0, "(38893493797086 is 'too low')")

finishDay()
