import {start, finish} from './util.ts'
start(8)

let input = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`

input = Deno.readTextFileSync("./src/inputs/day08.txt")

const data = input
  .trim()
  .split(/\r?\n\r?\n/)

interface ILocation {
  key: string;
  L: string;
  R: string;
  isPart1EndNode: boolean;
  isPart2EndNode: boolean;
  isPart2StartNode: boolean;
}

const nav = data[0].split("") as ("L"|"R")[]

const nodes = data[1]
  .split(/\r?\n/)
  .map(x => x.replace(" =", "").replace(/[(),]/g, "").split(" "))
  .reduce((result, next) => {
    result[next[0]] = {
      key: next[0],
      L: next[1],
      R: next[2],
      isPart1EndNode: next[0] === "ZZZ",
      isPart2EndNode: next[0].endsWith("Z"),
      isPart2StartNode: next[0].endsWith("A"),
    };
    return result
  }, {} as Record<string, ILocation>)

let part1 = 0
let current = nodes["AAA"]

while (current && !current.isPart1EndNode) {
  const turn = nav[part1++ % nav.length]
  current = nodes[current[turn]] as ILocation
}

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
