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

/*
  Step:   0       Length: 1
  Step:   7       Length: 52
  Step:   14      Length: 195
  Step:   21      Length: 432
  Step:   28      Length: 759
  Step:   35      Length: 1164
  Step:   42      Length: 1665
  Step:   49      Length: 2233
  Step:   56      Length: 2949
  Step:   63      Length: 3712
  Step:   70      Length: 4564
  Step:   77      Length: 5520
  Step:   84      Length: 6594
  Step:   91      Length: 7700
  Step:   98      Length: 8916
*/
// input = `
// ...............
// ..##........#..
// .#...........#.
// ......#.#......
// .....#...#.....
// ....#..........
// ...#.......#...
// .......S.......
// ....#.....#....
// .........#.....
// .....#.........
// ......#.#......
// ............#..
// .#.............
// ...............
// `

// input = `
// .....
// .....
// ..S..
// .....
// .....
// `

input = Deno.readTextFileSync("./src/inputs/day21.txt")

interface Location extends Vector2 {
  key: string
  char: "#"|"."|"S"
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
      char: char as "#"|"."|"S",
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

const maxi = 65
const directions = [{dx:-1, dy:0},{dx:+1, dy:0},{dx:0, dy:-1},{dx:0, dy:+1}]

// Enclosed spaces:
locations.forEach(loc => {
  if (directions.every(dir => lookup[`${loc.x + dir.dx};${loc.y + dir.dy}`]?.char === "#")) loc.char = "#"
})

let options = [start]
let part1 = 0

// console.log("Grid Size = ", gridSize, " --- Mid Point = ", midPoint)

for (let i = 0; i < maxi; i++) {
  const newOptions: Vector2[] = []
  const considered = new Set<string>()

  options.forEach(option => {
    directions.forEach(dir => {
      const x = option.x + dir.dx
      const y = option.y + dir.dy
      const newKey = `${x};${y}`

      if (considered.has(newKey)) return

      considered.add(newKey)

      const lookupX = x > 0 ? ((x + midPoint) % gridSize) - midPoint : ((x - midPoint) % gridSize) + midPoint
      const lookupY = y > 0 ? ((y + midPoint) % gridSize) - midPoint : ((y - midPoint) % gridSize) + midPoint

      const target = lookup[`${lookupX};${lookupY}`]

      if (!target) throw `Found no target at x = ${x}, y = ${y} --- lookup: x = ${lookupX}, y = ${lookupY}`
      if (target.char === ".") newOptions.push({x, y})
    })
  }) 

  options = newOptions

  if (i === 63) part1 = options.length

  if (i + 1 === 0) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
  if (i + 1 === 6) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
  if (i + 1 === 10) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
  if (i + 1 === 50) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
  if (i + 1 === 100) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
  if (i + 1 === 250) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
  if (i + 1 === 500) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
  if (i + 1 === 1000) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
  if (i + 1 === 5000) console.log(`Step:\t${i+1}\tLength:\t${options.length}`)
}

const part2Steps = 26501365
let part2 = 0

// const oldOptions = options

// options = []

const yToCountMap = options.map(o => o.y).reduce((result, next) => {
  result[next] = (result[next] || 0) + 1
  return result
}, {} as Record<number, number>)

for (let y = -part2Steps; y <= part2Steps; y++) {
  if (y % 1e6 === 0) console.log(y, new Date().toLocaleTimeString())
  const lookupY = y > 0 ? ((y + midPoint) % gridSize) - midPoint : ((y - midPoint) % gridSize) + midPoint
  const line = grid[lookupY + midPoint]

  const maxx = part2Steps - Math.abs(y)
  
  let dist = 0
  const jumpAt = maxx % midPoint

  for (let x = -maxx; x <= maxx; x += 2) {

    if (x < 0 && dist > jumpAt) x = maxx - dist
    else dist++

    const lookupX = x > 0 ? ((x + midPoint) % gridSize) - midPoint : ((x - midPoint) % gridSize) + midPoint
    const cell = line[lookupX + midPoint]
    if (cell.char === ".") part2++
    // if (cell.char === ".") options.push({x,y})
  }

  const bonusLinesCount = Math.trunc(maxx / midPoint)
  part2 += bonusLinesCount * yToCountMap[lookupY]
}

function draw() {
  const displaySize = Math.ceil(maxi / midPoint) * midPoint
  const glyphs = {
    ".": "·",
    "#": "█",
    "S": "S",
    "X": "X",
  }

  console.log()
  for (let y = -displaySize; y <= displaySize; y++) {
    let line = "  "
    for (let x = -displaySize; x <= displaySize; x++) {

      const lookupX = x > 0 ? ((x + midPoint) % gridSize) - midPoint : ((x - midPoint) % gridSize) + midPoint
      const lookupY = y > 0 ? ((y + midPoint) % gridSize) - midPoint : ((y - midPoint) % gridSize) + midPoint

      const target = lookup[`${lookupX};${lookupY}`]
      if (!target) throw `Found no target to draw at x = ${x}, y = ${y} --- lookup: x = ${lookupX}, y = ${lookupY}`
      line += options.find(o => o.x === x && o.y === y) ? glyphs["X"] : glyphs[target.char]
    }
    console.log(line)
  }
  console.log("\nNumber of options:", options.length, "\n")
}

// draw()
// console.log(options.filter(o => !oldOptions.some(o2 => o2.x === o.x && o2.y === o.y)))

console.log("Part 1:", part1)
console.log("Part 2:", part2, "(307324266398148 is 'too low')")

finishDay()
