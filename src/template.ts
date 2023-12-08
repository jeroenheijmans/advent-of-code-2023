import {start, finish} from './util.ts'
start(0)

let input = `
`

// input = Deno.readTextFileSync("./src/inputs/day00.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

const part1 = data
const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
