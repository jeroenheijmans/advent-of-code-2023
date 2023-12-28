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
  const memoizedResults: Record<string, number> = {}
  const minLengthForRestAtIndex = [] as number[]

  for (let n = 0; n < maxIndex; n++) {
    minLengthForRestAtIndex[n] = 0
    for (let i = n + 1; i < maxIndex; i++) {
      minLengthForRestAtIndex[n] += nrs[i] + 1
    }
  }

  function countVariations(current: string, index: number) {
    if (index === maxIndex) {
      const option = current.padEnd(pattern.length, ".")
      return isStillPossible(current.length, option) ? 1 : 0
    }

    const currentLength = current.length
    const next = nrs[index]
    const leftOverLength = pattern.length - currentLength
    const maxLengthForNext = leftOverLength - minLengthForRestAtIndex[index]
    const maxOffset = maxLengthForNext - next
    const isLastNr = index === maxIndex - 1
    const nextIndex = index + 1
    const baseText = "#".repeat(next)

    let offsetText = ""
    let result = 0

    for (let offset = 0; offset <= maxOffset; offset++) {
      const option = current + offsetText + baseText + (isLastNr ? "" : ".")
      offsetText += "."
      
      if (!isStillPossible(currentLength, option)) continue

      const key = `${nextIndex};${option.length}`
      if (memoizedResults[key] === undefined) {
        memoizedResults[key] = countVariations(option, nextIndex)
      } 
      result += memoizedResults[key]
    }

    return result
  }

  return countVariations("", 0)
}

const part1 = data
  .map(x => countOptions(x.pattern, x.nrs))
  .reduce(add, 0)

const part2 = data
  .map(x => countOptions(
    [x.pattern, x.pattern, x.pattern, x.pattern, x.pattern].join("?"),
    [...x.nrs, ...x.nrs, ...x.nrs, ...x.nrs, ...x.nrs] )
  )
  .reduce(add, 0)

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
