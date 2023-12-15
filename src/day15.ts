import {startDay, finishDay, add} from './util.ts'
startDay(15)

let input = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'

input = Deno.readTextFileSync("./src/inputs/day15.txt")

function HASH(line: string) {
  return line.split("").reduce((result, char) => ((result + char.charCodeAt(0)) * 17) % 256, 0)
}

const data = input
  .trim()
  .split(",")
  .map(line => ({
    label: line.split(/[=-]/)[0],
    symbol: line.replaceAll(/[a-z1-9]/g, ""),
    nr: parseInt(line.replaceAll(/[a-z=-]/g, "")) || null,
    line,
    part1HASH: HASH(line),
    part2HASH: HASH(line.split(/[=-]/)[0]),
  }))

const part1 = data
  .map(e => e.part1HASH)
  .reduce(add, 0)

const boxes = [...Array(256).keys()].map(_ => ([] as ({label: string, nr: number|null})[]))

data.forEach(entry => {
  const box = boxes[entry.part2HASH]
  const lens = box.find(b => b.label === entry.label)

  if (entry.symbol === "=") {
    if (lens) lens.nr = entry.nr
    else box.push({ label: entry.label, nr: entry.nr })
  } else {
    boxes[entry.part2HASH] = box.filter(lens => lens.label !== entry.label)
  }
})

const part2 = boxes
  .map((box, boxIdx) => box.map((item, lensIdx) => (boxIdx + 1) * (lensIdx + 1) * (item.nr as number)))
  .flat()
  .reduce(add, 0)

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
