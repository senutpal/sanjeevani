
import React, { useState } from 'react';
import { useAdmissions } from '@/hooks/useAdmissions';
import AdmissionsTable from '@/components/AdmissionsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Search, X } from 'lucide-react';
import { MotionConfig } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const AdmissionsPage: React.FC = () => {
  const { patients, isLoading, error, setFilters, discharge } = useAdmissions();
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get unique ward and status values for filters
  const wards = [...new Set(patients.map((patient) => patient.ward))];
  const statuses = [...new Set(patients.map((patient) => patient.status))];

  // Apply search filter
  const filteredPatients = patients.filter((patient) =>
    searchInput 
      ? patient.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchInput.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchInput.toLowerCase())
      : true
  );

  const handleApplyFilters = () => {
    setFilters({
      ward: wardFilter !== 'all' ? wardFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    });
  };

  const handleClearFilters = () => {
    setWardFilter('all');
    setStatusFilter('all');
    setFilters({});
  };

  const handleDischarge = async (patientId: string) => {
    const success = await discharge(patientId);
    if (success) {
      toast({
        title: "Patient discharged",
        description: "The patient has been successfully discharged.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to discharge patient. Please try again.",
      });
    }
    return success;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Patient Admissions</h1>
            <p className="text-muted-foreground">
              Manage and monitor all admitted patients
            </p>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8 w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button 
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchInput('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={wardFilter} onValueChange={setWardFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {wards.map((ward) => (
                <SelectItem key={ward} value={ward}>{ward}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Admissions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{patients.length}</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Critical Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-hospital-red">
                  {patients.filter(p => p.status === 'critical').length}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ready for Discharge</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-hospital-green">
                  {patients.filter(p => p.status === 'ready-for-discharge').length}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Avg. Stay Duration</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">
                  {patients.length > 0 
                    ? Math.round(
                        patients.reduce(
                          (sum, p) => sum + (Date.now() - new Date(p.admissionDate).getTime()) / (1000 * 60 * 60 * 24), 
                          0
                        ) / patients.length
                      )
                    : 0} days
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Admissions Table */}
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load patient admissions. Please try again later.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <AdmissionsTable 
            patients={filteredPatients} 
            onDischarge={handleDischarge}
          />
        )}
      </div>
    </MotionConfig>
  );
};

export default AdmissionsPage;
