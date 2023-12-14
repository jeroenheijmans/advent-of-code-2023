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

// input = Deno.readTextFileSync("./src/inputs/day12.txt")
// input = '???.#?????????????? 1,8,4'
// input = `???????????????? 1,3,1,1,1`

interface Group {
  symbol: string
  count: number
}

interface Entry {
  groups: Group[]
  nrs: number[]
}

function chunkByCharacter(line: string) {
  return line.split("").reduce((result, symbol) => {
    const current = result.at(-1)
    if (!current || current.symbol !== symbol)
      result.push({ symbol, count: 1 })
    else
      current.count++
    return result
  }, [] as Group[])
}

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(x => x.split(" "))
  .map(([line, nrs]) => ({
    groups: chunkByCharacter(line),
    nrs: nrs.split(",").map(n => parseInt(n))
  }))

function countNumberOfArrangements(entry: Entry): number {
  console.log(entry)
  return 0
}

const part1 = data
  .map((entry, index) => {
    const started = new Date().getTime()
    const result = countNumberOfArrangements(entry)
    const ended = new Date().getTime()
    console.log(`Line ${index} ran in ${ended - started}ms`)
    return result
  })
  .reduce(add, 0)

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
