
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientProfile } from '@/types/emr.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

interface PatientCardProps {
  patient: PatientProfile;
  showActions?: boolean;
}

export default function PatientCard({ patient, showActions = true }: PatientCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{patient.medical_id}</CardTitle>
            <CardDescription className="mt-1">
              Created {formatDistance(new Date(patient.created_at), new Date(), { addSuffix: true })}
            </CardDescription>
          </div>
          
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Patient Record
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Blood Group</div>
            <div className="font-medium">{patient.blood_group || 'Not recorded'}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Height/Weight</div>
            <div className="font-medium">
              {patient.height ? `${patient.height} cm` : '—'} 
              {patient.weight ? ` / ${patient.weight} kg` : ''}
              {!patient.height && !patient.weight && 'Not recorded'}
            </div>
          </div>
          
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">Allergies</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.allergies.map((allergy) => (
                  <Badge key={allergy} variant="secondary" className="text-xs">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">Chronic Conditions</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.chronic_conditions.map((condition) => (
                  <Badge key={condition} variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-between pt-2 border-t bg-slate-50/50">
          <Link to={`/emr/patients/${patient.id}`}>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <User size={14} />
              View Profile
            </Button>
          </Link>
          
          <Link to={`/emr/patients/${patient.id}/visits`}>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Calendar size={14} />
              View Visits
            </Button>
          </Link>
          
          <Link to={`/emr/patients/${patient.id}/records`}>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <FileText size={14} />
              Medical Records
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
