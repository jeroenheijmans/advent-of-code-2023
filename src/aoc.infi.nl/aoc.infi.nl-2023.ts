import {startDay, finishDay} from '../util.ts';
import { wetzls } from './smallest-enclosing-circle.ts';

startDay();

const input = `(44, -28), (-71, -92), (89, 60), (95, 79)
(50, -15), (3, -83), (-88, -56), (56, 86), (-1, 36), (-19, 73)
(-17, 30), (13, 17), (-67, 3)
(88, 98), (-99, 66), (37, 2), (-67, 91), (10, 2)
(-1, -77), (-23, -60), (40, -91), (68, 65), (98, -35)
(-56, 83), (-34, -31), (23, 88), (-2, -5), (-29, 26)
(-18, 36), (52, -16), (36, -20), (9, -90), (64, -24)
(-68, 82), (49, 44), (-57, 89), (3, 49), (-32, 5), (-69, -18), (53, -83)
(-32, 79), (-55, -8), (-86, -70), (77, -94), (41, 40)
(-44, -27), (-12, -45), (87, 0), (-71, -53), (51, -16)
(79, 44), (9, 92), (21, -42), (86, -50), (-47, 98)
(-64, -88), (30, 64), (-29, -39), (66, -46)
(-92, -97), (55, 33), (-70, -39), (-88, 17), (31, -47), (6, -34), (-85, 48)
(1, 83), (-78, 9), (19, -80)
(-14, -11), (90, -64), (-25, 25), (-77, -72), (67, -19)
(9, 10), (75, 88), (76, 61), (-40, -54), (-31, 19)
(-8, 99), (-79, -37), (30, -37)
(-61, -43), (35, 55), (17, 16), (-34, 42), (93, 85)
(-6, 2), (-14, -76), (70, 6), (-63, -76), (12, -93)
(-52, -27), (50, 71), (-14, 97), (91, -85)
(95, 59), (40, 28), (-76, 60)
(93, -41), (22, -67), (68, -26), (59, 74), (-84, 13), (-33, -71)
(-74, 6), (51, -20), (78, -92), (-38, -96), (46, -71)
(51, 78), (73, -9), (35, 62), (57, -100)
(52, -56), (64, 90), (73, -8)`;

const data = input
  .trim()
  .split(/\r?\n/)
  .map(x => x.replaceAll("(", "[").replaceAll(")", "]"))
  .map(x => "[" + x + "]")
  .map(x => JSON.parse(x) as Array<number[]>)
  ;

const part1 = data
  .map(line => line.map(c => Math.sqrt(c[0] * c[0] + c[1] * c[1])))
  .map(radii => Math.max(...radii))
  .reduce((prev, curr) => prev + curr, 0)

const part2 = data
  .map(line => line.map(c => ({x: c[0], y: c[1]})))
  .map(line => ({circle: wetzls(line), points: line}))
  .reduce((prev, data) => {
    // See also: https://codepen.io/jeroenheijmans/pen/ExrdJJL?editors=0010
    // Spit out some planck.js code:
    console.log(`spawnPackage(${JSON.stringify(data.circle)}, ${JSON.stringify(data.points)})`);

    return prev + data.circle.r;
  }, 0)

console.log("Part 1:", Math.trunc(part1));
console.log("Part 2:", Math.trunc(part2));

finishDay();
