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

interface Module {
  type: string,
  name: string,
  targets: Module[],
  targetKeys: string[],
  signal: boolean,
  memories: Record<string, boolean>,
}

const modules = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split(" -> "))
  .map(([module, targets]) => ({
    type: module.startsWith("%") ? "flip" : module.startsWith("&") ? "conjunction" : "normal",
    name: module.replace("%", "").replace("&", ""),
    targets: [],
    targetKeys: targets.split(", "),
    signal: false,
    memories: {},
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
    type: "untyped",
    name,
    targets: [],
    targetKeys: [],
    signal: false,
    memories: {},
  }
  modules.push(module)
  lookup[name] = module
}
const outputModules = [...outputNames].toSorted().map(k => lookup[k])

modules.forEach(m => m.targets = m.targetKeys.map(key => lookup[key]))
modules
  .filter(m => m.type === "conjunction")
  .forEach(m => m.memories = modules
      .filter(other => other.targetKeys.includes(m.name))
      .reduce((result, next) => {
        result[next.name] = false
        return result
      }, {} as Record<string, boolean>))

interface Pulse {
  from: string,
  target: Module
  value: boolean,
}

const max = 1e3
const broadcaster = lookup["broadcaster"]
const debug = max < 5
  ? (message: string) => console.log(message)
  : (_: string) => { }

let lows = 0
let highs = 0

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
      case "normal":
        module.targets.forEach(target => pulses.push({ from, target, value: pulse.value }))
        break
      case "flip":
        if (!pulse.value) {
          module.signal = !module.signal
          module.targets.forEach(target => pulses.push({ from, target, value: module.signal }))
        }
        break
      case "conjunction":
        {
          module.memories[pulse.from] = pulse.value
          const value = !Object.values(module.memories).every(v => v)
          module.targets.forEach(target => pulses.push({ from, target, value }))
        }
        break
      case "untyped":
      default:
        break
    }
  }

  console.log(
    modules.map(m => m.signal ? "#" : " ").join("")
  )
}

const part1 = lows * highs

const part2 = 0 // lookup

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
