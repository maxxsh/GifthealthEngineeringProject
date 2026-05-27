import * as fs from "fs";
import { PrescriptionEvent, EventName, PatientSummary } from "./types";

const VALID_EVENTS: EventName[] = ["created", "filled", "returned"];

export function parseLine(line: string): PrescriptionEvent | null {
  const parts = line.trim().split(/\s+/); //"Mark B filled" converts into ["Mark", "B", "filled"]

  if (parts.length !== 3) {
    return null;
  }

  const [patientName, drugName, eventName] = parts;

  if (!VALID_EVENTS.includes(eventName as EventName)) {
    return null;
  }
  return {
    patientName,
    eventName: eventName as EventName,
    drugName,
  };
}

//creating unique key for each prescription to track
function getPrescriptionKey(event: PrescriptionEvent): string {
  return `${event.patientName}:${event.drugName}`;
}

export function processEvents(events: PrescriptionEvent[]): PatientSummary[] {
  const createdPrescriptions = new Set<string>(); //for created prescriptions eg Set: "Mark:B", "John:E"
  const activeFillsByPrescription = new Map<string, number>(); //for active fills for each prescription eg Map: "Mark:B" => 2, "John:E" => 1
  const summariesByPatient = new Map<string, PatientSummary>(); //for patient summaries eg Map: "Mark" => { patientName: "Mark", totalFills: 2, income: 10 }

  for (const event of events) {
    const prescriptionKey = getPrescriptionKey(event);

    if (event.eventName === "created") {
      createdPrescriptions.add(prescriptionKey);

      if (!summariesByPatient.has(event.patientName)) {
        summariesByPatient.set(event.patientName, {
          patientName: event.patientName,
          totalFills: 0,
          income: 0,
        });
      }

      continue;
    }

    if (!createdPrescriptions.has(prescriptionKey)) {
      continue;
    }

    const summary = summariesByPatient.get(event.patientName);

    if (!summary) {
      continue;
    }

    const activeFills = activeFillsByPrescription.get(prescriptionKey) ?? 0;

    if (event.eventName === "filled") {
      activeFillsByPrescription.set(prescriptionKey, activeFills + 1);
      summary.totalFills += 1;
      summary.income += 5;
    }

    if (event.eventName === "returned" && activeFills > 0) {
      activeFillsByPrescription.set(prescriptionKey, activeFills - 1);
      summary.totalFills -= 1;
      summary.income -= 6;
    }
  }

  return Array.from(summariesByPatient.values());
}

function formatIncome(income: number): string {
  return `${income < 0 ? "-" : ""}$${Math.abs(income)}`;
}

export function formatReport(summaries: PatientSummary[]): string {
  return summaries
    .map((summary) => {
      return `${summary.patientName}: ${summary.totalFills} fills ${formatIncome(
        summary.income,
      )} income`;
    })
    .join("\n");
}
//parses input string into array of PrescriptionEvent objects
export function parseInput(input: string): PrescriptionEvent[] {
  return input
    .split(/\r?\n/)
    .map(parseLine)
    .filter((event): event is PrescriptionEvent => event !== null);
}

function readInput(): string {
  const fileName = process.argv[2];
  if (!fileName) {
    console.log("Please provide an input file name.");
    process.exit(1);
  }
  if (!fs.existsSync(fileName)) {
    console.log(`Input file not found: ${fileName}`);
    process.exit(1);
  }

  return fs.readFileSync(fileName, "utf8");
}

function main(): void {
  const input = readInput();
  const events = parseInput(input);
  const summaries = processEvents(events);
  const report = formatReport(summaries);

  console.log(report);
}

if (require.main === module) {
  main();
}
