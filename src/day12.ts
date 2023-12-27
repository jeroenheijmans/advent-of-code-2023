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

// input = `
// ????????? 2,3
// `

input = Deno.readTextFileSync("./src/inputs/day12.txt")
// input = await Bun.file("./src/inputs/day12.txt").text()

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

  const length = pattern.length
  const maxIndex = nrs.length
  const minLengthForRestAtIndex = [] as number[]
  for (let n = 0; n < maxIndex; n++) {
    minLengthForRestAtIndex[n] = 0
    for (let i = n + 1; i < maxIndex; i++) {
      minLengthForRestAtIndex[n] += nrs[i] + 1
    }
  }

  function countVariations(current: string, index: number) {
    if (index === maxIndex) {
      const option = current.padEnd(length, ".")
      if (!isStillPossible(current.length, option)) return 0
      // console.log(option)
      return 1
    }

    const currentLength = current.length
    const next = nrs[index]

    const leftOverLength = length - currentLength
    const maxLengthForNext = leftOverLength - minLengthForRestAtIndex[index]
    const maxOffset = maxLengthForNext - next
    const isLastNr = index === maxIndex - 1

    let result = 0
    const baseText = "#".repeat(next)
    let offsetText = ""
    for (let offset = 0; offset <= maxOffset; offset++) {
      let option = current + offsetText + baseText
      offsetText += "."
      if (!isLastNr) option += "."
      if (!isStillPossible(currentLength, option)) continue
      result += countVariations(option, index + 1)
    }
    return result
  }

  return countVariations("", 0)
}

const part1 = data.map(line => countOptions(line.pattern, line.nrs)).reduce(add, 0)

console.log("Part 1:", part1)

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

console.log("Part 2:", part2)

finishDay()
