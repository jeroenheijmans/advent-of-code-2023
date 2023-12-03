let timeout: number;
let startedAt: Date;

export function start(day: number, maxRunTime = 5000) {
  startedAt = new Date();
  console.log(`%cAdvent of Code DAY ${day.toString().padStart(2, "0")}, running at ${startedAt.toISOString().replace("T", ", ")}`, 'color: lime');
  timeout = setTimeout(() => { throw Error(`Script timed out after ${maxRunTime}ms!`); }, maxRunTime);
}

export function finish() {
  const finishedIn = new Date().getTime() - startedAt.getTime();
  console.log(`%cFinished in ${finishedIn}ms.`, 'color: gray');
  console.log("");
  clearTimeout(timeout);
}

export function add(a: number, b: number) {
  return a + b;
}
