
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalVisit } from '@/types/emr.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ClipboardList, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface VisitCardProps {
  visit: MedicalVisit;
  showPatientLink?: boolean;
}

export default function VisitCard({ visit, showPatientLink = false }: VisitCardProps) {
  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {visit.visit_type}
            </CardTitle>
            <CardDescription className="mt-1">
              {format(new Date(visit.visit_date), 'PPP • h:mm a')}
            </CardDescription>
          </div>
          
          {getStatusBadge(visit.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-3">
          {visit.chief_complaint && (
            <div>
              <div className="text-sm text-muted-foreground">Chief Complaint</div>
              <div className="font-medium mt-1">{visit.chief_complaint}</div>
            </div>
          )}
          
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Doctor</div>
              <div className="font-medium mt-1">
                {visit.doctor?.name || 'Not Assigned'}
                {visit.doctor?.department && ` (${visit.doctor.department})`}
              </div>
            </div>
            
            {visit.diagnoses && visit.diagnoses.length > 0 && (
              <div>
                <div className="text-sm text-muted-foreground">Diagnoses</div>
                <div className="font-medium mt-1">{visit.diagnoses.length} recorded</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t bg-slate-50/50">
        <Link to={`/emr/visits/${visit.id}`}>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <ClipboardList size={14} />
            Visit Details
          </Button>
        </Link>
        
        {showPatientLink && (
          <Link to={`/emr/patients/${visit.patient_id}`}>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <User size={14} />
              Patient Profile
            </Button>
          </Link>
        )}
        
        <Link to={`/emr/visits/${visit.id}/records`}>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <FileText size={14} />
            Medical Records
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
