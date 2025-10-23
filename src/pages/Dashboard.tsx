import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LogOut, UserPlus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PatientCard from '@/components/PatientCard';
import PatientCardCompact from '@/components/PatientCardCompact';
import StatsCards from '@/components/StatsCards';
import { isPatientPendingForRole, getCompletedStagesCount } from '@/lib/utils';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { patients, getPatientsByRole, isLoading, error } = useData();
  const navigate = useNavigate();
  const [myPatients, setMyPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    if (user && patients) {
      // Filter patients where the current stage is assigned to the user's role
      const myPendingPatients = patients.filter(patient => 
        isPatientPendingForRole(patient, user.role)
      );
      setMyPatients(myPendingPatients);
    }
  }, [user, patients]);

  const allPatients = [...patients].sort((a, b) => {
    const aCompleted = getCompletedStagesCount(a);
    const bCompleted = getCompletedStagesCount(b);
    return aCompleted - bCompleted; // Sort in ascending order (least completed first)
  });

  return (
    <div className="min-h-screen bg-medical-bg">
      {/* Header */}
      <header className="bg-sidebar-bg text-sidebar-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">RadFlow</h1>
                <p className="text-sm text-sidebar-foreground/70">Radiation Therapy Workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-sidebar-foreground/70">{user?.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-sidebar-foreground/10 border-sidebar-foreground/20 text-sidebar-foreground hover:bg-sidebar-foreground/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <StatsCards patients={allPatients} userRole={user?.role} />

        {/* Action Buttons */}
        <div className="mb-6 flex gap-4">
          <Button onClick={() => navigate('/register-patient')} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Register New Patient
          </Button>
        </div>

        {/* My Pending Tasks */}
        {myPatients.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">My Pending Tasks ({myPatients.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myPatients.map(patient => (
                <PatientCardCompact
                  key={patient.id}
                  patient={patient}
                  userRole={user?.role}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setIsDetailsOpen(true);
                  }}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* All Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Patients ({allPatients.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allPatients.map(patient => (
              <PatientCardCompact
                key={patient.id}
                patient={patient}
                userRole={user?.role}
                onClick={() => {
                  setSelectedPatient(patient);
                  setIsDetailsOpen(true);
                }}
              />
            ))}
          </CardContent>
        </Card>

        {/* Patient Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl p-0">
            {selectedPatient && (
              <PatientCard
                patient={patients.find(p => p.id === selectedPatient.id) || selectedPatient}
                showActions
                userRole={user?.role}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
