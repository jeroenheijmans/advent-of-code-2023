import {startDay, finishDay, add} from './util.ts'
startDay(15)

// const input = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'
const input = Deno.readTextFileSync("./src/inputs/day15.txt")

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
  }))
  .map(entry => ({
    ...entry,
    part1HASH: HASH(entry.line),
    part2HASH: HASH(entry.label),
  }))

const part1 = data
  .map(e => e.part1HASH)
  .reduce(add, 0)

const boxes = [...Array(256).keys()].map(_ => ([] as (string|number|null)[][]))

data.forEach(entry => {
  const box = boxes[entry.part2HASH]
  const item = box.find(b => b[0] === entry.label)

  if (entry.symbol === "=") {
    if (item) item[1] = entry.nr
    else box.push([entry.label, entry.nr])
  } else {
    boxes[entry.part2HASH] = box.filter(i => i[0] !== entry.label)
  }
})

const part2 = boxes
  .map((box, index) => ({
    fullNr: (index + 1),
    parts: box.map((item, index2) => ({ slotNr: index2 + 1, focalLength: item[1] as number }))
  }))
  .filter(i => i.parts.length > 0)
  .map(box => box.parts.map(p => box.fullNr * p.slotNr * p.focalLength).reduce(add, 0))
  .reduce(add, 0)

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
