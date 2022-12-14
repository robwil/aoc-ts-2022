import run from "aocrunner";
import { Canvas } from "canvas";
import path from "path";
import fs from "fs";
import { URL } from "url";

const visualize = (
  rocks: { [key: string]: boolean },
  sands: { [key: string]: boolean },
): void => {
  const maxRockX = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[0], 10))
    .reduce((prevMax, cur) => (cur > prevMax ? cur : prevMax), 0);
  const maxRockY = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[1], 10))
    .reduce((prevMax, cur) => (cur > prevMax ? cur : prevMax), 0);
  const minRockX = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[0], 10))
    .reduce((prevMin, cur) => (cur < prevMin ? cur : prevMin), Infinity);
  const minRockY = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[1], 10))
    .reduce((prevMin, cur) => (cur < prevMin ? cur : prevMin), Infinity);
  const maxSandX = Object.keys(sands)
    .map((sand) => sand.split(","))
    .map((a) => parseInt(a[0], 10))
    .reduce((prevMax, cur) => (cur > prevMax ? cur : prevMax), 0);
  const maxSandY = Object.keys(sands)
    .map((sand) => sand.split(","))
    .map((a) => parseInt(a[1], 10))
    .reduce((prevMax, cur) => (cur > prevMax ? cur : prevMax), 0);
  const minSandX = Object.keys(sands)
    .map((sand) => sand.split(","))
    .map((a) => parseInt(a[0], 10))
    .reduce((prevMin, cur) => (cur < prevMin ? cur : prevMin), Infinity);
  const minSandY = Object.keys(sands)
    .map((sand) => sand.split(","))
    .map((a) => parseInt(a[1], 10))
    .reduce((prevMin, cur) => (cur < prevMin ? cur : prevMin), Infinity);
  let stringOutput = "";
  const width = Math.max(maxRockX, maxSandX) - Math.min(minRockX, minSandX);
  const height = Math.max(maxRockY, maxSandY) - Math.min(minRockY, minSandY);
  const canvas = new Canvas(width, height, "image");
  const ctx = canvas.getContext("2d");
  for (
    let y = Math.min(minRockY, minSandY);
    y <= Math.max(maxRockY, maxSandY);
    y++
  ) {
    for (
      let x = Math.min(minRockX, minSandX);
      x <= Math.max(maxRockX, maxSandX);
      x++
    ) {
      if (rocks[`${x},${y}`]) {
        stringOutput += "#";
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(
          x - Math.min(minRockX, minSandX),
          y - Math.min(minRockY, minSandY),
          1,
          1,
        );
      } else if (sands[`${x},${y}`]) {
        stringOutput += "o";
        ctx.fillStyle = "rgb(203, 200, 77)";
        ctx.fillRect(
          x - Math.min(minRockX, minSandX),
          y - Math.min(minRockY, minSandY),
          1,
          1,
        );
      } else {
        stringOutput += ".";
      }
    }
    stringOutput += "\n";
  }

  // console.log(stringOutput);
  const pngStream = canvas.createPNGStream();
  const __dirname = new URL(".", import.meta.url).pathname;
  const outFile = path.join(__dirname, "frame0.png");
  const outStream = fs.createWriteStream(outFile);
  pngStream.pipe(outStream);
};

const parseInput = (rawInput: string): { [key: string]: boolean } => {
  const lines = rawInput.split("\n").map((line) => line.split(" -> "));
  const rocks: { [key: string]: boolean } = {};
  for (const line of lines) {
    const points = line.map((point) =>
      point.split(",").map((val) => parseInt(val, 10)),
    );
    let previousPoint: number[] | undefined;
    for (const point of points) {
      if (previousPoint !== undefined) {
        if (previousPoint[0] === point[0]) {
          // same x, so move between y
          for (let y = 0; y <= Math.abs(previousPoint[1] - point[1]); y++) {
            const rockX = previousPoint[0];
            const rockY =
              previousPoint[1] < point[1]
                ? previousPoint[1] + y
                : previousPoint[1] - y;
            rocks[`${rockX},${rockY}`] = true;
          }
        } else if (previousPoint[1] === point[1]) {
          // same y, so move between x
          for (let x = 0; x <= Math.abs(previousPoint[0] - point[0]); x++) {
            const rockX =
              previousPoint[0] < point[0]
                ? previousPoint[0] + x
                : previousPoint[0] - x;
            const rockY = previousPoint[1];
            rocks[`${rockX},${rockY}`] = true;
          }
        }
      }
      previousPoint = point;
    }
  }
  return rocks;
};

const simulateSand = (
  rocks: { [key: string]: boolean },
  lowestRockY: number,
  part2: boolean = false,
) => {
  const sands: { [key: string]: boolean } = {};
  visualize(rocks, sands);
  for (let sand = 0; sand < 100000; sand++) {
    let sandX = 500;
    let sandY = 0;
    while (true) {
      if (!part2 && sandY > lowestRockY) {
        // went into abyss, so we are done
        visualize(rocks, sands);
        return sand;
      }
      if (!rocks[`${sandX},${sandY + 1}`] && !sands[`${sandX},${sandY + 1}`]) {
        // down
        sandY++;
      } else if (
        !rocks[`${sandX - 1},${sandY + 1}`] &&
        !sands[`${sandX - 1},${sandY + 1}`]
      ) {
        // down left
        sandX--;
        sandY++;
      } else if (
        !rocks[`${sandX + 1},${sandY + 1}`] &&
        !sands[`${sandX + 1},${sandY + 1}`]
      ) {
        // down right
        sandX++;
        sandY++;
      } else {
        // at rest
        break;
      }
    }
    console.log(sandX, sandY, sand);
    // console.log(rocks['521,53']);
    sands[`${sandX},${sandY}`] = true;
    if (part2 && sandX === 500 && sandY === 0) {
      visualize(rocks, sands);
      return sand;
    }
  }
};

const part1 = (rawInput: string) => {
  const rocks = parseInput(rawInput);
  const lowestRockY = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[1], 10))
    .reduce((prevMax, cur) => (cur > prevMax ? cur : prevMax), 0);
  return simulateSand(rocks, lowestRockY);
};

const part2 = (rawInput: string) => {
  const rocks = parseInput(rawInput);
  const lowestRockY = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[1], 10))
    .reduce((prevMax, cur) => (cur > prevMax ? cur : prevMax), 0);
  const minRockX = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[0], 10))
    .reduce((prevMin, cur) => (cur < prevMin ? cur : prevMin), Infinity);
  const maxRockX = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[0], 10))
    .reduce((prevMax, cur) => (cur > prevMax ? cur : prevMax), 0);
  // create line at bottom
  for (let x = minRockX - 1000; x <= maxRockX + 1000; x++) {
    rocks[`${x},${lowestRockY + 2}`] = true;
  }
  return simulateSand(rocks, lowestRockY + 2, true)! + 1;
};

const exampleInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
