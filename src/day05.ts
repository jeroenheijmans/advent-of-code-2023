import {start, finish} from './util.ts'
start(5)

let input = `
seeds: 79 14

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`

input = Deno.readTextFileSync("./src/inputs/day05.txt");

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

const seeds = data[0].replace("seeds: ", "").split(" ").map(x => parseInt(x.trim()))

interface Range {
  target: number;
  source: number;
  length: number;
  end: number;
  diff: number;
}

interface Map {
  from: string;
  to: string;
  ranges: Range[];
}

const maps: Map[] = [];
let current: Map = {from: "", to: "", ranges: []};

data.slice(1).forEach(line => {
  if (!line) return
  if (line.includes("-to-")) {
    const [from, to] = line.replace("map:", "").trim().split("-to-")
    current = {from, to, ranges: []}
    maps.push(current)
  }
  if (line.match(/\d/)) {
    const [target, source, length] = line.split(" ").map(x => parseInt(x))
    current.ranges.push({target, source, length, end: source + length, diff: target - source })
  }
})

const items = seeds.map(nr => ({type: "seed", nr: nr}))

while (items.some(i => i.type !== "location")) {
  items.forEach((item, idx) => {
    let map = maps.find(m => m.from === item.type) as Map;
    let range = map.ranges.find(m => item.nr >= m.source && item.nr <= m.end);
    if (range) items[idx].nr = item.nr + range.diff;
    items[idx].type = map.to;
  })
}

const part1 = Math.min(...items.map(i => i.nr))

interface Slice {
  type: string;
  from: number;
  to: number;
  count: number;
}

let slices: Slice[] = [];

for (let i = 0; i < seeds.length; i += 2) {
  slices.push({
    type: "seed",
    from: seeds[i],
    to: seeds[i] + seeds[i + 1] - 1,
    count: seeds[i + 1],
  })
}

while (slices.some(s => s.type !== "location")) {
  let newSlices: Slice[] = [];

  slices.forEach((slice, idx) => {
    // console.log("Considering", slice)

    let map = maps.find(m => m.from === slice.type) as Map;
    let loRange = map.ranges.find(r => slice.from >= r.source && slice.from <= r.end);
    let hiRange = map.ranges.find(r => slice.to >= r.source && slice.from <= r.end);

    slice.type = map.to;

    if (loRange && loRange === hiRange) {
      slice.from = slice.from + loRange.diff;
      slice.to = slice.to + loRange.diff;
      newSlices.push(slice);
    }

    else if (loRange && !hiRange) {
      newSlices.push({
        from: slice.from + loRange.diff,
        to: loRange.end,
        type: map.to,
        count: loRange.end - slice.from - loRange.diff,
      })
      newSlices.push({
        from: loRange.end + 1,
        to: slice.to,
        type: map.to,
        count: slice.to - loRange.end - 1,
      })
    }

    else if (!loRange && hiRange) {
      newSlices.push({
        from: slice.from,
        to: hiRange.target,
        type: map.to,
        count: hiRange.target - slice.from,
      })
      newSlices.push({
        from: hiRange.target,
        to: slice.to + hiRange.diff,
        type: map.to,
        count: slice.to + hiRange.diff - hiRange.target,
      })
    }

    else if (loRange && hiRange) {
      newSlices.push({
        from: slice.from + loRange.diff,
        to: loRange.end,
        type: map.to,
        count: loRange.end - slice.from - loRange.diff,
      })
      newSlices.push({
        from: loRange.end + 1,
        to: hiRange.target - 1,
        type: map.to,
        count: (hiRange.target - 1) - (loRange.end + 1),
      })
      newSlices.push({
        from: hiRange.target,
        to: slice.to + hiRange.diff,
        type: map.to,
        count: slice.to + hiRange.diff - hiRange.target,
      })
    }

    else if (!loRange && !hiRange) {
      newSlices.push(slice);
    }

    else {
      throw "Unexpected situation";
    }
    
  })

  slices = newSlices
}

// console.log(slices);

const part2 = Math.min(...slices.map(s => s.from))

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
