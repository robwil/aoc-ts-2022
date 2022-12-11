import run from "aocrunner";
import { lcm } from "mathjs";

const parseInput = (rawInput: string) => rawInput;

interface Monkey {
  items: number[];
  operation: (old: number) => number;
  modulo: number;
  trueTarget: number;
  falseTarget: number;
  inspections: number;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const monkeys: Monkey[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("Monkey ")) {
      i++;
      const [_1, items] = lines[i].split(": ");
      i++;
      const [_2, operation] = lines[i].split("new = old ");
      const [operator, operand] = operation.split(" ");
      // console.log({operator, operand});
      i++;
      const [_3, divisible] = lines[i].split("divisible by ");
      i++;
      const [_4, trueTarget] = lines[i].split("throw to monkey ");
      i++;
      const [_5, falseTarget] = lines[i].split("throw to monkey ");
      const monkey = {
        items: items.split(",").map((item) => parseInt(item.trim(), 10)),
        modulo: parseInt(divisible, 10),
        trueTarget: parseInt(trueTarget, 10),
        falseTarget: parseInt(falseTarget, 10),
        inspections: 0,
        operation: (old: number) => {
          if (operator === "*") {
            // being lazy here, the inputs don't have old + old, so only handling for old * old case
            if (operand === "old") {
              return old * old;
            }
            return old * parseInt(operand, 10);
          } else if (operator === "+") {
            return old + parseInt(operand, 10);
          } else {
            throw new Error(`unexpected operator ${operator} for ${operation}`);
          }
        },
      };
      monkeys.push(monkey);
    }
  }
  for (let round = 0; round < 20; round++) {
    for (let turn = 0; turn < monkeys.length; turn++) {
      const { items, operation, trueTarget, falseTarget, modulo } =
        monkeys[turn];
      for (let i = 0; i < items.length; i++) {
        items[i] = Math.floor(operation(items[i]) / 3);
        if (items[i] % modulo === 0) {
          monkeys[trueTarget].items.push(items[i]);
        } else {
          monkeys[falseTarget].items.push(items[i]);
        }
      }
      monkeys[turn].inspections += monkeys[turn].items.length;
      monkeys[turn].items = [];
    }
    // console.log(round, monkeys);
  }
  const mostActiveMonkeys = monkeys
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a)
    .slice(0, 2);
  return mostActiveMonkeys[0] * mostActiveMonkeys[1];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const monkeys: Monkey[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("Monkey ")) {
      i++;
      const [_1, items] = lines[i].split(": ");
      i++;
      const [_2, operation] = lines[i].split("new = old ");
      const [operator, operand] = operation.split(" ");
      // console.log({operator, operand});
      i++;
      const [_3, divisible] = lines[i].split("divisible by ");
      i++;
      const [_4, trueTarget] = lines[i].split("throw to monkey ");
      i++;
      const [_5, falseTarget] = lines[i].split("throw to monkey ");
      const monkey = {
        items: items.split(",").map((item) => parseInt(item.trim(), 10)),
        modulo: parseInt(divisible, 10),
        trueTarget: parseInt(trueTarget, 10),
        falseTarget: parseInt(falseTarget, 10),
        inspections: 0,
        operation: (old: number) => {
          if (operator === "*") {
            // being lazy here, the inputs don't have old + old, so only handling for old * old case
            if (operand === "old") {
              return old * old;
            }
            return old * parseInt(operand, 10);
          } else if (operator === "+") {
            return old + parseInt(operand, 10);
          } else {
            throw new Error(`unexpected operator ${operator} for ${operation}`);
          }
        },
      };
      monkeys.push(monkey);
    }
  }
  const totalLcm = monkeys
    .map((m) => m.modulo)
    .reduce((old, curr) => lcm(old, curr), 1);
  for (let round = 0; round < 10000; round++) {
    for (let turn = 0; turn < monkeys.length; turn++) {
      const { items, operation, trueTarget, falseTarget, modulo } =
        monkeys[turn];
      for (let i = 0; i < items.length; i++) {
        items[i] = operation(items[i]) % totalLcm;
        if (items[i] % modulo === 0) {
          monkeys[trueTarget].items.push(items[i]);
        } else {
          monkeys[falseTarget].items.push(items[i]);
        }
      }
      monkeys[turn].inspections += monkeys[turn].items.length;
      monkeys[turn].items = [];
    }
    // console.log(round, monkeys);
  }
  const mostActiveMonkeys = monkeys
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a)
    .slice(0, 2);
  return mostActiveMonkeys[0] * mostActiveMonkeys[1];
};

const exampleInput = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
