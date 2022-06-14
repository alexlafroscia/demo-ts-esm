import assert from "node:assert";
import { add } from "./helpers.js";

const operandArguments = process.argv.slice(2);

assert(
  operandArguments.length === 2,
  "2 numbers to add must be provided as arguments"
);

const operands = operandArguments.map((arg) => parseInt(arg, 10));

assert(
  operands.every((op) => !isNaN(op)),
  "All arguments must be numbers"
);

const [first, second] = operands;
const result = await add(first, second);

console.log(result);
