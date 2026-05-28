import { PrescriptionEvent, EventName, PatientSummary } from "./types";
import { createPrescriptionState, getPrescriptionKey } from "./state";

const VALID_EVENTS: EventName[] = ["created", "filled", "returned"];
const FILL_INCOME = 5;
const RETURN_LOSS = 1;

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

export function processEvents(events: PrescriptionEvent[]): PatientSummary[] {
  const state = createPrescriptionState();

  for (const event of events) {
    const prescriptionKey = getPrescriptionKey(event);

    if (event.eventName === "created") {
      state.createdPrescriptions.add(prescriptionKey);

      if (!state.summariesByPatient.has(event.patientName)) {
        state.summariesByPatient.set(event.patientName, {
          patientName: event.patientName,
          totalFills: 0,
          income: 0,
        });
      }

      continue;
    }

    if (!state.createdPrescriptions.has(prescriptionKey)) {
      continue;
    }

    const summary = state.summariesByPatient.get(event.patientName);

    if (!summary) {
      continue;
    }

    const activeFills =
      state.activeFillsByPrescription.get(prescriptionKey) ?? 0;

    if (event.eventName === "filled") {
      state.activeFillsByPrescription.set(prescriptionKey, activeFills + 1);
      summary.totalFills += 1; // count the new fill
      summary.income += FILL_INCOME; // each fill adds money
    }

    if (event.eventName === "returned" && activeFills > 0) {
      state.activeFillsByPrescription.set(prescriptionKey, activeFills - 1);
      summary.totalFills -= 1; // remove one fill from the total
      summary.income -= FILL_INCOME + RETURN_LOSS; // undo the fill and apply the return loss
    }
  }

  return Array.from(state.summariesByPatient.values());
}

function formatIncome(income: number): string {
  return `${income < 0 ? "-" : ""}$${Math.abs(income)}`;
}

export function formatReport(summaries: PatientSummary[]): string {
  return summaries
    .slice()
    .sort((a, b) => b.totalFills - a.totalFills || a.income - b.income)
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
