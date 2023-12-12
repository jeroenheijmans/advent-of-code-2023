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
input = '???.#?????????????? 1,8,4'

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(x => x.split(" "))
  .map(([marks, nrs]) => ({
    marks,
    nrs: nrs.split(",").map(n => parseInt(n))
  }))

function getIndexesOf(str: string, char: string) {
  const result = []
  for (let i=0; i<str.length; i++) {
    if (str[i] === char) result.push(i)
  }
  return result
}

function isPossible(line: string, nrs: number[]) {
  if (line.includes("?")) throw "Uncompleted line"
  const sizes = line.split(/\.+/g).map(x => x.length).filter(s => s !== 0)
  return sizes.length === nrs.length && sizes.every((nr, i) => nr === nrs[i])
}

function mightStillBePossible(line: string, largest: number) {
  let max = 0, current = 0
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "#" || line[i] ==="?") {
      current++
    } else {
      current = 0
    }
    if (current > max) max = current
  }
  if (current > max) max = current
  // console.log(line, largest, max)
  return largest >= max
}

// console.log(isPossible("##..##.##".split(""), [3,2,2]))
// console.log(isPossible(".#....#...###.".split(""), [1,1,3]))

function getConfigurationsMemoized(line: string, nrs: number[]) {
  const seen = new Set<string>()
  const largest = Math.max(...nrs)
  
  function getConfigurations(line: string, nrs: number[]) {
    let result: string[][] = [];
    const indexes = getIndexesOf(line, "?")
    
    if (indexes.length === 0) {
      const okay = isPossible(line, nrs)
      // console.log("Considering", line.join(""), nrs, okay)
      if (okay) return [line]
      return []
    }
  
    indexes.forEach(idx => {
      [".", "#"].forEach(replacement => {
        const newLine = line.substring(0, idx) + replacement + line.substring(idx + 1)
        if (seen.has(newLine)) return
        seen.add(newLine)
        if (!mightStillBePossible(newLine, largest)) return
        const furtherConfigurations = getConfigurations(newLine, nrs)
        // console.log(replacement, "===>", furtherConfigurations)
        result = result.concat(furtherConfigurations)
      })
    })
  
    return result
  }

  return getConfigurations(line, nrs)
}

const started = new Date().getTime()

const part1 = data
  .map(({marks, nrs}, idx) => {
    const result = getConfigurationsMemoized(marks, nrs)
    const taken = (new Date().getTime() - started)
    console.log(`Line ${idx} after ${Math.trunc(taken / 1000)}s`, ":", marks, ": gave:", result.length)
    return result
  })
  .map(options => options.length)
  .reduce(add, 0)



const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
