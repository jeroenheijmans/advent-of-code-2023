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

  function isStillPossible(startCheckFrom: number, current: string) {
    for (let i = startCheckFrom; i < current.length; i++) {
      if (pattern[i] !== "?" && pattern[i] !== current[i]) return false
    }
    return true
  }

  const maxIndex = nrs.length

  function countVariations(length: number, current: string, index: number) {
    if (index === maxIndex) {
      const option = current.padEnd(length, ".")
      if (!isStillPossible(current.length, option)) return 0
      // console.log(option)
      return 1
    }

    const currentLength = current.length
    const currentEndsWithMark = current[currentLength - 1] === "#"
    const next = nrs[index]

    let minimumLengthForRest = 0
    for (let i = index + 1; i < nrs.length; i++) {
      minimumLengthForRest += nrs[i] + 1
    }

    const leftOverLength = length - currentLength
    const maxLengthForNext = leftOverLength - minimumLengthForRest
    const maxOffset = maxLengthForNext - next

    let result = 0
    for (let offset = currentEndsWithMark ? 1 : 0; offset <= maxOffset; offset++) {
      // Note to self to try to improve this...
      // Let's say we're looking at a nr 3 for a max string length of 8
      // A. Then all variants ending in "." can be grouped
      // B. Then all variants ending in "#" (which is only 1, right?) can be grouped
      // We can calculate only 1 option out of group A for follow-up options
      // And multiply it to the number of variants for "rest" to get a tally
      const option = current + (".".repeat(offset) + "#".repeat(next))
      if (!isStillPossible(currentLength, option)) continue
      result += countVariations(length, option, index + 1)
    }
    return result
  }

  return countVariations(pattern.length, "", 0)
}

const part1 = data.map(line => countOptions(line.pattern, line.nrs)).reduce(add, 0)
const part2 = data
  .map(x => ({
    pattern: [x.pattern, x.pattern, x.pattern, x.pattern, x.pattern].join("?"),
    nrs: [...x.nrs, ...x.nrs, ...x.nrs, ...x.nrs, ...x.nrs] }))
  .map((x, idx) => {
    const start = new Date().getTime()
    const result = countOptions(x.pattern, x.nrs)
    const end = new Date().getTime()
    console.log(`Line ${idx + 1} took ${((end-start)/1000).toFixed(3)} seconds`);
    return result
  })
  .reduce(add, 0)

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
