export type EventName = "created" | "filled" | "returned";

export interface PrescriptionEvent {
  patientName: string;
  eventName: EventName;
  drugName: string;
}

export interface PatientSummary {
  patientName: string;
  totalFills: number;
  income: number;
}
