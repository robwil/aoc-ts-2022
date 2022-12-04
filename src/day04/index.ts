import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sections = input
    .split("\n")
    .map((line) =>
      line
        .split(",")
        .map((piece) => piece.split("-").map((str) => parseInt(str, 10))),
    );
  let total = 0;
  for (const section of sections) {
    if (
      (section[0][0] <= section[1][0] && section[0][1] >= section[1][1]) ||
      (section[1][0] <= section[0][0] && section[1][1] >= section[0][1])
    ) {
      total++;
    }
  }
  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sections = input
    .split("\n")
    .map((line) =>
      line
        .split(",")
        .map((piece) => piece.split("-").map((str) => parseInt(str, 10))),
    );
  let total = 0;
  for (const section of sections) {
    if (
      _.intersection(
        _.range(section[0][0], section[0][1] + 1),
        _.range(section[1][0], section[1][1] + 1),
      ).length > 0
    ) {
      total++;
    }
  }
  return total;
};

const exampleInput = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
