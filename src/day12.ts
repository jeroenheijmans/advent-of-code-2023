import {startDay, finishDay, add, areArraysEqual} from './util.ts'
startDay(12)

let input = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`

input = Deno.readTextFileSync("./src/inputs/day12.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(x => x.split(" "))
  .map(([line, nrs]) => ({
    line,
    nrs: nrs.split(",").map(n => parseInt(n))
  }))

function isValid(line: string, nrs: number[]) {
  const found = []
  let previous = "."

  for (let i = 0; i < line.length; i++) {
    const next = line[i]

    if (next === "?") throw "Validness check with '?' is not possible"
    if (next === "#" && previous === ".") found.push(0)
    if (next === "#") found[found.length - 1]++

    previous = next
  }
  return areArraysEqual(nrs, found)
}

function getArrangements(input: string, nrs: number[]) {
  const possibilities = new Set<string>()
  const seen = new Set<string>()

  function buildPossibilities(line: string) {
    if (seen.has(line)) return
    seen.add(line)

    const index = line.indexOf("?")

    if (index < 0) {
      if (isValid(line, nrs)) possibilities.add(line)
      return
    } 
    
    buildPossibilities(line.replaceAt(index, "."))
    buildPossibilities(line.replaceAt(index, "#"))
  }

  buildPossibilities(input)

  return possibilities
}

const part1 = data
  .map(({line, nrs}, index) => {
    // const started = new Date().getTime()
    const result = getArrangements(line, nrs)
    // const ended = new Date().getTime()
    // console.log(`Line ${index} ran in ${ended - started}ms`)
    return result.size
  })
  .reduce(add, 0)

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
