
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Visit {
  id: string;
  department: string;
  status: string;
  appointment_date?: string;
  assigned_doctor?: string;
  created_at: string;
}

interface VisitHistoryTableProps {
  visits: Visit[];
  loadingVisits: boolean;
  formatDate: (dateString?: string) => string;
}

type SortField = 'department' | 'status' | 'appointment_date' | 'created_at';

const VisitHistoryTable: React.FC<VisitHistoryTableProps> = ({ visits, loadingVisits, formatDate }) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const sortedVisits = [...visits].sort((a, b) => {
    if (sortField === 'appointment_date') {
      const dateA = a.appointment_date ? new Date(a.appointment_date).getTime() : 0;
      const dateB = b.appointment_date ? new Date(b.appointment_date).getTime() : 0;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      return sortDirection === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
  });

  if (loadingVisits) {
    return <div className="text-center py-4">Loading your visits...</div>;
  }

  if (visits.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No visits found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('department')}
            >
              <div className="flex items-center">
                Department
                {sortField === 'department' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                {sortField === 'status' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('appointment_date')}
            >
              <div className="flex items-center">
                Appointment Date
                {sortField === 'appointment_date' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Doctor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVisits.map((visit) => (
            <TableRow key={visit.id} className="group">
              <TableCell className="font-medium">{visit.department}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  visit.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : visit.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : visit.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>{formatDate(visit.appointment_date)}</TableCell>
              <TableCell>{visit.assigned_doctor || "Not assigned"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitHistoryTable;
