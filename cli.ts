import * as fs from "fs";
import { formatReport, parseInput, processEvents } from "./app";
function readInput(): string {
  const fileName = process.argv[2];

  if (fileName) {
    if (!fs.existsSync(fileName)) {
      console.log(`Input file not found: ${fileName}`);
      process.exit(1);
    }
    return fs.readFileSync(fileName, "utf8");
  }

  if (!process.stdin.isTTY) {
    return fs.readFileSync(0, "utf8");
  }

  console.log("Please provide an input file name or pipe input via stdin.");
  process.exit(1);
}

function main(): void {
  const input = readInput();
  const events = parseInput(input);
  const summaries = processEvents(events);
  const report = formatReport(summaries);

  console.log(report);
}

main();
