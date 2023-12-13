import {startDay, finishDay, add} from './util.ts'
startDay(13)

let input = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`

input = Deno.readTextFileSync("./src/inputs/day13.txt")

const patterns = input
  .trim()
  .split(/\r?\n\r?\n/)
  .map(pattern => pattern.split(/\r?\n/))

function getMirrorNumbers(pattern: string[]) {
  const results = []
  for (let i = 0; i < pattern.length - 1; i++) {
    let same = true
    for (let y1 = i, y2 = i + 1; y1 >= 0 && y2 < pattern.length; y1--, y2++) {
      if (pattern[y1] !== pattern[y2]) {
        same = false;
        break;
      }
    }
    if (same) results.push(i + 1)
  }
  return results
}

function transpose(pattern: string[]) {
  return pattern.reduce((result, line) => {
    line.split("").forEach((char, index) => { result[index] += char; })
    return result;
  }, pattern[0].split("").map(_ => ""))
}

const part1Mirrors = patterns
  .map(pattern => {
    const normal = getMirrorNumbers(pattern);
    if (normal.length > 0) return { result: normal[0], type: 'normal', factor: 100 }
    return { result: getMirrorNumbers(transpose(pattern))[0], type: 'transposed', factor: 1 }
  })

const part1 = part1Mirrors
  .map(patternAnswer => patternAnswer.result * patternAnswer.factor)
  .reduce(add, 0)

const part2 = patterns
  .map((pattern, idx) => {
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[0].length; x++) {
        pattern[y] = pattern[y].replaceAt(x, pattern[y][x] === "#" ? "." : "#") // Flip!
        const result = getMirrorNumbers(pattern).filter(n => part1Mirrors[idx].factor !== 100 || n !== part1Mirrors[idx].result)
        if (result.length > 0) return result[0] * 100;
        pattern[y] = pattern[y].replaceAt(x, pattern[y][x] === "#" ? "." : "#") // Flip back.
      }
    }

    pattern = transpose(pattern)

    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[0].length; x++) {
        pattern[y] = pattern[y].replaceAt(x, pattern[y][x] === "#" ? "." : "#") // Flip!
        const result = getMirrorNumbers(pattern).filter(n => part1Mirrors[idx].factor !== 1 || n !== part1Mirrors[idx].result)
        if (result.length > 0) return result[0] * 1;
        pattern[y] = pattern[y].replaceAt(x, pattern[y][x] === "#" ? "." : "#") // Flip back.
      }
    }

    throw "Unexpectedly found no smudge that would fix things"
  })
  .reduce(add, 0)

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
