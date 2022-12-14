import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

type Result = -1 | 1 | 0;

const comparePair = (input1: any, input2: any): Result => {
  let i = 0,
    j = 0;
  for (; i < input1.length && j < input2.length; i++, j++) {
    if (Array.isArray(input1[i]) && Array.isArray(input2[j])) {
      const result = comparePair(input1[i], input2[j]);
      if (result !== 0) {
        return result;
      }
    } else if (Array.isArray(input1[i])) {
      const result = comparePair(input1[i], [input2[j]]);
      if (result !== 0) {
        return result;
      }
    } else if (Array.isArray(input2[j])) {
      const result = comparePair([input1[i]], input2[j]);
      if (result !== 0) {
        return result;
      }
    } else if (input1[i] > input2[j]) {
      return 1;
    } else if (input1[i] < input2[j]) {
      return -1;
    }
  }
  if (input1.length === input2.length) {
    return 0;
  }
  if (input1.length < input2.length) {
    return -1;
  }
  return 1;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const pairs = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("[")) {
      continue;
    }
    let value1: any;
    let value2: any;
    eval(`value1 = ${line}; value2 = ${lines[++i]}`);
    pairs.push([value1, value2]);
  }
  let index = 1; // starts at 1
  let sum = 0;
  for (const pair of pairs) {
    // console.log(pair, comparePair(pair));
    if (comparePair(pair[0], pair[1]) === -1) {
      sum += index;
    }
    index++;
  }
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const packets = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("[")) {
      continue;
    }
    let value: any;
    eval(`value = ${line};`);
    packets.push(value);
  }
  packets.push([[2]], [[6]]); // add divider packets
  packets.sort(comparePair);
  // console.log(packets);
  let index = 1; // starts at 1
  let index1 = 0;
  let index2 = 0;
  for (const packet of packets) {
    if (_.isEqual(packet, [[2]])) {
      index1 = index;
    } else if (_.isEqual(packet, [[6]])) {
      index2 = index;
    }
    index++;
  }
  return index1 * index2;
};

const exampleInput = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
