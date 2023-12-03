import {start, finish, add} from './util.ts';
start(3);

let input = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;

input = Deno.readTextFileSync("./src/inputs/day03.txt");

const data = input
  .trim()
  .split(/\r?\n/)
  ;

interface IEntry {
  nr: string;
  x: number;
  y: number;
  char?: string;
}

const objects: IEntry[] = [];

let nr = "";
data.forEach((line, y) => {
  nr = "";
  let nrX = 0;

  line.split("").forEach((char, x) => {
    if (char.match(/[0-9]/)) {
      if (!nr) nrX = x;
      nr = `${nr}${char}`;
      return;
    }

    if (nr) objects.push({nr, x: nrX, y, char: ""});

    nr = "";
    nrX = x;

    if (char === ".") return;

    objects.push({nr, x, y, char});
  })

  if (nr) objects.push({nr, x: nrX, y});
});

function areAdjacent(part1: IEntry, part2: IEntry) {
  for (let dx = -1; dx < part1.nr.length + 1; dx++) {
    for (let dy = -1; dy < 2; dy++) {
      if (part1.x + dx === part2.x && part1.y + dy === part2.y) return true;
    }
  }
  return false;
}

const part1 = objects
  .filter(val => val.nr)
  .filter(val => objects.filter(o => o.char).filter(o => areAdjacent(val, o)).length > 0)
  .map(part => parseInt(part.nr))
  .reduce(add, 0);

const part2 = objects
  .filter(o => o.char === "*")
  .map(gear => objects.filter(val => val.nr).filter(val => areAdjacent(val, gear)))
  .filter(parts => parts.length === 2)
  .map(parts => parseInt(parts[0].nr) * parseInt(parts[1].nr))
  .reduce(add, 0)
;

console.log("Part 1:", part1);
console.log("Part 2:", part2);

finish();
