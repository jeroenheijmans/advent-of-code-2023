let timeout: number;

export function start(day: number, maxRunTime = 5000) {
  console.log(`%cAdvent of Code DAY ${day.toString().padStart(2, "0")}, running at ${new Date().toISOString().replace("T", ", ")}`, 'color: lime');
  timeout = setTimeout(() => { throw Error(`Script timed out after ${maxRunTime}ms!`); }, maxRunTime);
}

export function finish() {
  console.log("");
  clearTimeout(timeout);
}

export function add(a: number, b: number) {
  return a + b;
}
