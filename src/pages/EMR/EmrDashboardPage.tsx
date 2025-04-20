
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Clipboard, Activity, FileText, PlusSquare, Users, ClipboardList } from 'lucide-react';
import { useEmrPatients } from '@/hooks/useEmrPatients';
import { useEmrVisits } from '@/hooks/useEmrVisits';
import PatientCard from '@/components/EMR/PatientCard';
import VisitCard from '@/components/EMR/VisitCard';

const EmrDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const isPatient = profile?.role === 'patient';
  const isDoctor = profile?.role === 'doctor';
  const isNurse = profile?.role === 'nurse';
  const isAdmin = profile?.role === 'admin';
  const isStaff = isDoctor || isNurse || isAdmin;
  
  const { patients, isLoading: patientsLoading } = useEmrPatients();
  const { visits, isLoading: visitsLoading } = useEmrVisits(isPatient ? profile?.id : undefined);
  
  // Get recent data
  const recentPatients = patients.slice(0, 3);
  const recentVisits = visits.slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Electronic Medical Records</h1>
          <p className="text-muted-foreground">
            {isPatient
              ? "View your medical history and records"
              : "Manage patient records and medical history"}
          </p>
        </div>
        
        {isStaff && (
          <div className="flex gap-2">
            <Link to="/emr/patients/new">
              <Button className="gap-2">
                <PlusSquare className="h-4 w-4" />
                New Patient
              </Button>
            </Link>
            <Link to="/emr/visits/new">
              <Button variant="outline" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                New Visit
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Patients</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patientsLoading ? "—" : isPatient ? 1 : patients.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isPatient 
                ? "Your patient record" 
                : `${patients.length} patient records`}
            </p>
            
            <div className="mt-4">
              <Link to="/emr/patients">
                <Button variant="outline" size="sm" className="w-full">
                  {isPatient ? "View My Profile" : "View All Patients"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Clipboard className="h-4 w-4 text-muted-foreground" />
                <span>Medical Visits</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {visitsLoading ? "—" : visits.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isPatient 
                ? `${visits.length} recorded visits` 
                : `Across all patients`}
            </p>
            
            <div className="mt-4">
              <Link to="/emr/visits">
                <Button variant="outline" size="sm" className="w-full">
                  View All Visits
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Medical Records</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Access</div>
                <p className="text-xs text-muted-foreground mt-1">
                  View and manage documents
                </p>
              </div>
              
              <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            
            <div className="mt-4">
              <Link to="/emr/records">
                <Button variant="outline" size="sm" className="w-full">
                  Browse Medical Records
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Patients (for staff only) */}
      {isStaff && patients.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Patients</h2>
            <Link to="/emr/patients">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patientsLoading ? (
              <p>Loading patients...</p>
            ) : recentPatients.length > 0 ? (
              recentPatients.map(patient => (
                <PatientCard key={patient.id} patient={patient} />
              ))
            ) : (
              <p className="text-muted-foreground col-span-3">No patients found.</p>
            )}
          </div>
        </div>
      )}
      
      {/* Recent Visits */}
      {visits.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Medical Visits</h2>
            <Link to="/emr/visits">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visitsLoading ? (
              <p>Loading visits...</p>
            ) : recentVisits.length > 0 ? (
              recentVisits.map(visit => (
                <VisitCard 
                  key={visit.id} 
                  visit={visit} 
                  showPatientLink={isStaff} 
                />
              ))
            ) : (
              <p className="text-muted-foreground col-span-3">No visits found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmrDashboardPage;
