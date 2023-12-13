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
  for (let i = 0; i < pattern.length - 1; i++) {
    let same = true
    for (let y1 = i, y2 = i + 1; y1 >= 0 && y2 < pattern.length; y1--, y2++) {
      if (pattern[y1] !== pattern[y2]) {
        same = false;
        break;
      }
    }
    if (same) return i + 1
  }
  return 0
}

function transpose(pattern: string[]) {
  return pattern.reduce((result, line) => {
    line.split("").forEach((char, index) => { result[index] += char; })
    return result;
  }, pattern[0].split("").map(_ => ""))
}

const part1Mirrors = patterns
  .map(pattern => {
    const normal = getMirrorIndex(pattern);
    if (normal) return { result: normal, type: 'normal', factor: 100 }
    return { result: getMirrorIndex(transpose(pattern)), type: 'transposed', factor: 1 }
  })

const part1 = part1Mirrors
  .map(patternAnswer => patternAnswer.result * patternAnswer.factor)
  .reduce(add, 0)

const part2 = 0 // patterns
//   .map((pattern, idx) => {
//     for (let y = 0; y < pattern.length; y++) {
//       for (let x = 0; x < pattern[0].length; x++) {
//         const fixedPattern = JSON.parse(JSON.stringify(pattern)) as string[]
//         fixedPattern[y] = fixedPattern[y].replaceAt(x, fixedPattern[y][x] === "#" ? "." : "#")

//         const normalResult = getMirrorIndex(fixedPattern)

//         if (normalResult) {
//           if (normalResult !== part1Mirrors[idx].result) {
//             // console.log("Found! Normal", normalResult, "at", x, ",", y)
//             // console.log(fixedPattern)
//             return normalResult
//           }
//         }
//       }
//     }

//     const transposedPattern = transpose(pattern)

//     for (let y = 0; y < transposedPattern.length; y++) {
//       for (let x = 0; x < transposedPattern[0].length; x++) {
//         const fixedPattern = JSON.parse(JSON.stringify(transposedPattern)) as string[]
//         fixedPattern[y] = fixedPattern[y].replaceAt(x, fixedPattern[y][x] === "#" ? "." : "#")

//         const transposedResult = getMirrorIndex(fixedPattern)
//         // console.log("Transposed result = ", transposedResult)
//         if (transposedResult) {
//           if (transposedResult !== part1Mirrors[idx].result) {
//             // console.log("Found! Transposed", transposedResult, "at row", y, "column", x)
//             // console.log(fixedPattern)
//             return transposedResult * 100
//           }
//         }
//       }
//     }
//     // console.log(idx)
//     // console.log()
//     // console.log(part1Mirrors[idx])
//     // console.log()
//     // transposedPattern.forEach(l => console.log(l))
//     // console.log()
//     // pattern.forEach(l => console.log(l))
//     throw "Unexpectedly found no smudge that would fix things"
//   })
//   .reduce(add, 0)

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
