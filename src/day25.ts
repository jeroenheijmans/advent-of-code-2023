import {startDay, finishDay, multiply} from './util.ts'
startDay(25)

let input = `
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`

// input = Deno.readTextFileSync("./src/inputs/day25.txt")

const connections = new Set<string>()

input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split(": "))
  .forEach(([source, targets]) => {
    targets.split(" ").forEach(target => {
      source < target ? connections.add(`${source} ${target}`) : connections.add(`${target} ${source}`)
    })
  })

function getGroups() {
  const wires = [...connections]
  for (let i = 0; i < wires.length; i++) {
    console.log("Working on group", i, "out of", wires.length)
    for (let j = i + 1; j < wires.length; j++) {
      console.log("  Working on subgroup", j, "out of", wires.length, `at ${new Date().toTimeString()}`)
      for (let k = j + 1; k < wires.length; k++) {
        // console.log("    Working on sub-subgroup", k, "out of", wires.length)
        const eliminated = [wires[i], wires[j], wires[k]]
        const candidate = wires.slice().filter(w => !eliminated.includes(w))

        const groups = [] as Set<string>[]
        while (candidate.length > 0) {
          const next = candidate.pop()
          const [part1, part2] = next!.split(" ")
          const myGroups = groups.filter(g => g.has(part1) || g.has(part2))

          if (myGroups.length > 1) {
            groups.splice(groups.indexOf(myGroups[0]), 1)
            myGroups[0].forEach(i => myGroups[1].add(i))
            myGroups[1].add(part1)
            myGroups[1].add(part2)
          } else if (myGroups.length === 1) {
            myGroups[0].add(part1)
            myGroups[0].add(part2)
          } else {
            groups.push(new Set([part1, part2]))
          }
        }

        if (groups.length === 2) return groups
      }
    }
  }
}

const part1 = getGroups()?.map(g => g.size).reduce(multiply, 1)

console.log("Part 1:", part1)
console.log("Part 2:", "?")

finishDay()
