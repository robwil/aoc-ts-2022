import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let stacks: string[][] = [];
  let lineLength = 0;
  let columns = 0;
  for (const line of lines) {
    if (line.includes("[")) {
      // 3 * columns + (columns-1) = lineLength
      // lineLength + 1 = 3 * columns + columns = 4 * columns
      // (lineLength + 1)/4 = columns
      lineLength = line.length;
      columns = (lineLength + 1) / 4;
      for (let j = 0; j < columns; j++) {
        if (stacks[j] === undefined) {
          stacks[j] = [];
        }
        const content = line.charAt(j * 3 + j + 1);
        if (content !== " ") {
          stacks[j].unshift(content);
        }
      }
    }
    if (line.startsWith("move")) {
      const [_move, amount, _from, source, _to, destination] = line.split(" ");
      for (let i = 0; i < parseInt(amount); i++) {
        const content = stacks[parseInt(source) - 1].pop();
        if (!content) {
          console.log(stacks);
          console.log({ line, i, amount, source, destination });
          throw new Error("failed to get item");
        }
        stacks[parseInt(destination) - 1].push(content);
      }
    }
  }
  let result = "";
  for (let i = 0; i < stacks.length; i++) {
    result += stacks[i].pop();
  }
  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let stacks: string[][] = [];
  let lineLength = 0;
  let columns = 0;
  for (const line of lines) {
    if (line.includes("[")) {
      // 3 * columns + (columns-1) = lineLength
      // lineLength + 1 = 3 * columns + columns = 4 * columns
      // (lineLength + 1)/4 = columns
      lineLength = line.length;
      columns = (lineLength + 1) / 4;
      for (let j = 0; j < columns; j++) {
        if (stacks[j] === undefined) {
          stacks[j] = [];
        }
        const content = line.charAt(j * 3 + j + 1);
        if (content !== " ") {
          stacks[j].unshift(content);
        }
      }
    }
    if (line.startsWith("move")) {
      const [_move, amount, _from, source, _to, destination] = line.split(" ");
      const temp = [];
      for (let i = 0; i < parseInt(amount); i++) {
        const content = stacks[parseInt(source) - 1].pop();
        if (!content) {
          console.log(stacks);
          console.log({ line, i, amount, source, destination });
          throw new Error("failed to get item");
        }
        temp.push(content);
      }
      for (let i = 0; i < parseInt(amount); i++) {
        const content = temp.pop();
        if (!content) {
          console.log(stacks);
          console.log({ line, i, amount, source, destination });
          throw new Error("failed to get item");
        }
        stacks[parseInt(destination) - 1].push(content);
      }
    }
  }
  let result = "";
  for (let i = 0; i < stacks.length; i++) {
    result += stacks[i].pop();
  }
  return result;
};

const exampleInput = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
