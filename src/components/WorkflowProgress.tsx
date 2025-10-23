import { Patient, UserRole, WorkflowStage } from '@/types';
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { canStageBeCompleted } from '@/lib/utils';

interface WorkflowProgressProps {
  patient: Patient;
  showActions?: boolean;
  userRole?: UserRole;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  'Registration',
  'Mask Moulding',
  'CT Simulation',
  'Contouring',
  'Approval',
  'Planning',
  'Treatment',
  'Review',
];

export default function WorkflowProgress({ patient, showActions, userRole }: WorkflowProgressProps) {
  const { updatePatientStage } = useData();
  const { toast } = useToast();

  const [updatingStage, setUpdatingStage] = useState<WorkflowStage | null>(null);

  const handleComplete = async (stage: WorkflowStage) => {
    if (!canStageBeCompleted(patient, stage)) {
      toast({
        title: 'Cannot Complete Stage',
        description: 'Previous stages must be completed first',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdatingStage(stage);
      await updatePatientStage(patient.id, stage, 'Completed');
      toast({
        title: 'Stage Completed',
        description: `${stage} marked as completed for ${patient.name}`,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update stage. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStage(null);
    }
  };

  return (
    <div className="space-y-2">
      {WORKFLOW_STAGES.map((stage, index) => {
        const stageData = patient.stages[stage];
        const isCompleted = stageData.status === 'Completed';
        const isPending = stageData.status === 'Pending';
        const isAssignedToMe = userRole === stageData.assignedTo;
        const canComplete = showActions && isAssignedToMe && isPending;

        return (
          <div
            key={stage}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              isCompleted 
                ? 'bg-status-completed/10 border-status-completed/30' 
                : isPending
                ? 'bg-status-pending/10 border-status-pending/30'
                : 'bg-muted border-border'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-status-completed" />
                ) : isPending ? (
                  <Clock className="h-5 w-5 text-status-pending" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {index + 1}. {stage}
                  </span>
                  <Badge variant={isCompleted ? 'default' : 'outline'} className="text-xs">
                    {stageData.assignedTo}
                  </Badge>
                </div>
                {stageData.completedAt && stageData.completedBy && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed by {stageData.completedBy} on{' '}
                    {new Date(stageData.completedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={isCompleted ? 'default' : 'secondary'}
                className={
                  isCompleted
                    ? 'bg-status-completed text-white'
                    : 'bg-status-pending text-white'
                }
              >
                {stageData.status}
              </Badge>
              
              {canComplete && (
                <Button
                  size="sm"
                  onClick={() => handleComplete(stage)}
                  variant="outline"
                  disabled={updatingStage === stage || !canStageBeCompleted(patient, stage)}
                  title={!canStageBeCompleted(patient, stage) ? "Complete previous stages first" : ""}
                  className="relative"
                >
                  {!canStageBeCompleted(patient, stage) && (
                    <AlertCircle className="h-3 w-3 text-muted-foreground absolute -left-4" />
                  )}
                  {updatingStage === stage ? 'Updating...' : 'Mark Complete'}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
