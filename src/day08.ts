import {start, finish} from './util.ts'
start(8)

let input = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`

input = Deno.readTextFileSync("./src/inputs/day08.txt")

const data = input
  .trim()
  .split(/\r?\n\r?\n/)

const nav = data[0].split("")
const map = data[1]
  .split(/\r?\n/)
  .map(x => x.replace(" =", "").replace(/[(),]/g, "").split(" "))
  .reduce((result, next) => {
    result[next[0]] = {"L": next[1], "R": next[2]};
    return result
  }, {} as any)

let location = "AAA"
let part1 = 0
let i = 0
let len = nav.length


do {
  const turn = nav[i % len]
  // console.log("At", location, "turning", turn)
  location = map[location][turn]
  part1++
  if (location === "ZZZ") break;
} while (i++ < 1e9)

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
