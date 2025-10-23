import { Patient, UserRole } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, ArrowRight } from 'lucide-react';
import { getCurrentStage, getCompletedStagesCount, workflowOrder } from '@/lib/utils';

interface PatientCardCompactProps {
  patient: Patient;
  onClick: () => void;
  userRole?: UserRole;
}

export default function PatientCardCompact({ patient, onClick, userRole }: PatientCardCompactProps) {
  const currentStage = getCurrentStage(patient);
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{patient.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {patient.patientId}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                {patient.age}y, {patient.gender}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right flex flex-col items-end gap-1">
              <Badge variant="secondary" className="text-xs">
                {currentStage?.stage || 'No stage'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {currentStage?.status === 'Pending' ? `Waiting for ${currentStage.assignedTo}` : 'Completed'}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}