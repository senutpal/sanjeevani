
import React, { useState } from 'react';
import { AdmittedPatient } from '@/lib/types/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { motion } from 'framer-motion';

interface AdmissionsTableProps {
  patients: AdmittedPatient[];
  onDischarge: (patientId: string) => Promise<boolean>;
}

const AdmissionsTable: React.FC<AdmissionsTableProps> = ({ 
  patients,
  onDischarge
}) => {
  const [discharging, setDischarging] = useState<string | null>(null);

  const handleDischarge = async (patientId: string) => {
    setDischarging(patientId);
    try {
      await onDischarge(patientId);
    } finally {
      setDischarging(null);
    }
  };

  const getStatusColor = (status: AdmittedPatient['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-hospital-red text-white';
      case 'stable':
        return 'bg-hospital-blue text-white';
      case 'recovering':
        return 'bg-hospital-yellow text-black';
      case 'ready-for-discharge':
        return 'bg-hospital-green text-white';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead>Ward & Bed</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No patients currently admitted
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <motion.tr
                key={patient.id}
                className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, x: -10 }}
                layout
              >
                <TableCell className="font-mono text-xs">{patient.id}</TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger>
                      <span className="text-sm underline decoration-dotted cursor-help">
                        {format(new Date(patient.admissionDate), 'MMM d, yyyy')}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Admission Details</p>
                        <p className="text-xs">
                          Admitted on: {format(new Date(patient.admissionDate), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-xs">
                          Time: {format(new Date(patient.admissionDate), 'h:mm a')}
                        </p>
                        <p className="text-xs">
                          Days in hospital: {Math.floor((Date.now() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{patient.ward}</span>
                  <span className="text-muted-foreground ml-1">({patient.bedNumber})</span>
                </TableCell>
                <TableCell>{patient.diagnosis}</TableCell>
                <TableCell>
                  <StatusBadge 
                    status={patient.status} 
                    colorClass={getStatusColor(patient.status)}
                    variant="outline"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={discharging === patient.id || patient.status !== 'ready-for-discharge'}
                    onClick={() => handleDischarge(patient.id)}
                  >
                    {discharging === patient.id ? 'Processing...' : 'Discharge'}
                  </Button>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdmissionsTable;
