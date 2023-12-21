import {startDay, finishDay, Vector2, drawGrid} from './util.ts'
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

// input = Deno.readTextFileSync("./src/inputs/day21.txt")

interface Location extends Vector2 {
  key: string
  char: string
}

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split(""))

const locations = data
  .map((line, y) => line.map((char, x) => ({
    key: `${x};${y}`,
    x,
    y,
    char,
  })))
  .flat()

const maxx = data[0].length, maxy = data.length

const lookup = locations.reduce((result, next) => {
  result[next.key] = next
  return result
}, {} as Record<string, Location>)

const location0 = locations.find(l => l.char === "S") as Location
const start = { x: location0.x, y: location0.y }
location0.char = "."

const maxi = 6
const directions = [{dx:-1, dy:0},{dx:+1, dy:0},{dx:0, dy:-1},{dx:0, dy:+1}]
let options = [start]
for (let i = 0; i < maxi; i++) {
  if (i > 100) console.log("After step", i, "size is", options.length)
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
}

function draw() {
  const x1 = Math.min(...options.map(o => o.x))
  const y1 = Math.min(...options.map(o => o.y))
  const x2 = Math.max(...options.map(o => o.x))
  const y2 = Math.max(...options.map(o => o.y))

  const fromx = (Math.trunc(x1 / maxx) - 1) * maxx + 1
  const fromy = (Math.trunc(y1 / maxy) - 1) * maxy + 1
  const tox = (Math.trunc(x2 / maxx) + 1) * maxx
  const toy = (Math.trunc(y2 / maxy) + 1) * maxy

  for (let y = fromy; y < toy; y++) {
    let line = ""
    for (let x = fromx; x < tox; x++) {
      const lookupX = x >= 0 ? (x % maxx) : (maxx + (x % maxx))
      const lookupY = y >= 0 ? (y % maxy) : (maxy + (y % maxy))
      const target = lookup[`${lookupX};${lookupY}`]
      line += options.find(o => o.x === x && o.y === y) ? "O" : target.char
    }
    console.log(line)
  }
}

draw()

const part2 = options.length
console.log("Part 2:", part2)

finishDay()
