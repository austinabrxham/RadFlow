import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Patient, WorkflowStage } from '@/types';

export default function RegisterPatient() {
  const navigate = useNavigate();
  const { addPatient } = useData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    diagnosis: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient: Omit<Patient, 'id'> = {
      ...formData,
      age: parseInt(formData.age),
      registeredAt: new Date().toISOString(),
      stages: {
        'Registration': { status: 'Completed', assignedTo: 'Radiographer', completedAt: new Date().toISOString() },
        'Mask Moulding': { status: 'Pending', assignedTo: 'Radiographer' },
        'CT Simulation': { status: 'Pending', assignedTo: 'Radiographer' },
        'Contouring': { status: 'Pending', assignedTo: 'Resident' },
        'Approval': { status: 'Pending', assignedTo: 'Consultant' },
        'Planning': { status: 'Pending', assignedTo: 'Physicist' },
        'Treatment': { status: 'Pending', assignedTo: 'Radiographer' },
        'Review': { status: 'Pending', assignedTo: 'Consultant' },
      },
    };

    try {
      await addPatient(newPatient);
      
      toast({
        title: 'Patient Registered',
        description: `${formData.name} has been successfully registered.`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Failed to register patient. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-medical-bg p-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Register New Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    placeholder="RT2025004"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="eg. Jones Joseph"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="45"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: 'Male' | 'Female' | 'Other') => 
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="e.g., Prostate Cancer"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Register Patient
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
