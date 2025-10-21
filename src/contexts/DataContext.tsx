import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, DataContextType, WorkflowStage, StageStatus, UserRole } from '@/types';
import { generateQRCode } from '@/utils/qrcode';

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_PATIENTS: Omit<Patient, 'qrCode'>[] = [
  {
    id: 'p1',
    patientId: 'RT2025001',
    name: 'Robert Anderson',
    age: 58,
    gender: 'Male',
    diagnosis: 'Prostate Cancer',
    registeredAt: new Date('2025-01-15').toISOString(),
    stages: {
      'Registration': { status: 'Completed', assignedTo: 'Radiographer', completedAt: '2025-01-15T10:00:00Z', completedBy: 'John Smith' },
      'Mask Moulding': { status: 'Completed', assignedTo: 'Radiographer', completedAt: '2025-01-16T14:00:00Z', completedBy: 'John Smith' },
      'CT Simulation': { status: 'Completed', assignedTo: 'Radiographer', completedAt: '2025-01-17T11:00:00Z', completedBy: 'John Smith' },
      'Contouring': { status: 'Completed', assignedTo: 'Resident', completedAt: '2025-01-19T16:00:00Z', completedBy: 'Dr. Michael Chen' },
      'Approval': { status: 'Completed', assignedTo: 'Consultant', completedAt: '2025-01-20T09:00:00Z', completedBy: 'Dr. Sarah Johnson' },
      'Planning': { status: 'Pending', assignedTo: 'Physicist' },
      'Treatment': { status: 'Pending', assignedTo: 'Radiographer' },
      'Review': { status: 'Pending', assignedTo: 'Consultant' },
    },
  },
  {
    id: 'p2',
    patientId: 'RT2025002',
    name: 'Maria Garcia',
    age: 45,
    gender: 'Female',
    diagnosis: 'Breast Cancer',
    registeredAt: new Date('2025-01-18').toISOString(),
    stages: {
      'Registration': { status: 'Completed', assignedTo: 'Radiographer', completedAt: '2025-01-18T10:00:00Z', completedBy: 'John Smith' },
      'Mask Moulding': { status: 'Completed', assignedTo: 'Radiographer', completedAt: '2025-01-19T14:00:00Z', completedBy: 'John Smith' },
      'CT Simulation': { status: 'Pending', assignedTo: 'Radiographer' },
      'Contouring': { status: 'Pending', assignedTo: 'Resident' },
      'Approval': { status: 'Pending', assignedTo: 'Consultant' },
      'Planning': { status: 'Pending', assignedTo: 'Physicist' },
      'Treatment': { status: 'Pending', assignedTo: 'Radiographer' },
      'Review': { status: 'Pending', assignedTo: 'Consultant' },
    },
  },
  {
    id: 'p3',
    patientId: 'RT2025003',
    name: 'James Wilson',
    age: 62,
    gender: 'Male',
    diagnosis: 'Lung Cancer',
    registeredAt: new Date('2025-01-20').toISOString(),
    stages: {
      'Registration': { status: 'Completed', assignedTo: 'Radiographer', completedAt: '2025-01-20T10:00:00Z', completedBy: 'John Smith' },
      'Mask Moulding': { status: 'Pending', assignedTo: 'Radiographer' },
      'CT Simulation': { status: 'Pending', assignedTo: 'Radiographer' },
      'Contouring': { status: 'Pending', assignedTo: 'Resident' },
      'Approval': { status: 'Pending', assignedTo: 'Consultant' },
      'Planning': { status: 'Pending', assignedTo: 'Physicist' },
      'Treatment': { status: 'Pending', assignedTo: 'Radiographer' },
      'Review': { status: 'Pending', assignedTo: 'Consultant' },
    },
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const savedPatients = localStorage.getItem('patients');
      if (savedPatients) {
        setPatients(JSON.parse(savedPatients));
      } else {
        // Initialize with sample data and generate QR codes
        const patientsWithQR = await Promise.all(
          INITIAL_PATIENTS.map(async (p) => ({
            ...p,
            qrCode: await generateQRCode(`RT-${p.patientId}`),
          }))
        );
        setPatients(patientsWithQR);
        localStorage.setItem('patients', JSON.stringify(patientsWithQR));
      }
    };
    loadData();
  }, []);

  const addPatient = async (patient: Omit<Patient, 'id' | 'qrCode'>) => {
    const qrCode = await generateQRCode(`RT-${patient.patientId}`);
    const newPatient: Patient = {
      ...patient,
      id: `p${Date.now()}`,
      qrCode,
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  const updatePatientStage = (patientId: string, stage: WorkflowStage, status: StageStatus) => {
    const updatedPatients = patients.map(p => {
      if (p.id === patientId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        return {
          ...p,
          stages: {
            ...p.stages,
            [stage]: {
              ...p.stages[stage],
              status,
              ...(status === 'Completed' ? {
                completedAt: new Date().toISOString(),
                completedBy: currentUser.name || 'Unknown'
              } : {})
            }
          }
        };
      }
      return p;
    });
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  const getPatientsByRole = (role: UserRole): Patient[] => {
    return patients.filter(patient => 
      Object.entries(patient.stages).some(
        ([_, stage]) => stage.assignedTo === role && stage.status === 'Pending'
      )
    );
  };

  return (
    <DataContext.Provider value={{ patients, addPatient, updatePatientStage, getPatientsByRole }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
