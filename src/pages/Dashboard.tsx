import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, UserPlus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PatientCard from '@/components/PatientCard';
import StatsCards from '@/components/StatsCards';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { patients, getPatientsByRole } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const myPatients = user ? getPatientsByRole(user.role) : [];
  const allPatients = patients;

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
                <h1 className="text-xl font-bold">RadFlow Compass</h1>
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
            <CardContent className="space-y-4">
              {myPatients.map(patient => (
                <PatientCard key={patient.id} patient={patient} showActions userRole={user?.role} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* All Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Patients ({allPatients.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allPatients.map(patient => (
              <PatientCard key={patient.id} patient={patient} userRole={user?.role} />
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
