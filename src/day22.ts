import {startDay, finishDay, Vector3} from './util.ts'
startDay(22)

let input = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`

input = Deno.readTextFileSync("./src/inputs/day22.txt")

const bricks = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split("~"))
  .map(([from, to]) => ({
    from: from.split(",").map(i => parseInt(i)),
    to: to.split(",").map(i => parseInt(i)),
  }))
  .map(({from, to}) => {
    const cubes = [] as Vector3[]
    for (let x = Math.min(from[0], to[0]); x <= Math.max(from[0], to[0]); x++) {
      for (let y = Math.min(from[1], to[1]); y <= Math.max(from[1], to[1]); y++) {
        for (let z = Math.min(from[2], to[2]); z <= Math.max(from[2], to[2]); z++) {
          cubes.push({x, y, z})
        }
      }
    }
    return cubes
  })


function isSupporting(bottomBrick: Vector3[], topBrick: Vector3[]) {
  return topBrick.some(topCube =>
    bottomBrick.some(bottomCube =>
      bottomCube.x === topCube.x
      &&
      bottomCube.y === topCube.y
      &&
      bottomCube.z === topCube.z - 1)
  )
}

let settled = false
while (!settled) {
  settled = true

  bricks.forEach(brick => {
    if (brick.some(c => c.z === 1)) return

    if (!bricks.some(b => b !== brick && isSupporting(b, brick))) {
      brick.forEach(c => c.z--)
      settled = false
    }
  })
}

// console.log(bricks)

function couldBeDisintigrated(brick: Vector3[]) {
  return bricks.every(other => {
    if (other === brick) return true // it's me!
    if (other.some(c => c.z === 1)) return true // the other is supported by ground
    return bricks.some(b => b !== other && b !== brick && isSupporting(b, other)) // the other is supported by a third brick
  })
}

const part1 = bricks
  .filter(b => couldBeDisintigrated(b))
  .length

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
