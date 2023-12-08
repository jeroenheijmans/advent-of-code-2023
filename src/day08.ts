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


function pathLen(locations: any[], endNodeProp = "isPart1EndNode") {
  let result = 0
  let i = 0
  const len = nav.length
  do {
    let isFinal = true

    locations.forEach((location, index) => {
      const turn = nav[i % len]
      // console.log("At", location, "turning", turn)
      const target = location[turn]
      locations[index] = map[target]
      isFinal = isFinal && location[endNodeProp]
    })

    if (isFinal) return result
    result++
  } while (i++ < 1e9)
}

const path2Locations = Object.values(map).filter(n => n.isPart2StartNode)

// const part1 = pathLen(map["AAA"]);
const part2 = pathLen(path2Locations, "isPart2EndNode") // Math.max(...part2Journeys)

// console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
