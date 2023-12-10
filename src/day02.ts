import {startDay, finishDay, add} from './util.ts';
startDay(2);

let input = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

input = Deno.readTextFileSync("./src/inputs/day02.txt");

const data = input
  .trim()
  .split(/\r?\n/)
  .map(line => line.replace("Game ", ""))
  .map(line => line.split(": "))
  .map(parts => ({
    id: parseInt(parts[0]),
    sets: parts[1].split(/[,;]/g).map(m => m.trim().split(" ")).map(m => ({
      count: parseInt(m[0]), 
      color: m[1]
    }))
  }))
  ;

const part1 = data
  .filter(game => 
    game.sets.filter(s => s.color === "red").every(s => s.count <= 12)
    && game.sets.filter(s => s.color === "green").every(s => s.count <= 13)
    && game.sets.filter(s => s.color === "blue").every(s => s.count <= 14)
  )
  .map(g => g.id)
  .reduce(add, 0)

const part2 = data
  .map(g =>
    Math.max(0, ...g.sets.filter(s => s.color === "red").map(s => s.count))
    * Math.max(0, ...g.sets.filter(s => s.color === "green").map(s => s.count))
    * Math.max(0, ...g.sets.filter(s => s.color === "blue").map(s => s.count))
  )
  .reduce(add, 0)

console.log("Part 1:", part1);
console.log("Part 2:", part2);

finishDay();
