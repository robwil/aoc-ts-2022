import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let lines = input.split("\n");
  let totalScore = 0;
  for (const line of lines) {
    const charCodes = line
      .split("")
      .map((chr) => chr.charCodeAt(0))
      .map((chr) => (chr >= 97 ? chr - 96 : chr - 38));
    const seen = new Map<number, boolean>();
    for (let i = 0; i < charCodes.length; i++) {
      if (i >= charCodes.length / 2 && seen.has(charCodes[i])) {
        totalScore += charCodes[i];
        break;
      }
      if (i < charCodes.length / 2) {
        seen.set(charCodes[i], true);
      }
    }
  }
  return totalScore;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let totalScore = 0;
  let previousLines: number[][] = [];
  for (const line of lines) {
    const charCodes = line
      .split("")
      .map((chr) => chr.charCodeAt(0))
      .map((chr) => (chr >= 97 ? chr - 96 : chr - 38));
    previousLines.push(charCodes);
    if (previousLines.length === 3) {
      const seen1 = new Map<number, boolean>();
      const seen2 = new Map<number, boolean>();
      previousLines[0].forEach((chr) => seen1.set(chr, true));
      previousLines[1].forEach((chr) => seen2.set(chr, true));
      for (let i = 0; i < previousLines[2].length; i++) {
        const chr = previousLines[2][i];
        if (seen1.has(chr) && seen2.has(chr)) {
          totalScore += chr;
          break;
        }
      }
      previousLines = [];
    }
  }
  return totalScore;
};

const exampleInput = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
