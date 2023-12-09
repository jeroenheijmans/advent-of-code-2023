import {start, finish} from './util.ts'
start(9)

let input = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`

input = Deno.readTextFileSync("./src/inputs/day09.txt")

const lines = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split(" ").map(n => parseInt(n)))

let part1 = 0

function buildPyramid(line: number[]): number[][] {
  if (line.every(n => n === 0)) return [line]
  const nextLine = []
  for (let i = 1; i < line.length; i++) {
    nextLine.push(line[i] - line[i - 1])
  }
  return [line, ...buildPyramid(nextLine)]
}

// lines.forEach(line => {
//   const pyramid = buildPyramid(line)
//   for (let i = 0; i < pyramid.length; i++) {
//     const index = pyramid.length - i - 1;
//     if (i === 0) {
//       pyramid[index].push(0)
//     } else {
//       const left = pyramid[index + 1].at(-1) || 0;
//       const right = pyramid[index + 1].at(-2) || 0;
//       const base = pyramid[index].at(-1) || 0;
//       const extra = base + Math.abs(left - right)
//       pyramid[index].push(extra)
//       part1 += extra
//     }

//     // console.log(" ".repeat(index * 3) + pyramid[index]
//     //   .map(n => n.toString().padStart(6, " "))
//     //   .join(" ")
//     // )
//   }
//   // console.log("--------------------------------------------------")
//   // console.log()
// })

let part2 = 0

lines.forEach(line => {
  const pyramid = buildPyramid(line)
  for (let i = 0; i < pyramid.length; i++) {
    const index = pyramid.length - i - 1;
    if (i === 0) {
      pyramid[index].unshift(0)
    } else {
      const above = pyramid[index + 1].at(0) || 0
      const base = pyramid[index].at(0) || 0
      const extra = base - above
      pyramid[index].unshift(extra)
    }

    // console.log(" ".repeat(index * 3) + pyramid[index]
    //   .map(n => n.toString().padStart(6, " "))
    //   .join(" ")
    // )
  }

  part2 += pyramid[0][0]
  // console.log("--------------------------------------------------")
  // console.log()
})

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
