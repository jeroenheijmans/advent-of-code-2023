import {start, finish, multiply} from './util.ts'
start(6)

let input = `
Time:      7  15   30
Distance:  9  40  200
`

input = Deno.readTextFileSync("./src/inputs/day06.txt")

const data = input
  .trim()
  .replace("Time:", "")
  .replace("Distance:", "")
  .split(/\r?\n/)
  .map(x => x.trim())
  .filter(x => x)

const [times, targets] = data.map(x => x.split(/\s+/g).map(n => parseInt(n)));

const waysToWin: number[] = []

times.forEach((time, idx) => {
  waysToWin.push(0);
  const target = targets[idx];

  for (let t = 0; t < time; t++) {
    const dist = (time - t) * t;
    if (dist > target) waysToWin[idx]++;
  }
})

const part1 = waysToWin.reduce(multiply, 1);

const time = parseInt(data[0].replace(/\s/g, ""))
const dist = parseInt(data[1].replace(/\s/g, ""))

const target = dist
let part2 = 0

for (let t = 0; t < time; t++) {
  const dist = (time - t) * t
  if (dist > target) part2++
}

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
