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

const galaxies: {x:number, y:number}[] = []

const emptyRowIndexes = new Set(Array.from({length: data.length}, (_, i) => i))
const emptyColIndexes = new Set(Array.from({length: data[0].length}, (_, i) => i))

for (let y=0; y<data.length; y++) {
  for (let x=0; x<data[0].length; x++) {
    if (data[y][x] === "#") {
      galaxies.push({x, y})
      emptyColIndexes.delete(x)
      emptyRowIndexes.delete(y)
    }
  }
}

let part1 = 0
let part2 = 0

for (let i=0; i<galaxies.length; i++) {
  for (let j=i+1; j<galaxies.length; j++) {
    const maxx = Math.max(galaxies[i].x, galaxies[j].x)
    const maxy = Math.max(galaxies[i].y, galaxies[j].y)
    const minx = Math.min(galaxies[i].x, galaxies[j].x)
    const miny = Math.min(galaxies[i].y, galaxies[j].y)

    const emptyRowCount = [...emptyRowIndexes].filter(y => y < maxy && y > miny).length
    const emptyColCount = [...emptyColIndexes].filter(x => x < maxx && x > minx).length

    const age = 2
    const dx = (maxx - minx) + (age - 1) * emptyColCount
    const dy = (maxy - miny) + (age - 1) * emptyRowCount

    part1 += dx + dy
    
    const age2 = 1000000
    const dx2 = (maxx - minx) + (age2 - 1) * emptyColCount
    const dy2 = (maxy - miny) + (age2 - 1) * emptyRowCount

    part2 += dx2 + dy2
  }
}

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
