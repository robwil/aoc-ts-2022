import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let cycle = 1;
  let registers: { [key: string]: number } = { x: 1 };
  let cycleValues: { [key: string]: number } = {};
  input.split("\n").forEach((instruction) => {
    const [instr, maybeArg] = instruction.split(" ");
    if (instr === "addx") {
      const amount = parseInt(maybeArg, 10);
      if (Number.isNaN(amount)) {
        throw new Error(`encountered NaN parsing amount of ${instruction}`);
      }
      cycleValues[cycle] = registers.x;
      cycleValues[cycle + 1] = registers.x;
      registers.x += amount;
      cycle += 2;
      // console.log({cycle, registers, instruction, amount});
    } else if (instr === "noop") {
      cycleValues[cycle] = registers.x;
      cycle++;
    }
  });
  let sum = 0;
  for (const cycleStr of Object.keys(cycleValues)) {
    const cycle = parseInt(cycleStr, 10);
    if (cycle === 20 || (cycle - 20) % 40 === 0) {
      console.log(cycle, cycleValues[cycle]);
      sum += cycle * cycleValues[cycle];
    }
  }
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let cycle = 1;
  let registers: { [key: string]: number } = { x: 1 };
  let cycleValues: { [key: string]: number } = {};
  input.split("\n").forEach((instruction) => {
    const [instr, maybeArg] = instruction.split(" ");
    if (instr === "addx") {
      const amount = parseInt(maybeArg, 10);
      if (Number.isNaN(amount)) {
        throw new Error(`encountered NaN parsing amount of ${instruction}`);
      }
      cycleValues[cycle] = registers.x;
      cycleValues[cycle + 1] = registers.x;
      registers.x += amount;
      cycle += 2;
      // console.log({cycle, registers, instruction, amount});
    } else if (instr === "noop") {
      cycleValues[cycle] = registers.x;
      cycle++;
    }
  });

  let i = 0;
  const screenWidth = 40;
  const screenHeight = 6;
  const screen = Array.from({ length: screenHeight }, () =>
    new Array(screenWidth).fill("."),
  );
  console.log(screen);
  for (const cycleStr of Object.keys(cycleValues)) {
    const cycle = parseInt(cycleStr, 10);
    const registerValue = cycleValues[cycle];
    let x = i % screenWidth;
    let y = Math.floor(i / screenWidth);
    const shouldDraw = [
      registerValue - 1,
      registerValue,
      registerValue + 1,
    ].includes(x);
    // console.log({i,x,y,registerValue, shouldDraw});
    if (shouldDraw) {
      screen[y][x] = "#";
    }
    i++;
  }
  const screenString = screen.map((row) => row.join("")).join("\n");
  console.log(screenString);
  // ELPLZGZL
  return screenString;
};

const exampleInput = `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
`.trim(),
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
