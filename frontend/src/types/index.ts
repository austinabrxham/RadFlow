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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading?: boolean;
}

export interface DataContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatientStage: (patientId: string, stage: WorkflowStage, status: StageStatus) => Promise<void>;
  getPatientsByRole: (role: UserRole) => Promise<Patient[]>;
  isLoading?: boolean;
  error?: string | null;
  refreshPatients?: () => Promise<void>;
}
