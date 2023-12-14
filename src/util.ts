let timeout: number;
let startedAt: Date;

export function startDay(day: number, maxRunTime = 5000) {
  startedAt = new Date();
  console.log(`%cAdvent of Code DAY ${day.toString().padStart(2, "0")}, running at ${startedAt.toLocaleTimeString()}, ${startedAt.toLocaleDateString()}`, 'color: lime');
  timeout = setTimeout(() => { throw Error(`Script timed out after ${maxRunTime}ms!`); }, maxRunTime);
}

export function finishDay() {
  const finishedIn = new Date().getTime() - startedAt.getTime();
  console.log(`%cFinished in ${finishedIn}ms.`, 'color: gray');
  console.log("");
  clearTimeout(timeout);
}

export async function checkTimeout() {
  // Make the process that calls this function switch threads
  // so we allow the start/finish timeout check to run. This
  // is a poor-man's hack to give the `start(...)` setTimeout
  // a chance to run if needed.
  //
  // Might be better to just synchronously check if the script
  // has timed out here, but oh well, this is AoC. :-)
  await new Promise(resolve => setTimeout(resolve));
}

export function add(a: number, b: number) {
  return a + b;
}

export function multiply(a: number, b: number) {
  return a * b;
}

export function naiveReverse(str: string) {
  return str.split("").reverse().join("")
}

declare global {
  interface String {
    replaceAt(index: number, replacement: string): string
    trimCharacter(character: string): string
  }
}

// https://stackoverflow.com/a/55292366/419956 by @JasonLarke
String.prototype.trimCharacter = function(character: string) {
  let start = 0, end = this.length;

  while(start < end && this[start] === character)
      ++start;

  while(end > start && this[end - 1] === character)
      --end;

  return (start > 0 || end < this.length) ? this.substring(start, end) : this as string;
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
