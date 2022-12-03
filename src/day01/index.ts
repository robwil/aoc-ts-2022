import run from "aocrunner";
import Heap from "heap";

const parseInput = (rawInput: string) => rawInput;

const solve = (rawInput: string) => {
  // part 1
  const lines = rawInput.split("\n");
  let currentSum = 0;
  let maxSum = 0;
  const maxHeap = new Heap((a: number, b: number) => b - a);
  for (const line of lines) {
    if (line === "") {
      if (currentSum > maxSum) {
        maxSum = currentSum;
      }
      maxHeap.push(currentSum);
      currentSum = 0;
    } else {
      const current = Number(line);
      currentSum += current;
    }
  }
  if (currentSum > maxSum) {
    maxSum = currentSum;
  }
  maxHeap.push(currentSum);
  const part1 = maxSum;

  // part 2: get top 3 from heap and add them together
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const part2 = maxHeap.pop()! + maxHeap.pop()! + maxHeap.pop()!;
  return { part1, part2 };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return solve(input).part1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return solve(input).part2;
};

const exampleInput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
