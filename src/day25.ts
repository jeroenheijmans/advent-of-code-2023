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

input = Deno.readTextFileSync("./src/inputs/day25.txt")

interface Wire {
  key: string
  value: nr
  nodes: string[]
}

const wires: Wire[] = []

input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split(": "))
  .forEach(([source, targets]) => {
    targets.split(" ").forEach(target => {
      const key = source < target ? `${source} ${target}` : `${target} ${source}`
      const nodes = source < target ? [source, target] : [target, source]
      wires.push({ key, value: 0, nodes })
    })
  })

wires.forEach(w => {
  w.value = w.nodes.map(node => wires.filter(w => w.nodes.includes(node)).length)
})

wires.sort((a, b) => b.value - a.value)

function getGroups() {
  for (let i = 0; i < wires.length; i++) {
    console.log("Working on group", i, "out of", wires.length, `at ${new Date().toTimeString().substring(0, 8)}`)
    for (let j = i + 1; j < wires.length; j++) {
      console.log("  Working on subgroup", j, "out of", wires.length, `at ${new Date().toTimeString().substring(0, 8)}`)
      for (let k = j + 1; k < wires.length; k++) {
        // console.log("    Working on sub-subgroup", k, "out of", wires.length)
        const eliminated = [wires[i], wires[j], wires[k]]
        const candidate = wires.filter(w => !eliminated.includes(w))

        const groups = [] as Set<string>[]

        while (candidate.length > 0) {
          const next = candidate.pop()
          const nodes = next!.nodes
          const myGroups = groups.filter(g => g.has(nodes[0]) || g.has(nodes[1]))

          if (myGroups.length > 1) {
            groups.splice(groups.indexOf(myGroups[0]), 1)
            myGroups[0].forEach(i => myGroups[1].add(i))
            myGroups[1].add(nodes[0])
            myGroups[1].add(nodes[1])
          } else if (myGroups.length === 1) {
            myGroups[0].add(nodes[0])
            myGroups[0].add(nodes[1])
          } else {
            groups.push(new Set([nodes[0], nodes[1]]))
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
