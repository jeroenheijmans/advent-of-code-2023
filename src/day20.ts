import {startDay, finishDay} from './util.ts'
startDay(20)

let input = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`

// "a more interesting example":
input = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`

input = Deno.readTextFileSync("./src/inputs/day20.txt")

type ModuleType = "flip"|"conj"|"norm"|"output"

interface Module {
  type: ModuleType,
  name: string,
  targets: Module[],
  targetKeys: string[],
  signal: boolean,
  memories: Record<string, boolean>,
  depth: number,
}

const modules = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split(" -> "))
  .map(([module, targets]) => ({
    type: module.startsWith("%") ? "flip" : module.startsWith("&") ? "conj" : "norm",
    name: module.replace("%", "").replace("&", ""),
    targets: [],
    targetKeys: targets.split(", "),
    signal: false,
    memories: {},
    depth: 0,
  } as Module))
  // .toSorted((a, b) => a.name.localeCompare(b.name))
  .toSorted((a, b) => {
    const one = a.type.localeCompare(b.type)
    if (one === 0) return a.name.localeCompare(b.name)
    return one
  })

const lookup = modules.reduce((result, next) => {
  result[next.name] = next
  return result
}, {} as Record<string, Module>)

const outputNames = new Set(modules.map(m => m.targetKeys).flat().filter(key => !lookup[key]))
for (const name of outputNames) {
  const module = {
    type: "output" as ModuleType,
    name,
    targets: [],
    targetKeys: [],
    signal: false,
    memories: {},
    depth: 0,
  }
  modules.push(module)
  lookup[name] = module
}
// const outputModules = [...outputNames].toSorted().map(k => lookup[k])

modules.forEach(m => m.targets = m.targetKeys.map(key => lookup[key]))
modules
  .filter(m => m.type === "conj")
  .forEach(m => m.memories = modules
      .filter(other => other.targetKeys.includes(m.name))
      .reduce((result, next) => {
        result[next.name] = false
        return result
      }, {} as Record<string, boolean>))

// Sort for console logging
const visited = new Set<string>()
function setDepthFor(module: Module, depth = 0) {
  module.depth = Math.max(module.depth, depth)
  if (visited.has(module.name)) return
  visited.add(module.name)
  module.targets.forEach(t => setDepthFor(t, depth + 1))
}
setDepthFor(lookup["broadcaster"])
const sortIndexes = {"norm": 0, "flip": 1, "conj": 2, "output": 3}
modules.sort((a, b) => {
  if (a.type !== b.type) return sortIndexes[a.type] - sortIndexes[b.type]
  if (a.depth !== b.depth) a.depth - b.depth
  return a.name.localeCompare(b.name)
})

// Output for mermaid diagrams:
// console.log("%% ---------------------------------------------")
// console.log("%% Paste to: https://mermaid.live/")
// console.log("flowchart TD")
// modules.forEach(m => {
//   let line = `    `
//   if (m.type === "flip") line += `${m.name}{${m.name}}:::${m.type}-.->`
//   else if (m.type === "conj") line += `${m.name}[[${m.name}]]:::${m.type}-->`
//   else if (m.type === "norm") line += `${m.name}:::${m.type}==>`
//   else line += `${m.name}:::${m.type}`
//   line += m.targets.map(t => t.name).join(" & ")
//   console.log(line)
// })
// console.log("    classDef flip fill:#f96")
// console.log("    classDef conj fill:#9fa")
// console.log("    classDef norm fill:#9af")
// console.log("    classDef output fill:#333,color:#ffc")
// console.log("%% ---------------------------------------------")
// console.log()

interface Pulse {
  from: string,
  target: Module
  value: boolean,
}

const max = 1e4
const broadcaster = lookup["broadcaster"]
const debug = max < 5
  ? (message: string) => console.log(message)
  : (_: string) => { }

let lows = 0
let highs = 0

const previouses: Record<string, number> = {}
const results: Record<string, number> = {}

for (let i = 0; i < max; i++) {
  debug("Button press " + i)
  lows++
  const pulses = broadcaster.targets.map(target => ({ from: "broadcaster", target, value: false }))

  while (pulses.length > 0) {
    const pulse = pulses.shift() as Pulse

    if (pulse.value === false) lows++
    if (pulse.value === true) highs++

    if (pulse.target.name === "rx" && pulse.value === false) {
      console.log("Part 2 is...", i + 1)
      break
    }
    
    debug(`Processing pulse from [${pulse.from}] -[${pulse.value}] to [${pulse.target.name}]`)

    const module = pulse.target
    const from = module.name

    switch (module.type) {
      case "norm":
        module.targets.forEach(target => pulses.push({ from, target, value: pulse.value }))
        break
      case "flip":
        if (!pulse.value) {
          module.signal = !module.signal
          module.targets.forEach(target => pulses.push({ from, target, value: module.signal }))
        }
        break
      case "conj":
        {
          module.memories[pulse.from] = pulse.value
          const value = !Object.values(module.memories).every(v => v)
          if (!value) {
            if (!previouses[module.name]) previouses[module.name] = i
            else results[module.name] = i - previouses[module.name]
          }
          module.targets.forEach(target => pulses.push({ from, target, value }))
        }
        break
      case "output":
      default:
        break
    }
  }
}

const part1 = lows * highs

const part2 = results["gp"] * results["jn"] * results["jl"] * results["fb"]

console.log("Part 1:", part1)
console.log("Part 2:", part2, "(Warning: not generalized, I manually found the relevant nodes)")

finishDay()
