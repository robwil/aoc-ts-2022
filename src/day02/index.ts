import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;
const LOSS = 0;
const DRAW = 3;
const WIN = 6;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let lines = input.split("\n");
  let totalScore = 0;
  for (const line of lines) {
    const [opponent, response] = line.split(" ");
    if (opponent === "A") {
      if (response === "X") {
        // Rock
        totalScore += ROCK + DRAW;
      } else if (response === "Y") {
        // Paper
        totalScore += PAPER + WIN;
      } else if (response === "Z") {
        // Scissors
        totalScore += SCISSORS + LOSS;
      } else {
        throw new Error(`Unexpected response value ${response}`);
      }
      // Paper
    } else if (opponent === "B") {
      if (response === "X") {
        // Rock
        totalScore += ROCK + LOSS;
      } else if (response === "Y") {
        // Paper
        totalScore += PAPER + DRAW;
      } else if (response === "Z") {
        // Scissors
        totalScore += SCISSORS + WIN;
      } else {
        throw new Error(`Unexpected response value ${response}`);
      }
      // Scissors
    } else if (opponent === "C") {
      if (response === "X") {
        // Rock
        totalScore += ROCK + WIN;
      } else if (response === "Y") {
        // Paper
        totalScore += PAPER + LOSS;
      } else if (response === "Z") {
        // Scissors
        totalScore += SCISSORS + DRAW;
      } else {
        throw new Error(`Unexpected response value ${response}`);
      }
    }
  }
  return totalScore;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let totalScore = 0;
  for (const line of lines) {
    // Rock = 1, Paper = 2, Scissors = 3
    const [opponent, response] = line.split(" ");
    // Rock
    if (opponent === "A") {
      if (response === "X") {
        // Lose
        totalScore += SCISSORS + LOSS;
      } else if (response === "Y") {
        // Draw
        totalScore += ROCK + DRAW;
      } else if (response === "Z") {
        // Win
        totalScore += PAPER + WIN;
      } else {
        throw new Error(`Unexpected response value ${response}`);
      }
      // Paper
    } else if (opponent === "B") {
      if (response === "X") {
        // Lose
        totalScore += ROCK + LOSS;
      } else if (response === "Y") {
        // Draw
        totalScore += PAPER + DRAW;
      } else if (response === "Z") {
        // Win
        totalScore += SCISSORS + WIN;
      } else {
        throw new Error(`Unexpected response value ${response}`);
      }
      // Scissors
    } else if (opponent === "C") {
      if (response === "X") {
        // Lose
        totalScore += PAPER + LOSS;
      } else if (response === "Y") {
        // Draw
        totalScore += SCISSORS + DRAW;
      } else if (response === "Z") {
        // Win
        totalScore += ROCK + WIN;
      } else {
        throw new Error(`Unexpected response value ${response}`);
      }
    }
  }
  return totalScore;
};

const exampleInput = `
A Y
B X
C Z
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
