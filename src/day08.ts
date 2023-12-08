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
    result[next[0]] = {
      "from": next[0],
      "L": next[1],
      "R": next[2],
      isPart1EndNode: next[0] === "ZZZ",
      isPart2EndNode: next[0].endsWith("Z"),
      isPart2StartNode: next[0].endsWith("A"),
    };
    return result
  }, {} as any)


function pathLen(location = "AAA", endNodeProp = "isPart1EndNode") {
  let result = 0
  let i = 0
  let len = nav.length
  do {
    const turn = nav[i % len]
    location = map[location][turn]
    result++
    if (map[location][endNodeProp]) return result
  } while (i++ < 1e9)
}

const part2Journeys = Object.values(map)
  .filter(n => n.isPart2StartNode)
  .map(n => pathLen(n.from, "isPart2EndNode"))

const part1 = pathLen();
const part2 = Math.max(...part2Journeys)

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
