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
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(x => x.split(" "))
  .map(([marks, nrs]) => ({
    marks: marks.split(""),
    nrs: nrs.split(",").map(n => parseInt(n))
  }))

function getIndexesOf(str: unknown[], char: string) {
  const result = []
  for (let i=0; i<str.length; i++) {
    if (str[i] === char) result.push(i)
  }
  return result
}

function isPossible(line: string[], nrs: number[]) {
  if (line.find(c => c === "?")) throw "Uncompleted line"
  const sizes = line.join("").split(/\.+/g).map(x => x.length).filter(s => s !== 0)
  return sizes.length === nrs.length && sizes.every((nr, i) => nr === nrs[i])
}

// console.log(isPossible("##..##.##".split(""), [3,2,2]))
// console.log(isPossible(".#....#...###.".split(""), [1,1,3]))

function getConfigurationsMemoized(line: string[], nrs: number[]) {
  const seen = new Set<string>()
  
  function getConfigurations(line: string[], nrs: number[]) {
    
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
        const newLine = line.slice(0)
        newLine[idx] = replacement
        const textual = newLine.join()
        if (seen.has(textual)) return
        seen.add(textual)
        const furtherConfigurations = getConfigurations(newLine, nrs)
        // console.log(replacement, "===>", furtherConfigurations)
        result = result.concat(furtherConfigurations)
      })
    })
  
    return result
  }

  return getConfigurations(line, nrs)
}



const part1 = data
  .map(({marks, nrs}) => {
    console.log("Doing line", marks.join(""))
    return getConfigurationsMemoized(marks, nrs)
  })
  .map(options => options.length)
  .reduce(add, 0)



const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
