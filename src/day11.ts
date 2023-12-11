import {startDay, finishDay} from './util.ts'
startDay(11)

let input = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`

input = Deno.readTextFileSync("./src/inputs/day11.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

const galaxies: {n:number, x:number, y:number}[] = []

const emptyRowIndexes = new Set(Array.from({length: data.length}, (_, i) => i))
const emptyColIndexes = new Set(Array.from({length: data[0].length}, (_, i) => i))

let n = 0
 
for (let y=0; y<data.length; y++) {
  for (let x=0; x<data[0].length; x++) {
    if (data[y][x] === "#") {
      n++
      galaxies.push({n, x, y})
      emptyColIndexes.delete(x)
      emptyRowIndexes.delete(y)
    }
  }
}

// console.log("emptyColIndexes", emptyColIndexes)
// console.log("emptyRowIndexes", emptyRowIndexes)

let part1 = 0

for (let i=0; i<galaxies.length; i++) {
  for (let j=i+1; j<galaxies.length; j++) {
    const maxx = Math.max(galaxies[i].x, galaxies[j].x)
    const maxy = Math.max(galaxies[i].y, galaxies[j].y)
    const minx = Math.min(galaxies[i].x, galaxies[j].x)
    const miny = Math.min(galaxies[i].y, galaxies[j].y)

    const emptyRowCount = [...emptyRowIndexes].filter(y => y < maxy && y > miny).length
    const emptyColCount = [...emptyColIndexes].filter(x => x < maxx && x > minx).length

    const age = 1000000
    const dx = (maxx - minx) + (age - 1) * emptyColCount
    const dy = (maxy - miny) + (age - 1) * emptyRowCount

    const dist = dx + dy

    part1 += dist
    // console.log("Delta", galaxies[i], galaxies[j], dist, emptyColCount, emptyRowCount)
  }
}

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
