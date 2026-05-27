import { formatReport, parseLine, processEvents } from "./src/app";
import { PatientSummary, PrescriptionEvent } from "./src/types";

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

const sampleEvents: PrescriptionEvent[] = [
  { patientName: "Nick", drugName: "A", eventName: "created" },
  { patientName: "Mark", drugName: "B", eventName: "created" },
  { patientName: "Mark", drugName: "B", eventName: "filled" },
  { patientName: "Mark", drugName: "C", eventName: "filled" },
  { patientName: "Mark", drugName: "B", eventName: "returned" },
  { patientName: "John", drugName: "E", eventName: "created" },
  { patientName: "Mark", drugName: "B", eventName: "filled" },
  { patientName: "Mark", drugName: "B", eventName: "filled" },
  { patientName: "Paul", drugName: "D", eventName: "filled" },
  { patientName: "John", drugName: "E", eventName: "filled" },
  { patientName: "John", drugName: "E", eventName: "returned" },
];

expectEqual(
  processEvents(sampleEvents),
  [
    { patientName: "Nick", totalFills: 0, income: 0 },
    { patientName: "Mark", totalFills: 2, income: 9 },
    { patientName: "John", totalFills: 0, income: -1 },
  ],
  "processes sample events",
);

expectEqual(
  formatReport(processEvents(sampleEvents)),
  `Nick: 0 fills $0 income
Mark: 2 fills $9 income
John: 0 fills -$1 income`,
  "formats sample report",
);
