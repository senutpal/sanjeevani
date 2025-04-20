
import React, { useState } from 'react';
import { useEmrPatients } from '@/hooks/useEmrPatients';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PatientCard from '@/components/EMR/PatientCard';
import EmptyState from '@/components/EmptyState';
import { Search, UserPlus, Loader2 } from 'lucide-react';

const PatientsListPage: React.FC = () => {
  const { patients, isLoading, error } = useEmrPatients();
  const [searchQuery, setSearchQuery] = useState('');
  const { profile } = useAuth();
  const isPatient = profile?.role === 'patient';
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    // If it's a patient user, they can only see their own profile anyway
    if (isPatient) return true;
    
    // For medical staff, filter based on search
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const medicalIdMatch = patient.medical_id.toLowerCase().includes(query);
    const bloodGroupMatch = patient.blood_group?.toLowerCase().includes(query) || false;
    const allergiesMatch = patient.allergies?.some(a => a.toLowerCase().includes(query)) || false;
    const conditionsMatch = patient.chronic_conditions?.some(c => c.toLowerCase().includes(query)) || false;
    
    return medicalIdMatch || bloodGroupMatch || allergiesMatch || conditionsMatch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isPatient ? 'Your Patient Profile' : 'Patients'}
          </h1>
          <p className="text-muted-foreground">
            {isPatient 
              ? 'View and manage your medical profile'
              : 'View and manage patient medical records'}
          </p>
        </div>
        
        {!isPatient && (
          <Link to="/emr/patients/new">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              New Patient
            </Button>
          </Link>
        )}
      </div>
      
      {!isPatient && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Medical ID, Blood Group, Allergies..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : error ? (
        <EmptyState
          title="Error loading patients"
          description={error.message}
        />
      ) : filteredPatients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description={searchQuery ? "Try adjusting your search" : "Get started by adding a patient"}
          action={
            !isPatient && !searchQuery ? (
              <Link to="/emr/patients/new">
                <Button>Add a Patient</Button>
              </Link>
            ) : searchQuery ? (
              <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsListPage;
