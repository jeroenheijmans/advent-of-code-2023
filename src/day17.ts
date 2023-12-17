import {startDay, finishDay} from './util.ts'
startDay(17)

let input = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`

// input = `
// 111111111111
// 999999999991
// 999999999991
// 999999999991
// 999999999991
// `

input = Deno.readTextFileSync("./src/inputs/day17.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .map((line, y) => line.split("").map((char, x) => ({ x, y , cost: parseInt(char), key: `${x};${y}` })))
  .flat()

const lookup = data.reduce((result, next) => {
  result[`${next.key}`] = next;
  return result;
}, {} as Record<string, {x:number, y:number, cost:number, key:string}>);

const maxx = Math.max(...data.map(b => b.x))
const maxy = Math.max(...data.map(b => b.y))

interface Crucible {
  x: number
  y: number
  vx: number
  vy: number
  moved: number
  totalCost: number
}

function solve({minMoves, maxMoves}: {minMoves:number, maxMoves:number}) {
  let cost = 0
  const visited = new Set<string>()

  let edges = [
    { x:0, y:0, vx: +1, vy: 0, moved: 0, totalCost: 0},
    { x:0, y:0, vx: 0, vy: +1, moved: 0, totalCost: 0},
  ]

  while (edges.length > 0) {
    const newEdges = [] as Crucible[]

    for (const c of edges) {
      const crucibleKey = `${c.x};${c.y};${c.vx};${c.vy};${c.moved}`
      if (visited.has(crucibleKey)) continue

      if (c.totalCost > cost) {
        newEdges.push(c)
        continue
      }

      if (c.totalCost < cost) throw "Unexpectedly skipped crucible"

      if (c.x === maxx && c.y === maxy && c.moved >= minMoves) return c.totalCost

      visited.add(crucibleKey)

      // Straight ahead (if possible)
      if (c.moved < maxMoves && lookup[`${c.x + c.vx};${c.y + c.vy}`]) {
        newEdges.push({
          x: c.x + c.vx,
          y: c.y + c.vy,
          vx: c.vx,
          vy: c.vy,
          moved: c.moved + 1,
          totalCost: c.totalCost + lookup[`${c.x + c.vx};${c.y + c.vy}`].cost
        })
      }

      // Turns (if allowed)
      if (c.moved >= minMoves) {
        const turns = c.vy === 0
          ? [{vx: 0, vy: -1}, {vx: 0, vy: +1}]
          : [{vx: +1, vy: 0}, {vx: -1, vy: 0}]

        turns.forEach(turn => {
          if (lookup[`${c.x + turn.vx};${c.y + turn.vy}`]) {
            newEdges.push({
              x: c.x + turn.vx,
              y: c.y + turn.vy,
              vx: turn.vx,
              vy: turn.vy,
              moved: 1,
              totalCost: c.totalCost + lookup[`${c.x + turn.vx};${c.y + turn.vy}`].cost
            })
          }
        })
      }
    }

    edges = newEdges
    cost++
  }

  throw "Search returned no result"
}

const part1 = solve({minMoves: 0, maxMoves: 3})
const part2 = solve({minMoves: 4, maxMoves: 10})

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
