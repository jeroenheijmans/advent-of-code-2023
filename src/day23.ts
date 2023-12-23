import {startDay, finishDay, Vector2, drawGrid} from './util.ts'
startDay(23)

let input = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`

input = Deno.readTextFileSync("./src/inputs/day23.txt")

interface Location extends Vector2 {
  key: string
  char: string
  targets: Location[]
}

const locations = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map((line, y) => line.split("").map((char, x) => ({x,y,char})))
  .flat()
  .map(loc => ({ ...loc, key: `${loc.x};${loc.y}`, targets: [] as Location[] }))
  .filter(loc => loc.char !== "#")

const maxx = Math.max(...locations.map(l => l.x)) + 1
const maxy = Math.max(...locations.map(l => l.y))

const lookup = locations
  .reduce((result, next) => {
    result[next.key] = next
    return result
  }, {} as Record<string, Location>)

locations.forEach(loc => {
  switch (loc.char) {
    case ">":
      loc.targets.push(lookup[`${loc.x + 1};${loc.y + 0}`])
      break
    case "v":
      loc.targets.push(lookup[`${loc.x + 0};${loc.y + 1}`])
      break
    case "<":
      loc.targets.push(lookup[`${loc.x - 1};${loc.y + 0}`])
      break
    case "^":
      loc.targets.push(lookup[`${loc.x + 0};${loc.y - 1}`])
      break
    case ".":
      if (lookup[`${loc.x - 1};${loc.y + 0}`]) loc.targets.push(lookup[`${loc.x - 1};${loc.y + 0}`])
      if (lookup[`${loc.x + 1};${loc.y + 0}`]) loc.targets.push(lookup[`${loc.x + 1};${loc.y + 0}`])
      if (lookup[`${loc.x + 0};${loc.y - 1}`]) loc.targets.push(lookup[`${loc.x + 0};${loc.y - 1}`])
      if (lookup[`${loc.x + 0};${loc.y + 1}`]) loc.targets.push(lookup[`${loc.x + 0};${loc.y + 1}`])
      break
    default:
      throw "Unexpected location: " + loc.key
  }
  
})

const start = lookup["1;0"]

interface Path extends Array<Location> {
  isFinished?: boolean
  isFull?: boolean
}

let paths = [[start]] as Path[]

let i = 0
while (i ++ < 1e7 && paths.some(p => !p.isFinished)) {
  const newPaths = [] as Path[]

  paths
    .filter(p => !p.isFinished)
    .forEach(path => {
      const last = path[path.length - 1]
      const options = last.targets.filter(t => !path.includes(t))
      if (options.length > 0) {
        options.forEach(option => newPaths.push([...path, option]))
      } else {
        path.isFinished = true
        path.isFull = last.y === maxy
        newPaths.push(path)
      }
    })
  
  paths = newPaths.concat(paths.filter(p => p.isFinished))
}

const hikes = paths.filter(p => p.isFull)

if (i >= 1e7) console.log("Exited loop unexpectedly at max step", i)

const path = hikes.toSorted((a,b) => a.length - b.length).at(0)!
for (let y = 0; y <= maxy; y++) {
  let line = ""
  for (let x = 0; x <= maxx; x++) {
    line += path.find(loc => loc.x === x && loc.y === y) ? "O" : (lookup[`${x};${y}`]?.char || "#")
  }
  // console.log(line)
}

const part1 = Math.max(...hikes.map(p => p.length - 1))
const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
