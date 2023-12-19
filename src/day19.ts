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

input = Deno.readTextFileSync("./src/inputs/day19.txt")

const [rulesData, partsData] = input
  .trim()
  .split(/\r?\n\r?\n/)
  .map(section => section.split(/\r?\n/))

const rules = rulesData
  .map(line => line.replaceAll("}", ""))
  .map(line => ({
    name: line.split("{")[0],
    rules: line
      .split("{")[1]
      .split(",")
      .map(r => r.includes(":") ? ({
        key: r[0],
        sign: r[1],
        value: parseInt(r.substring(2, r.indexOf(":"))),
        target: r.substring(r.indexOf(":") + 1)
      }) : r),
  }))

const lookup = rules.reduce((result, rule) => {
  result[rule.name] = rule
  return result
}, {} as any)

type PartKey = "x"|"m"|"a"|"s"
type Part = Record<PartKey, number>

let parts = partsData
  .map(line => line
    .replaceAll(/[{}]/g, "")
    .split(",")
    .map(x => x.split("="))
    .reduce((result, next) => {
      result[next[0] as PartKey] = parseInt(next[1])
      return result
    }, {} as Part)
  )

let part1 = 0

parts.forEach(part => {
  let location = "in"
  // console.log("Part", part, "at", location)
  while (location !== "A" && location !== "R") {
    // console.log("At", location)
    const workflow = lookup[location]
    for (const rule of workflow.rules) {
      if (isString(rule)) {
        location = rule
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
