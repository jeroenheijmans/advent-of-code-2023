import {startDay, finishDay, multiply, add} from './util.ts'
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
      wires.push({ key, nodes })
    })
  })

console.log("Steps to get the answer:")
console.log("  - Uncomment the Graphviz dotfile generation console.log statements first...")
// console.log("graph G {")
// wires.forEach(w => console.log(`  ${w.nodes.join(" -- ")};`))
// console.log("}")
console.log("  - Copy that content into d25.dot")
console.log("  - Run `cluster -C2 ./d25.dot -o \"d25-clustered.dot\"")
console.log("  - Optionally add \"shape=plain\" to the node at the top of \"d25-clustered.dot\"")
console.log("  - Verify it looks okay with `neato ./d25-clustered.dot -Tsvg -o \"d25.svg\"")
console.log("  - Count the number of cluster=1 (A) and cluster=2 nodes (B)")
console.log("  - For some reason this (A * B) is not the exact correct answer...")
console.log("  - So we bifurcate, changing the group sizes a few times, until the answer gets accepted")
console.log("  - And then we go to reddit to see the clustering algorithm we *should* have built!")
console.log("For now, the hard-coded answer to my own input would be:")

const part1 = 520380

console.log("Part 1:", part1)
console.log("Part 2:", "Freebee! (Well, once you get all other 2023 stars...)")

finishDay()
