let timeout: number;

export function start(maxRunTime = 5000) {
  console.log(`Advent of Code ${Deno.mainModule} solution at ${new Date().toISOString().replace("T", ", ")}`);
  timeout = setTimeout(() => { throw Error(`Script timed out after ${maxRunTime}ms!`); }, maxRunTime);
}

export function finish() {
  clearTimeout(timeout);
}

export function add(a: number, b: number) {
  return a + b;
}
