import run from "aocrunner";
import { Canvas } from "canvas";
import path from "path";
import fs from "fs";
import { URL } from "url";
import GIFEncoder from "gifencoder";

const __dirname = new URL(".", import.meta.url).pathname;
const outFile = path.join(__dirname, "animated.gif");
const GIF_SCALE = 1;
const FRAME_MODULO = 100;

interface VisualizationState {
  encoder: GIFEncoder;
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  minRockX: number;
  minRockY: number;
  maxRockX: number;
  maxRockY: number;
  width: number;
  height: number;
  frame: number;
}

let state: VisualizationState | undefined;

const visualize = (
  rocks: { [key: string]: boolean },
  newSandX?: number,
  newSandY?: number,
): void => {
  if (!state) {
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
    const minRockY = 0;
    const width = (maxRockX - minRockX + 1) * GIF_SCALE;
    const height = (maxRockY - minRockY + 1) * GIF_SCALE;
    const encoder = new GIFEncoder(width, height);

    encoder.createReadStream().pipe(fs.createWriteStream(outFile));
    encoder.start();
    encoder.setRepeat(-1);
    encoder.setDelay(10);
    const canvas = new Canvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);
    for (let y = minRockY; y <= maxRockY; y++) {
      for (let x = minRockX; x <= maxRockX; x++) {
        if (rocks[`${x},${y}`]) {
          ctx.fillStyle = "rgb(0, 0, 0)";
          ctx.fillRect(
            (x - minRockX) * GIF_SCALE,
            (y - minRockY) * GIF_SCALE,
            GIF_SCALE,
            GIF_SCALE,
          );
        }
      }
    }
    state = {
      width,
      height,
      canvas,
      ctx,
      encoder,
      maxRockX,
      maxRockY,
      minRockX,
      minRockY,
      frame: 0,
    };
    // console.log(state);
  }

  if (newSandX && newSandY) {
    const { ctx, minRockX, minRockY, encoder, frame } = state;
    // console.log({newSandX, newSandY});
    ctx.fillStyle = "rgb(203, 200, 77)";
    ctx.fillRect(
      (newSandX - minRockX) * GIF_SCALE,
      (newSandY - minRockY) * GIF_SCALE,
      GIF_SCALE,
      GIF_SCALE,
    );
    if (frame % FRAME_MODULO === 0) {
      encoder.addFrame(ctx);

      // old single-output for PNG. NOT concurrency safe, so all of the frames get final result.

      // const pngStream = canvas.createPNGStream();
      // const outFile = path.join(__dirname, `frame${frame}.png`);
      // const outStream = fs.createWriteStream(outFile);
      // pngStream.pipe(outStream);
    }
    state.frame++;
  }
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
  for (let sand = 0; sand < 100000; sand++) {
    let sandX = 500;
    let sandY = 0;
    while (true) {
      if (!part2 && sandY > lowestRockY) {
        // went into abyss, so we are done
        visualize(rocks, sandX, sandY);
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
    sands[`${sandX},${sandY}`] = true;
    visualize(rocks, sandX, sandY);
    if (sand % 1000 === 0) {
      console.log(`Processed up to ${sand}...`);
    }
    if (part2 && sandX === 500 && sandY === 0) {
      return sand;
    }
  }
};

const part1 = (rawInput: string) => {
  state = undefined;
  const rocks = parseInput(rawInput);
  const lowestRockY = Object.keys(rocks)
    .map((rock) => rock.split(","))
    .map((a) => parseInt(a[1], 10))
    .reduce((prevMax, cur) => (cur > prevMax ? cur : prevMax), 0);
  return simulateSand(rocks, lowestRockY);
};

const part2 = (rawInput: string) => {
  state = undefined;
  const rocks = parseInput(rawInput);
  visualize(rocks);

  // create line at bottom
  const lineY = state!.maxRockY + 2;
  for (let x = 300; x <= 700; x++) {
    rocks[`${x},${lineY}`] = true;
  }
  state = undefined; // allows it to recalculate max to include new line
  const result = simulateSand(rocks, lineY, true)! + 1;

  // write out GIF visualization
  // @ts-ignore
  state!.encoder.finish();
  // throw new Error('unfinished');
  return result;
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
