import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const solve = (rawInput: string) => {
  const lines = rawInput.split('\n');
  for (const line of lines) {
    ; // do something
  }
  let part1 = 0;
  let part2 = 0;
  return {
    part1,
    part2,
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return solve(input).part1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return solve(input).part2;
};

const exampleInput = `
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: "",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
