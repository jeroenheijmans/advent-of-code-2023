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

const grid = data
  .map((line, y) => line.map((char, x) => ({
    key: `${x};${y}`,
    x,
    y,
    char,
  })))

const locations = grid
  .flat()

const maxx = data[0].length, maxy = data.length

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
  // console.log(options.length)

  const newOptions: Vector2[] = []
  const considered = new Set<string>()

  options.forEach(option => {
    directions.forEach(dir => {
      const newPos = { x: option.x + dir.dx, y: option.y + dir.dy }
      const newKey = `${newPos.x};${newPos.y}`

      if (considered.has(newKey)) return
      considered.add(newKey)

      const lookupX = newPos.x >= 0 ? (newPos.x % maxx) : (maxx + (newPos.x % maxx)) % maxx
      const lookupY = newPos.y >= 0 ? (newPos.y % maxy) : (maxy + (newPos.y % maxy)) % maxy
      const target = lookup[`${lookupX};${lookupY}`]

      if (!target) console.log(newPos, lookupX, lookupY)
      if (target.char !== ".") return

      newOptions.push(newPos)
    })
  }) 

  options = newOptions

  if (i === 63) part1 = options.length
}

const quickcheck = grid.map(locs => new Set(locs.filter(l => l.char === ".").map(l => l.x)))

let part2 = 0
// const maxsteps = 6
const maxsteps = 26501365
const halfwayX = start.x
const halfwayY = start.y

for (let y = 0; y <= maxsteps; y++) {
  console.log(y)

  const upperx = maxsteps - y

  for (let x = 0; x <= upperx; x++) {
    if ((x + y) % 2 !== 0) continue

    const myx = (halfwayX + x) % maxx
    const myy = (halfwayY + y) % maxy

    if (quickcheck[myy].has(myx)) part2 += 4 // this is a stupid assumption tho
  }
}


function draw() {
  const x1 = Math.min(...options.map(o => o.x))
  const y1 = Math.min(...options.map(o => o.y))
  const x2 = Math.max(...options.map(o => o.x))
  const y2 = Math.max(...options.map(o => o.y))

  const width = data[0].length
  const height = data.length

  const bonusx1 = Math.abs(Math.floor(x1 / width) - 1)
  const bonusy1 = Math.abs(Math.floor(y1 / height) - 1)
  const bonusx2 = Math.abs(Math.ceil(x2 / width))
  const bonusy2 = Math.abs(Math.ceil(y2 / height))

  const bonus = Math.max(bonusx1, bonusx2, bonusy1, bonusy2)

  const fromx = -(bonus - 1) * width
  const fromy = -(bonus - 1) * height
  const tox = bonus * width
  const toy = bonus * height

  for (let y = fromy; y < toy; y++) {
    let line = ""
    for (let x = fromx; x < tox; x++) {
      const lookupX = x >= 0 ? (x % width) : (width + (x % width) - 1)
      const lookupY = y >= 0 ? (y % height) : (height + (y % height) - 1)
      const target = lookup[`${lookupX};${lookupY}`]
      line += options.find(o => o.x === x && o.y === y) ? "O" : target.char.replace("#", " ").replace(".", "·")
      // const cls = options.find(o => o.x === x && o.y === y) ? "o" : target.char.replace("#", "x").replace(".", "p")
      // line += `<div class="${cls}"></div>`
    }
    // console.log(`<div class="row">${line}</div>`)
    console.log(line)
  }
}

// draw()

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
