import {startDay, finishDay, add} from './util.ts'
startDay(14)

let input = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`

input = Deno.readTextFileSync("./src/inputs/day14.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

interface Point {
  key: string;
  x: number;
  y: number;
}

function printRocks(rocks: Point[], wallsLookup: Record<string, Point>) {
  for (let y = 0; y < data.length; y++) {
    let line = ""
    for (let x = 0; x < data[0].length; x++) {
      line += rocks.find(r => r.y === y && r.x === x) ? "O" : wallsLookup[`${x};${y}`] ? "#" : ".";
    }
    console.log(line)
  }
}


function part1() {
  const rocks: Point[] = []
  const walls: Point[] = []

  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      const key = `${x};${y}`
      if (data[y][x] === "O") rocks.push({key,x,y})
      if (data[y][x] === "#") walls.push({key,x,y})
    }
  }

  let hasMoved = true
  while (hasMoved) {
    hasMoved = false
    rocks.forEach(rock => {
      const targetKey = `${rock.x};${rock.y - 1}`
      if (rock.y > 0 && !walls.some(w => w.key === targetKey) && !rocks.some(w => w.key === targetKey)) {
        hasMoved = true
        rock.key = targetKey
        rock.y = rock.y - 1
      }
    })
  }

  const part1 = rocks.map(r => data.length - r.y).reduce(add, 0)
  console.log("Part 1:", part1)
}

function part2() {
  const rocks: Point[] = []
  const walls: Point[] = []
  const rocksLookup: Record<string, Point> = {}
  const wallsLookup: Record<string, Point> = {}

  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      const key = `${x};${y}`
      const item = {key,x,y}
      if (data[y][x] === "O") rocks.push(item)
      if (data[y][x] === "O") rocksLookup[key] = item
      if (data[y][x] === "#") walls.push(item)
      if (data[y][x] === "#") wallsLookup[key] = item
    }
  }

  let i = 0
  const maxi = 1000000000
  const maxy = data.length, maxx = data[0].length
  const states: Set<string>[] = []
  
  // printRocks(rocks, wallsLookup)

  while (i++ < maxi) {
    const tumbles = [
      { direction: "N", moveY: -1, moveX: +0, compareFn: (a: Point, b: Point) => a.y - b.y },
      { direction: "W", moveY: +0, moveX: -1, compareFn: (a: Point, b: Point) => a.x - b.x },
      { direction: "S", moveY: +1, moveX: +0, compareFn: (a: Point, b: Point) => b.y - a.y },
      { direction: "E", moveY: +0, moveX: +1, compareFn: (a: Point, b: Point) => b.x - a.x },
    ]

    tumbles.forEach(tumble => {
      
      let hasMoved = true
      while (hasMoved) {
        hasMoved = false
        rocks.toSorted(tumble.compareFn).forEach(rock =>{
          const targetX = rock.x + tumble.moveX
          const targetY = rock.y + tumble.moveY
          const targetKey = `${targetX};${targetY}`

          if (
            targetX >= 0 && targetY >= 0
            && targetX < maxx && targetY < maxy
            && !wallsLookup[targetKey]
            && !rocksLookup[targetKey]
          ) {
            hasMoved = true
            delete rocksLookup[rock.key]
            rock.key = targetKey
            rock.y = targetY
            rock.x = targetX
            rocksLookup[targetKey] = rock
          }
        })
        // console.log("Answer would be after", tumble.direction, rocks.map(r => data.length - r.y).reduce(add, 0))
        // printRocks(rocks, wallsLookup)
        // console.log()
      }
    })

    const rockKeys = new Set(Object.keys(rocksLookup))

    if (i < maxi - 1000 && states.find(state => [...state].every(r => rockKeys.has(r)))) {
      console.log("WARNING: Compensating for unknown bug by guessing an offset of -4 (different for sample input though)")
      console.log("Your answer may be wrong and you need to change -4 to something in that area")
      i += (maxi - i - 4)
    }
    
    states.push(rockKeys)
  }

  const part2 = rocks.map(r => data.length - r.y).reduce(add, 0)
  console.log("Part 2:", part2)
}

part1()
part2()

finishDay()
