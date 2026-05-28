import { PatientSummary, PrescriptionEvent, PrescriptionState } from "./types";

export function getPrescriptionKey(event: PrescriptionEvent): string {
  return `${event.patientName}:${event.drugName}`;
}

export function createPrescriptionState(): PrescriptionState {
  return {
    createdPrescriptions: new Set<string>(),
    activeFillsByPrescription: new Map<string, number>(),
    summariesByPatient: new Map<string, PatientSummary>(),
  };
}
