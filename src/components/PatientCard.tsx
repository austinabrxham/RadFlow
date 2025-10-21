import { Patient, UserRole, WorkflowStage } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WorkflowProgress from './WorkflowProgress';
import { Calendar, User, FileText } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  showActions?: boolean;
  userRole?: UserRole;
}

export default function PatientCard({ patient, showActions, userRole }: PatientCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{patient.name}</h3>
              <Badge variant="outline" className="text-xs">
                {patient.patientId}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {patient.age}y, {patient.gender}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {patient.diagnosis}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(patient.registeredAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="ml-4">
            <img 
              src={patient.qrCode} 
              alt={`QR Code for ${patient.patientId}`}
              className="w-20 h-20 border-2 border-border rounded"
            />
          </div>
        </div>

        <WorkflowProgress 
          patient={patient} 
          showActions={showActions} 
          userRole={userRole} 
        />
      </CardContent>
    </Card>
  );
}
