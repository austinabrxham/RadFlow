export type UserRole = 'Consultant' | 'Resident' | 'Physicist' | 'Radiographer';

export type WorkflowStage = 
  | 'Registration'
  | 'Mask Moulding'
  | 'CT Simulation'
  | 'Contouring'
  | 'Approval'
  | 'Planning'
  | 'Treatment'
  | 'Review';

export type StageStatus = 'Pending' | 'Completed';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  registeredAt: string;
  qrCode: string;
  stages: {
    [key in WorkflowStage]: {
      status: StageStatus;
      assignedTo: UserRole;
      completedAt?: string;
      completedBy?: string;
    };
  };
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface DataContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'qrCode'>) => void;
  updatePatientStage: (patientId: string, stage: WorkflowStage, status: StageStatus) => void;
  getPatientsByRole: (role: UserRole) => Patient[];
}
