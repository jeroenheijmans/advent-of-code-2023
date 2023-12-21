import {startDay, finishDay, isString} from './util.ts'
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

// input = Deno.readTextFileSync("./src/inputs/day19.txt")

interface Rule {
  key?: string
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

const part2 = 0 // [rules, parts]

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
