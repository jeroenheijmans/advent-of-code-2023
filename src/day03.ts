import {start, finish, add} from './util.ts';
start(2);

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

const objects: Record<string, any> = {};

let nr = "";
data.forEach((line, y) => {
  nr = "";

  line.split("").forEach((char, x) => {
    if (char === ".") {
      if (nr) {
        const idx = line.indexOf(nr);
        const key = `${idx};${y}`;
        objects[key] = {nr, x: idx, y, char: ""};
      }
      nr = "";
      return;
    }

    if (char.match(/[0-9]/)) {
      nr = `${nr}${char}`;
      return;
    }

    const key = `${x};${y}`;
    objects[key] = {nr, x, y, char};
    nr = "";
  })

  if (nr) {
    const idx = line.indexOf(nr);
    const key = `${idx};${y}`;
    objects[key] = {nr, x: idx, y};
    nr = "";
  }
})

const relevant = new Set();

for(const [key, val] of Object.entries(objects)) {
  if (val.nr.match(/[0-9]/)) {
    for (let dx = -1; dx < val.nr.length + 1; dx++) {
      for (let dy = -1; dy < 2; dy++) {
        const targetKey = `${val.x + dx};${val.y + dy}`;
        if (objects.hasOwnProperty(targetKey) && objects[targetKey].char) {
          relevant.add(val);
        }
      }
    }
  }
}

const part1 = [...relevant].map(x => parseInt(x.nr)).reduce(add, 0);

const part2 = undefined;

console.log("Part 1:", part1);
console.log("Part 2:", part2);

finish();
