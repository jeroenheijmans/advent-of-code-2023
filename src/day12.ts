import {startDay, finishDay} from './util.ts'
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

const part1 = data

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
