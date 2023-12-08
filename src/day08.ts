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
  from: string;
  "L": string
  "R": string
  isPart1EndNode: boolean;
  isPart2EndNode: boolean;
  isPart2StartNode: boolean;
}

const nav = data[0].split("") as ("L"|"R")[]
const map = data[1]
  .split(/\r?\n/)
  .map(x => x.replace(" =", "").replace(/[(),]/g, "").split(" "))
  .reduce((result, next) => {
    result[next[0]] = {
      from: next[0],
      "L": next[1],
      "R": next[2],
      isPart1EndNode: next[0] === "ZZZ",
      isPart2EndNode: next[0].endsWith("Z"),
      isPart2StartNode: next[0].endsWith("A"),
    };
    return result
  }, {} as Record<string, ILocation>)

function pathLen(locations: ILocation[], endNodeProp: "isPart1EndNode"|"isPart2EndNode") {
  let result = 0
  let i = 0
  const len = nav.length
  do {
    let nrOfEndNodes = 0

    locations.forEach((location, index) => {
      const turn = nav[i % len]
      // console.log("At", location, "turning", turn)
      const target = location[turn]
      locations[index] = map[target]
      if (location[endNodeProp]) nrOfEndNodes++
    })

    // if (nrOfEndNodes > 0) console.log(i, nrOfEndNodes)
    if (i % 1e8 === 0) console.log(i, new Date().toLocaleTimeString())
    if (nrOfEndNodes === locations.length) return result
    result++
  } while (i++ < 1e11)
}

const path2Locations = Object.values(map).filter(n => n.isPart2StartNode)

const part1 = map["AAA"] ? pathLen([map["AAA"]], "isPart1EndNode") : undefined
const part2 = pathLen(path2Locations, "isPart2EndNode")

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
