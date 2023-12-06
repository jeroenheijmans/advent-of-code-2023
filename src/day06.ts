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
  .map(x => x.split(/\s+/g).map(n => parseInt(n)))

const [times, targets] = data;

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
const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
