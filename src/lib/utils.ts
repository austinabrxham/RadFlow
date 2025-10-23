import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Patient, WorkflowStage, StageStatus, UserRole } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const workflowOrder: WorkflowStage[] = [
  'Registration',
  'Mask Moulding',
  'CT Simulation',
  'Contouring',
  'Approval',
  'Planning',
  'Treatment',
  'Review'
];

export function getCurrentStage(patient: Patient): { stage: WorkflowStage; status: StageStatus; assignedTo: UserRole } | undefined {
  if (!patient.stages) return undefined;
  
  // Find the first incomplete stage
  const currentStage = workflowOrder.find(stage => patient.stages[stage].status === 'Pending');
  
  // If all stages are complete, return the last stage
  const stage = currentStage || workflowOrder[workflowOrder.length - 1];
  return { 
    stage, 
    status: patient.stages[stage].status,
    assignedTo: patient.stages[stage].assignedTo
  };
};

export function canStageBeCompleted(patient: Patient, stageToCheck: WorkflowStage): boolean {
  const stageIndex = workflowOrder.indexOf(stageToCheck);
  if (stageIndex === -1) return false;

  // Check if all previous stages are completed
  for (let i = 0; i < stageIndex; i++) {
    const previousStage = workflowOrder[i];
    if (patient.stages[previousStage].status !== 'Completed') {
      return false;
    }
  }

  return true;
}

export function isPatientPendingForRole(patient: Patient, role: UserRole): boolean {
  const currentStage = getCurrentStage(patient);
  return currentStage?.status === 'Pending' && currentStage?.assignedTo === role;
}

export function getCompletedStagesCount(patient: Patient): number {
  return Object.values(patient.stages).filter(stage => stage.status === 'Completed').length;
}
