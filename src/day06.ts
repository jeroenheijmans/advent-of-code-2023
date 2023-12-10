import {root, finish, multiply} from './util.ts'
root(6)

let input = `
Time:      7  15   30
Distance:  9  40  200
`

input = Deno.readTextFileSync("./src/inputs/day06.txt")

/*
 *  Right from the start it was clear that there was
 *  a somewhat simple math formula to calculate the
 *  result (with some extra programming to handle
 *  clipping to whole numbers).
 *  
 *  Remembering how this bit of math works was more
 *  time for part 1 than just brute forcing it.
 * 
 *  Took a gamble to try and brute force part 2 as
 *  well, and turned out it could be done in <100ms.
 *  Even had some bifurcation optimization ready for
 *  the case it didn't.
 * 
 *  Now I'm leaving my solution as is: I don't want to
 *  refactor based on what Reddit or Wikipedia tells
 *  me what the Math algorithm to solve this is.
 */

const data = input
  .trim()
  .replace("Time:", "")
  .replace("Distance:", "")
  .split(/\r?\n/)
  .map(x => x.trim())
  .filter(x => x)

const [times, targets] = data.map(x => x.split(/\s+/g).map(n => parseInt(n)))

const waysToWin = times.map(_ => 0)

times.forEach((time, index) => {
  const target = targets[index];
  for (let t = 0; t < time; t++) {
    const distance = (time - t) * t
    if (distance > target) waysToWin[index]++
  }
})

const part1 = waysToWin.reduce(multiply, 1)

const time = parseInt(data[0].replace(/\s/g, ""))
const target = parseInt(data[1].replace(/\s/g, ""))

let part2 = 0

for (let t = 0; t < time; t++) {
  const distance = (time - t) * t
  if (distance > target) part2++
}

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
