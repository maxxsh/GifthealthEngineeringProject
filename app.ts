import { PrescriptionEvent, EventName } from "./types";

const VALID_EVENTS: EventName[] = ["created", "filled", "returned"];

export function parseLine(line: string): PrescriptionEvent | null {
  const parts = line.trim().split(/\s+/);

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
