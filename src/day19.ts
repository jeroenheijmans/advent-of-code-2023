import {startDay, finishDay, isString, add} from './util.ts'
startDay(19)

let input = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`

input = Deno.readTextFileSync("./src/inputs/day19.txt")

interface Rule {
  key?: "x"|"m"|"a"|"s"
  sign?: string
  value?: number
  target: string
}

interface Workflow {
  name: string
  rules: Rule[]
}

const [workflowsData, partsData] = input
  .trim()
  .split(/\r?\n\r?\n/)
  .map(section => section.split(/\r?\n/))

const workflows = workflowsData
  .map(line => ({
    name: line.split("{")[0],
    rules: line
      .replaceAll("}", "")
      .split("{")[1]
      .split(",")
      .map(r => r.includes(":")
        // Rule with comparison:
        ? {
          key: r[0],
          sign: r[1],
          value: parseInt(r.substring(2, r.indexOf(":"))),
          target: r.substring(r.indexOf(":") + 1),
        }
        // Fallback rule with only a target:
        : {
          target: r,
        }
      ),
  }))

const lookup = workflows.reduce((result, rule) => {
  result[rule.name] = rule
  return result
}, {} as Record<string, Workflow>)

type Part = Record<string, number>

const parts = partsData
  .map(line => line
    .replaceAll(/[{}]/g, "")
    .split(",")
    .map(x => x.split("="))
    .reduce((result, next) => {
      result[next[0]] = parseInt(next[1])
      return result
    }, {} as Part)
  )

let part1 = 0

parts.forEach(part => {
  let location = "in"
  while (location !== "A" && location !== "R") {
    for (const rule of lookup[location].rules) {
      if (!rule.key || !rule.value) {
        location = rule.target
      } else {
        const value = part[rule.key]
        if (rule.sign === "<" && value < rule.value) { location = rule.target; break; }
        if (rule.sign === ">" && value > rule.value) { location = rule.target ; break; }
      }
    }
  }
  if (location === "A") {
    part1 += part.x + part.m + part.a + part.s
  }
})

interface Xmas {
  location: string
  x: number[]
  m: number[]
  a: number[]
  s: number[]
}

const start: Xmas = {
  location: "in",
  x: [...Array(4000).keys()].map(i => i + 1),
  m: [...Array(4000).keys()].map(i => i + 1),
  a: [...Array(4000).keys()].map(i => i + 1),
  s: [...Array(4000).keys()].map(i => i + 1),
}

const accepted: Xmas[] = []
let current = [start]

while (current.length > 0) {
  const newList: Xmas[] = []

  current.forEach(xmas => {
    if (xmas.location === "A") {
      accepted.push(xmas)
      return
    }

    if (xmas.location === "R") {
      return
    }

    const wf = lookup[xmas.location]!

    for (const rule of wf.rules) {
      if (!rule.key || !rule.value) {
        xmas.location = rule.target
        newList.push(xmas)
      } else {
        const xmasClone = {
          location: rule.target,
          x: [...xmas.x],
          m: [...xmas.m],
          a: [...xmas.a],
          s: [...xmas.s],
        }

        if (rule.sign === "<") {
          xmasClone[rule.key] = xmas[rule.key].filter(n => n < rule.value)
          xmas[rule.key] = xmas[rule.key].filter(n => n >= rule.value)
        }
        else
        if (rule.sign === ">") {
          xmasClone[rule.key] = xmas[rule.key].filter(n => n > rule.value)
          xmas[rule.key] = xmas[rule.key].filter(n => n <= rule.value)
        }

        newList.push(xmasClone)
      }
    }

  })

  current = newList
}

const part2 = accepted
  .map(xmas => xmas.x.length * xmas.m.length * xmas.a.length * xmas.s.length)
  .reduce(add, 0)

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
