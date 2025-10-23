import { Patient, UserRole } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Activity } from 'lucide-react';
import { workflowOrder } from '@/lib/utils';

interface StatsCardsProps {
  patients: Patient[];
  userRole?: UserRole;
}

export default function StatsCards({ patients, userRole }: StatsCardsProps) {
  const totalPatients = patients.length;
  
  const myPendingTasks = userRole
    ? patients.filter(patient => {
        const currentStage = workflowOrder.find(stage => patient.stages[stage].status === 'Pending');
        return currentStage ? patient.stages[currentStage].assignedTo === userRole : false;
      }).length
    : 0;

  const inProgress = patients.filter(patient => {
    const stages = Object.values(patient.stages);
    const hasCompleted = stages.some(s => s.status === 'Completed');
    const hasPending = stages.some(s => s.status === 'Pending');
    return hasCompleted && hasPending;
  }).length;

  const stats = [
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'My Pending Tasks',
      value: myPendingTasks,
      icon: Clock,
      color: 'text-status-pending',
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: Activity,
      color: 'text-status-approved',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
