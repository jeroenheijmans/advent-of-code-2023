import {start, finish, add} from './util.ts';
start(4);

let input = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;

input = Deno.readTextFileSync("./src/inputs/day04.txt");

interface ICard {
  id: number;
  mine: number[];
  winners: number[];
}

const cards = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(x => { 
    const parts = x.replace("Card ", "").split(/[|:]/g);
    return {
      id: parseInt(parts[0]),
      mine: parts[1].trim().split(" ").map(n => parseInt(n)),
      winners: parts[2].trim().split(/\s+/g).map(n => parseInt(n)),
    } as ICard;
   })
  ;

const part1 = cards
  .map(c => c.mine.filter(n => c.winners.includes(n)).length)
  .map(count => count === 0 ? 0 : parseInt(`1${"0".repeat(count - 1)}`, 2))
  .reduce(add, 0)


const part2 = 0;

console.log("Part 1:", part1);
console.log("Part 2:", part2);

finish();
