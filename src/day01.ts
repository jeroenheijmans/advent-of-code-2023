import {startDay, finishDay, add} from './util.ts';
startDay(1);

let input = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;

input = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

input = Deno.readTextFileSync("./src/inputs/day01.txt");

function fixInput(line: string): unknown[] {
  if (line.length === 0) return [];

    if (line.startsWith("one"  )) return [1, ...fixInput(line.substring(1))]
    if (line.startsWith("two"  )) return [2, ...fixInput(line.substring(1))]
    if (line.startsWith("three")) return [3, ...fixInput(line.substring(1))]
    if (line.startsWith("four" )) return [4, ...fixInput(line.substring(1))]
    if (line.startsWith("five" )) return [5, ...fixInput(line.substring(1))]
    if (line.startsWith("six"  )) return [6, ...fixInput(line.substring(1))]
    if (line.startsWith("seven")) return [7, ...fixInput(line.substring(1))]
    if (line.startsWith("eight")) return [8, ...fixInput(line.substring(1))]
    if (line.startsWith("nine" )) return [9, ...fixInput(line.substring(1))]
  
    if (line.startsWith("1")) return [1, ...fixInput(line.substring(1))]
    if (line.startsWith("2")) return [2, ...fixInput(line.substring(1))]
    if (line.startsWith("3")) return [3, ...fixInput(line.substring(1))]
    if (line.startsWith("4")) return [4, ...fixInput(line.substring(1))]
    if (line.startsWith("5")) return [5, ...fixInput(line.substring(1))]
    if (line.startsWith("6")) return [6, ...fixInput(line.substring(1))]
    if (line.startsWith("7")) return [7, ...fixInput(line.substring(1))]
    if (line.startsWith("8")) return [8, ...fixInput(line.substring(1))]
    if (line.startsWith("9")) return [9, ...fixInput(line.substring(1))]

    return fixInput(line.substring(1));
}

const data = input
  .trim()
  .split(/\r?\n/)
  ;

const part1 = data
  .map(x => x.replace(/[a-z]/g, ""))
  .map(a => parseInt(`${a[0]}${a[a.length-1]}`))
  .reduce(add, 0);

const part2 = data
  .map(x => fixInput(x))
  .map(x => x.join(""))
  .map(x => x.replace(/[a-z]/g, ""))
  .map(a => parseInt(`${a[0]}${a[a.length-1]}`))
  .reduce(add, 0);

console.log("Part 1:", part1);
console.log("Part 2:", part2);

finishDay();
