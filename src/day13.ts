import {startDay, finishDay, naiveReverse, add} from './util.ts'
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

function getMirrorIndex(pattern: string[]) {
  for (let n = 1; n < pattern[0].length - 1; n++) {
    const areAllLinesMirrored = pattern.every(line => {
      const left = naiveReverse(line.substring(0, n))
      const right = line.substring(n)
      return left.indexOf(right) === 0 || right.indexOf(left) === 0
    })
    if (areAllLinesMirrored) return n
  }
  return 0
}

function transpose(pattern: string[]) {
  return pattern.reduce((result, line) => {
    line.split("").forEach((char, index) => { result[index] += char; })
    return result;
  }, pattern[0].split("").map(_ => ""))
}

const part1 = patterns
  .map(pattern =>  getMirrorIndex(pattern) || getMirrorIndex(transpose(pattern)) * 100)
  .reduce(add, 0)

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
