
import React, { useState } from 'react';
import { OpdPatient } from '@/lib/types/types';
import StatusBadge from './StatusBadge';
import { getPatientStatusColor, getPatientStatusText, formatWaitTime } from '@/utils/statusColors';
import { assignDoctor, completePatient } from '@/lib/api/fetchData';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PatientQueueCardProps {
  patient: OpdPatient;
  onUpdate: () => void;
}

const PatientQueueCard: React.FC<PatientQueueCardProps> = ({ patient, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAssignDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) return;
    
    setLoading(true);
    try {
      await assignDoctor(patient.id, doctorName);
      toast.success(`Dr. ${doctorName} assigned to ${patient.name}`);
      onUpdate();
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to assign doctor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteVisit = async () => {
    setLoading(true);
    try {
      await completePatient(patient.id);
      toast.success(`${patient.name}'s visit marked as completed`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to complete visit');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Format registration time
  const registrationTime = patient.registrationTime ? 
    format(new Date(patient.registrationTime), 'PPp') : 
    format(new Date(patient.joinedAt), 'PPp');

  return (
    <div className={cn(
      "hospital-card",
      patient.isNew && "animate-fade-in",
      patient.status === 'completed' && "opacity-70"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">{patient.name}</h3>
          {patient.symptoms && (
            <p className="ml-0.5 mt-1 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
              {patient.symptoms}
            </p>
          )}
        </div>
        <StatusBadge 
          status={getPatientStatusText(patient.status)} 
          colorClass={getPatientStatusColor(patient.status)} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-y-2 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Department</p>
          <p className="font-medium">{patient.department}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Wait Time</p>
          <p className="font-medium">{formatWaitTime(patient.waitTime)}</p>
        </div>
        {patient.assignedDoctor && (
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Doctor</p>
            <p className="font-medium">{patient.assignedDoctor}</p>
          </div>
        )}
        <div className="col-span-2 mt-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Registration Time
          </p>
          <p className="text-sm">{registrationTime}</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        {patient.status === 'waiting' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">Assign Doctor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Doctor to {patient.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAssignDoctor} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-name">Doctor Name</Label>
                  <Input 
                    id="doctor-name" 
                    placeholder="Dr. Smith" 
                    value={doctorName} 
                    onChange={(e) => setDoctorName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Assigning...' : 'Assign'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
        
        {patient.status === 'assigned' && (
          <Button size="sm" onClick={handleCompleteVisit} disabled={loading}>
            {loading ? 'Updating...' : 'Complete Visit'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PatientQueueCard;
