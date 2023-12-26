import {startDay, finishDay, add} from './util.ts'
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
  .replaceAll(/(\.\.)+/g, ".")
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(x => x.split(" "))
  .map(([pattern, nrs]) => ({
    pattern,
    nrs: nrs.split(",").map(n => parseInt(n))
  }))

function countOptions(pattern: string, nrs: number[]) {
  function isStillPossible(current: string, pattern: string) {
    for (let i = 0; i < current.length; i++) {
      if (pattern[i] !== "?" && pattern[i] !== current[i]) return false
    }
    return true
  }

  function countVariations(length: number, nrs: number[], current: string) {

    if (nrs.length === 0) {
      const option = current.padEnd(length, ".")
      if (!isStillPossible(option, pattern)) return 0
      // console.log(option)
      return 1
    }

    if (!isStillPossible(current, pattern)) return 0

    const currentEndsWithMark = current.at(-1) === "#"
    const [next, ...rest] = nrs
    const minimumLengthForRest = rest.reduce(add, 0) - rest.length
    const leftOverLength = length - current.length
    const maxLengthForNext = leftOverLength - minimumLengthForRest
    const maxOffset = maxLengthForNext - next

    let result = 0
    for (let offset = currentEndsWithMark ? 1 : 0; offset <= maxOffset; offset++) {
      const option = current + (".".repeat(offset) + "#".repeat(next))
      result += countVariations(length, rest, option)
    }
    return result
  }

  return countVariations(pattern.length, nrs, "")
}

const part1 = data.map(line => countOptions(line.pattern, line.nrs)).reduce(add, 0)
const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
