import {startDay, finishDay, Vector2} from './util.ts'
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

interface Jump {
  target: Location
  distance: number
}

interface Location extends Vector2 {
  key: string
  char: string
  targets: Location[]
  connected: Location[]
  jumps: Jump[]
}

interface Path extends Array<Location> {
  isFinished?: boolean
  isFull?: boolean
  distance: number
}

function drawPath(path: Path) {
  for (let y = 0; y <= maxy; y++) {
    let line = ""
    for (let x = 0; x <= maxx; x++) {
      line += path.find(loc => loc.x === x && loc.y === y) ? "O" : (lookup[`${x};${y}`]?.char || "#")
    }
    console.log(line)
  }
}

const locations = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map((line, y) => line.split("").map((char, x) => ({x,y,char})))
  .flat()
  .map(loc => ({
    ...loc,
    key: `${loc.x};${loc.y}`,
    targets: [] as Location[],
    connected: [] as Location[],
    jumps: [] as Jump[],
  }))
  .filter(loc => loc.char !== "#")

const maxx = Math.max(...locations.map(l => l.x)) + 1
const maxy = Math.max(...locations.map(l => l.y))

const lookup = locations
  .reduce((result, next) => {
    result[next.key] = next
    return result
  }, {} as Record<string, Location>)

locations.forEach(loc => {
  if (lookup[`${loc.x - 1};${loc.y + 0}`]) loc.connected.push(lookup[`${loc.x - 1};${loc.y + 0}`])
  if (lookup[`${loc.x + 1};${loc.y + 0}`]) loc.connected.push(lookup[`${loc.x + 1};${loc.y + 0}`])
  if (lookup[`${loc.x + 0};${loc.y - 1}`]) loc.connected.push(lookup[`${loc.x + 0};${loc.y - 1}`])
  if (lookup[`${loc.x + 0};${loc.y + 1}`]) loc.connected.push(lookup[`${loc.x + 0};${loc.y + 1}`])

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

function findNextJunctionFrom(target: Location, previous: Location): Jump {
  if (target.connected.length !== 2) return { target, distance: 1 }
  const jump = findNextJunctionFrom(target.connected.filter(c => c !== previous)[0], target)
  return { target: jump.target, distance: jump.distance + 1 }
}

locations
  .filter(loc => loc.connected.length !== 2)
  .forEach(location => location.jumps = location.connected.map(x => findNextJunctionFrom(x, location)))

{
  let paths = [[lookup["1;0"]]] as Path[]
  paths[0].distance = 0

  while (paths.some(p => !p.isFinished)) {
    const newPaths = [] as Path[]

    paths
      .filter(p => !p.isFinished)
      .forEach(path => {
        const last = path[path.length - 1]
        const options = last.targets.filter(t => !path.includes(t))
        if (options.length > 0) {
          options.forEach(option => {
            const newPath = [...path, option] as Path
            newPath.distance = path.distance + 1
            newPaths.push(newPath)
          })
        } else {
          path.isFinished = true
          path.isFull = last.y === maxy
          newPaths.push(path)
        }
      })
    
    paths = newPaths.concat(paths.filter(p => p.isFinished))
  }

  const hikes = paths.filter(p => p.isFull)
  const longest = hikes.toSorted((a,b) => b.length - a.length).at(0)!
  const part1 = longest.length - 1
  // drawPath(longest)
  console.log("Part 1:", part1)
}

console.log(`TODO: Fix part 2.
We 'solved' part 2 by running the inefficient algorithm
with Bun, which allows for a lot more memory usage and 
won't crash on the real input like Deno does.

For now we disable part 2. If you want to run this script
anyways (or with Bun) uncomment the relevant lines below.`)

// input = await Bun.file("./src/inputs/day23.txt").text()

// {
//   let paths = [[lookup["1;0"]]] as Path[]
//   paths[0].distance = 0

//   while (paths.some(p => !p.isFinished)) {
//     const newPaths = [] as Path[]

//     paths
//       .filter(p => !p.isFinished)
//       .forEach(path => {
//         const last = path[path.length - 1]
//         const options = last.jumps.filter(jump => !path.includes(jump.target))
//         if (options.length > 0) {
//           options.forEach(option => {
//             const newPath = [...path, option.target] as Path
//             newPath.distance = path.distance + option.distance
//             newPaths.push(newPath)
//           })
//         } else {
//           path.isFinished = true
//           path.isFull = last.y === maxy
//           newPaths.push(path)
//         }
//       })
    
//     paths = newPaths.concat(paths.filter(p => p.isFinished))
//   }

//   const hikes = paths.filter(p => p.isFull)
//   const longest = hikes.toSorted((a,b) => b.distance - a.distance).at(0)!
//   const part2 = longest.distance
//   drawPath(longest)
//   console.log("Part 2:", part2)
// }

finishDay()
