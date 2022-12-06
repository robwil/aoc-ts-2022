import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const chars = input.split("");
  let current: string[] = [];
  let i = 0;
  for (const c of chars) {
    while (current.length > 0 && current.includes(c)) {
      current.shift();
    }
    current.push(c);
    if (current.length === 4) {
      break;
    }
    i++;
  }
  return i + 1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const chars = input.split("");
  let current: string[] = [];
  let i = 0;
  for (const c of chars) {
    while (current.length > 0 && current.includes(c)) {
      current.shift();
    }
    current.push(c);
    if (current.length === 14) {
      break;
    }
    i++;
  }
  return i + 1;
};

const exampleInput = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 7,
      },
      {
        input: "bvwbjplbgvbhsrlpgdmjqwftvncz",
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 19,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
