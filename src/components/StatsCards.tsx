import { Patient, UserRole } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardCheck, Clock, Activity } from 'lucide-react';

interface StatsCardsProps {
  patients: Patient[];
  userRole?: UserRole;
}

export default function StatsCards({ patients, userRole }: StatsCardsProps) {
  const totalPatients = patients.length;
  
  const myPendingTasks = userRole
    ? patients.reduce((count, patient) => {
        const pendingStages = Object.values(patient.stages).filter(
          stage => stage.assignedTo === userRole && stage.status === 'Pending'
        );
        return count + pendingStages.length;
      }, 0)
    : 0;

  const completedToday = patients.filter(patient => {
    const today = new Date().toDateString();
    return Object.values(patient.stages).some(
      stage => stage.completedAt && new Date(stage.completedAt).toDateString() === today
    );
  }).length;

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
    {
      title: 'Completed Today',
      value: completedToday,
      icon: ClipboardCheck,
      color: 'text-status-completed',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
