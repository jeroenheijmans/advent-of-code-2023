import {start, finish, add} from './util.ts'
start(7)

let input = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`

input = Deno.readTextFileSync("./src/inputs/day07.txt")

interface IEntry {
  hand: number[];
  bid: number;
  type: number; // 1 = Five of a Kind, etc...
}

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split(" "))
  .map(([hand, bid]) => ({hand, bid}))
  .map(({ hand, bid }) => ({
    hand: hand
      .split("")
      .map(c => c.replace("A", "14").replace("K", "13").replace("Q", "12").replace("J", "11").replace("T", "10"))
      .map(c => parseInt(c)),
    bid: parseInt(bid),
    type: -1,
  }))

function getHandType(hand: number[]) {
  const groups = Object.groupBy(hand, c => c);
  const groupCount = Object.keys(groups).length;
  const parts = Object.values(groups);

  if (groupCount === 1) return 1; // Five of a kind
  if (groupCount === 2) {
    if (parts[0].length === 1 || parts[0].length === 4) return 2; // Four or a kind
    return 3; // Full house
  }
  if (groupCount === 3) {
    if (parts.some(p => p.length === 3)) return 4; // Three of a kind
    return 5; // Two pair
  }
  if (groupCount === 4) {
    return 6; // One pair
  }
  return 7; // High card
}

function handStrengthComparer(a: IEntry, b: IEntry) {
  if (a.type < b.type) return 1;
  if (a.type > b.type) return -1;
  for (let i=0; i<5; i++) {
    if (a.hand[i] > b.hand[i]) return 1;
    if (a.hand[i] < b.hand[i]) return -1;
  }
  return 0;
}

const part1 = data
  .map(entry => ({
    ...entry,
    type: getHandType(entry.hand),
  }))
  .toSorted(handStrengthComparer)
  .map((entry, index) => entry.bid * (index + 1))
  .reduce(add, 0)

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
