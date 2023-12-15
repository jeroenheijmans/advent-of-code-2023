import {startDay, finishDay, add} from './util.ts'
startDay(15)

// const input = 'HASH'
const input = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'
// const input = Deno.readTextFileSync("./src/inputs/day15.txt")

const data = input
  .trim()
  .split(",")

const part1 = data
  .map(line => line
    .split("")
    .reduce((result, char) => ((result + char.charCodeAt(0)) * 17) % 256, 0)
  )
  .reduce(add, 0)

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
