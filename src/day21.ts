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

const locations = data
  .map((line, y) => line.map((char, x) => ({
    key: `${x};${y}`,
    x,
    y,
    char,
  })))
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
for (let i = 0; i < maxi; i++) {
  const newOptions: Vector2[] = []
  const considered = new Set<string>()

  options.forEach(option => {
    directions.forEach(dir => {
      const newPos = { x: option.x + dir.dx, y: option.y + dir.dy }
      const newKey = `${newPos.x};${newPos.y}`
      if (considered.has(newKey)) return
      considered.add(newKey)
      if (!lookup[newKey]) return
      if (lookup[newKey].char === "#") return
      newOptions.push(newPos)
    })
  })

  options = newOptions
}

const maxx = data[0].length, maxy = data.length
drawGrid(maxx, maxy, (x, y) => options.find(o => o.x === x && o.y === y) ? "O" : lookup[`${x};${y}`].char)

const part1 = options.length
const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
