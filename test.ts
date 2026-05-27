import { parseLine } from "./app";

function expectedEqual(
  actual: unknown,
  expected: unknown,
  testName: string,
): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(
      `${testName} failed: expected ${expectedJson}, got ${actualJson}`,
    );
  }
  console.log(`${testName} passed.`);
}

expectedEqual(
  parseLine("Mark B filled"),
  {
    patientName: "Mark",
    eventName: "filled",
    drugName: "B",
  },
  "parses valid filled event",
);
