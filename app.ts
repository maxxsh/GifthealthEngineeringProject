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

  return Array.from(summariesByPatient.values());
}
