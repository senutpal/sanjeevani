
import React from 'react';
import { DoctorVisit } from '@/integrations/supabase/database.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface VisitHistoryCardProps {
  visits: DoctorVisit[];
  loadingVisits: boolean;
  formatDate: (dateString?: string) => string;
}

const VisitHistoryCard: React.FC<VisitHistoryCardProps> = ({ 
  visits,
  loadingVisits,
  formatDate
}) => {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Visit History</CardTitle>
        <CardDescription>View your recent and upcoming appointments</CardDescription>
      </CardHeader>
      <CardContent>
        {loadingVisits ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You don't have any visits yet.</p>
            <p className="mt-1">Register a new visit to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Token #</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">{visit.department}</TableCell>
                    <TableCell>{formatDate(visit.appointment_date)}</TableCell>
                    <TableCell>
                      {visit.token_number ? 
                        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                          #{visit.token_number}
                        </span> : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      {visit.assigned_doctor || 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`flex w-fit items-center gap-1 ${getStatusColor(visit.status)}`}>
                        {getStatusIcon(visit.status)}
                        {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisitHistoryCard;
