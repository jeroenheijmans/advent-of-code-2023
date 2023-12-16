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
  let currentGroupSize = 0
  let idx = 0
  let next = ""

  for (let i = 0; i < line.length; i++) {
    next = line[i]

    if (next === "." && currentGroupSize !== 0) {
      if (currentGroupSize !== nrs[idx++]) return false
      currentGroupSize = 0
    }

    if (next === "#") currentGroupSize++
  }
  
  if (next === "#") return currentGroupSize === nrs[idx++] && idx === nrs.length
  if (next === ".") return idx === nrs.length

  return idx === nrs.length
}

function mightStillBeValid(line: string, nrs: number[]) {
  let currentGroupSize = 0
  let idx = 0
  let next = ""

  for (let i = 0; i < line.length; i++) {
    next = line[i]

    if (next === "?") return true

    if (next === "." && currentGroupSize !== 0) {
      if (currentGroupSize !== nrs[idx++]) return false
      currentGroupSize = 0
    }

    if (next === "#") currentGroupSize++
  }
  
  if (next === "#") return currentGroupSize === nrs[idx++] && idx === nrs.length
  if (next === ".") return idx === nrs.length

  return idx === nrs.length
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

    const option1 = line.replaceAt(index, ".")
    const option2 = line.replaceAt(index, "#")

    if (mightStillBeValid(option1, nrs)) buildPossibilities(option1)
    if (mightStillBeValid(option2, nrs)) buildPossibilities(option2)
  }

  buildPossibilities(input)

  return possibilities
}

const part1 = data
  .map(({line, nrs}, index) => {
    const started = new Date().getTime()
    const result = getArrangements(line, nrs)
    const ended = new Date().getTime()
    console.log(`Line ${index + 1} ran in ${ended - started}ms`)
    return result.size
  })
  .reduce(add, 0)

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
