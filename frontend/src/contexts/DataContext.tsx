import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, DataContextType, WorkflowStage, StageStatus, UserRole } from '@/types';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadPatients();
    }
  }, [isAuthenticated]);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const patientsData = await apiService.getAllPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error('Failed to load patients:', error);
      setError('Failed to load patients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addPatient = async (patient: Omit<Patient, 'id'>) => {
    try {
      await apiService.addPatient(patient);
      // Reload patients to get the updated list
      await loadPatients();
    } catch (error) {
      console.error('Failed to add patient:', error);
      throw error;
    }
  };

  const refreshPatients = async () => {
    await loadPatients();
  };

  const updatePatientStage = async (patientId: string, stage: WorkflowStage, status: StageStatus) => {
    try {
      // Update local state immediately
      setPatients(currentPatients => 
        currentPatients.map(p => {
          if (p.id === patientId) {
            return {
              ...p,
              stages: {
                ...p.stages,
                [stage]: {
                  ...p.stages[stage],
                  status,
                  completedAt: status === 'Completed' ? new Date().toISOString() : undefined,
                  completedBy: status === 'Completed' ? user?.name : undefined
                }
              }
            };
          }
          return p;
        })
      );

      // Make API call
      await apiService.updatePatientStage(patientId, stage, status);
      
      // Reload patients to ensure we're in sync with server
      await loadPatients();
    } catch (error) {
      console.error('Failed to update patient stage:', error);
      // Reload patients to revert to server state if there was an error
      await loadPatients();
      throw error;
    }
  };

  const getPatientsByRole = async (role: UserRole): Promise<Patient[]> => {
    try {
      return await apiService.getPatientsByRole(role);
    } catch (error) {
      console.error('Failed to get patients by role:', error);
      return [];
    }
  };

  return (
    <DataContext.Provider value={{ 
      patients, 
      addPatient, 
      updatePatientStage, 
      getPatientsByRole,
      isLoading,
      error,
      refreshPatients
    }}>
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
