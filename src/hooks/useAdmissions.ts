
import { useState, useEffect } from 'react';
import { AdmittedPatient } from '@/lib/types/types';

// Mock function to fetch admitted patients data - would be replaced by actual API call
const fetchAdmittedPatients = async (): Promise<AdmittedPatient[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock patient data
  const wards = ['General', 'ICU', 'Pediatric', 'Orthopedic', 'Cardiology', 'Neurology'];
  const statuses: Array<'critical' | 'stable' | 'recovering' | 'ready-for-discharge'> = [
    'critical', 'stable', 'recovering', 'ready-for-discharge'
  ];
  const diagnoses = [
    'Pneumonia', 'Fracture', 'Heart Failure', 'Stroke', 'Appendicitis', 
    'COVID-19', 'Diabetes Complication', 'Head Injury', 'Kidney Failure', 'Liver Disease'
  ];
  const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'James', 'Patricia', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  
  const patients: AdmittedPatient[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const ward = wards[Math.floor(Math.random() * wards.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    
    // Generate random admission date within the last 30 days
    const admissionDate = new Date();
    admissionDate.setDate(admissionDate.getDate() - Math.floor(Math.random() * 30));
    
    patients.push({
      id: `ADM${String(i).padStart(5, '0')}`,
      name: `${firstName} ${lastName}`,
      admissionDate: admissionDate.toISOString(),
      ward,
      bedId: `bed-${Math.floor(100 + Math.random() * 900)}`,
      bedNumber: `${ward.charAt(0)}${Math.floor(1 + Math.random() * 4)}-${String(Math.floor(1 + Math.random() * 20)).padStart(2, '0')}`,
      diagnosis,
      status
    });
  }
  
  return patients;
};

export const useAdmissions = () => {
  const [patients, setPatients] = useState<AdmittedPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<{
    ward?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAdmittedPatients();
        
        // Apply filters if any
        let filteredData = [...data];
        
        if (filters.ward) {
          filteredData = filteredData.filter(patient => 
            patient.ward.toLowerCase() === filters.ward?.toLowerCase()
          );
        }
        
        if (filters.status) {
          filteredData = filteredData.filter(patient => 
            patient.status.toLowerCase() === filters.status?.toLowerCase()
          );
        }
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          filteredData = filteredData.filter(patient => 
            new Date(patient.admissionDate) >= fromDate
          );
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          filteredData = filteredData.filter(patient => 
            new Date(patient.admissionDate) <= toDate
          );
        }
        
        setPatients(filteredData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, [filters]);

  const discharge = async (patientId: string) => {
    try {
      // Here would be the actual API call to discharge a patient
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state
      setPatients(prevPatients => 
        prevPatients.filter(patient => patient.id !== patientId)
      );
      
      return true;
    } catch (error) {
      console.error("Error discharging patient:", error);
      return false;
    }
  };

  return { 
    patients, 
    isLoading, 
    error, 
    setFilters,
    discharge
  };
};
