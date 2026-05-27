import { parseLine } from "./app";

function expectEqual(
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

expectEqual(
  parseLine("Mark B filled"),
  {
    patientName: "Mark",
    eventName: "filled",
    drugName: "B",
  },
  "parses valid filled event",
);

expectEqual(
  parseLine("Nick A created"),
  {
    patientName: "Nick",
    eventName: "created",
    drugName: "A",
  },
  "parses valid created event",
);

expectEqual(
  parseLine("Lisa C returned"),
  { patientName: "Lisa", eventName: "returned", drugName: "C" },
  "parses valid returned event",
);

expectEqual(parseLine("bad input"), null, "returns null for invalid line");

expectEqual(
  parseLine("Mark B unknown"),
  null,
  "returns null for unknown event",
);
