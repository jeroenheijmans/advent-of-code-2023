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
  let nrX = 0;

  line.split("").forEach((char, x) => {
    if (char === ".") {
      if (nr) {
        const key = `${nrX};${y}`;
        objects[key] = {nr, x: nrX, y, char: ""};
      }
      nr = "";
      return;
    }

    if (char.match(/[0-9]/)) {
      if (!nr) nrX = x;
      nr = `${nr}${char}`;
      return;
    }

    const key = `${x};${y}`;
    objects[key] = {nr, x, y, char};
    nr = "";
  })

  if (nr) {
    const key = `${nrX};${y}`;
    objects[key] = {nr, x: nrX, y};
    nr = "";
  }
})

const relevant = new Set();

for(const [key, val] of Object.entries(objects)) {
  if (val.nr.match(/[0-9]/)) {
    for (let dx = -1; dx < val.nr.length + 1; dx++) {
      for (let dy = -1; dy < 2; dy++) {
        const targetKey = `${val.x + dx};${val.y + dy}`;
        if (objects[targetKey] && objects[targetKey].char) {
          relevant.add(val);
        }
      }
    }
  }
}

const part1 = [...relevant].map(x => parseInt(x.nr)).reduce(add, 0);

const relevant2 = new Set();

const part2 = Object.values(objects)
  .filter(o => o.char === "*")
  .map(o => ({
    gear: o,
    parts: Object.values(objects).filter(val => !val.char).filter(val => {
      for (let dx = -1; dx < val.nr.length + 1; dx++) {
        for (let dy = -1; dy < 2; dy++) {
          if (val.x + dx === o.x && val.y + dy === o.y) return true;
        }
      }
      return false;
    })
  }))
  .filter(x => x.parts.length === 2)
  .map(x => parseInt(x.parts[0].nr) * parseInt(x.parts[1].nr))
  .reduce(add, 0)
;

console.log("Part 1:", part1);
console.log("Part 2:", part2);

finish();
