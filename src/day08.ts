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

let part2 = 1
let items: number[] = []

Object.values(nodes)
  .filter(node => node.isPart2StartNode)
  .forEach(node => {
    const path: string[] = []

    let current = node
    let i = 0, step = 0, seen = 0
    while (true) {
      if (current.isPart2EndNode) console.log(i, " ====> ", current.key, `(step = ${step})`)
      if (current.isPart2EndNode) seen++
      const tuple = `${i};${current.key}`
      // if (path.includes(tuple)) console.log("Finding repetition at", tuple)
      // if (path.includes(tuple)) break
      if (seen > 0) break
      path.push(tuple)
      const turn = nav[i++]
      i %= nav.length
      current = nodes[current[turn]]
      step++
    }
    items.push(step)
    console.log(path.length, ">>>", (path.length - i) / nav.length)
    console.log()
  })

console.log(items)

const smallest = Math.min(...items)

let j = 0
while (true) {
  j++
  part2 = smallest * j
  if (items.every(i => part2 % i === 0)) break
}

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
