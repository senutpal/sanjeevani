import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PatientProfile } from '@/types/emr.types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useEmrPatients() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useAuth();
  
  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If the user is a patient, only fetch their own profile
      // Otherwise for staff, fetch all patient profiles
      let query = supabase.from('patient_profiles').select('*');
      
      if (profile?.role === 'patient') {
        query = query.eq('id', profile.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPatients(data as PatientProfile[]);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching patients:', error);
      setError(error);
      toast.error('Failed to load patients data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatients();
    
    // Subscribe to changes
    const patientChanges = supabase
      .channel('emr-patients-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'patient_profiles' },
          (payload) => {
            console.log('Patient profile change:', payload);
            // Refresh the patients list when changes occur
            fetchPatients();
          })
      .subscribe();
      
    return () => {
      supabase.removeChannel(patientChanges);
    };
  }, [profile?.id, profile?.role]);
  
  const createPatient = async (patientData: Partial<PatientProfile>) => {
    try {
      if (!patientData.medical_id) {
        // Generate medical ID using the database function
        const { data: medicalIdData } = await supabase.rpc('generate_medical_id');
        patientData.medical_id = medicalIdData;
      }
      
      const { data, error } = await supabase
        .from('patient_profiles')
        .insert(patientData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Patient profile created successfully`);
      return data as PatientProfile;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating patient:', error);
      toast.error('Failed to create patient profile');
      throw error;
    }
  };
  
  const updatePatient = async (id: string, patientData: Partial<PatientProfile>) => {
    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .update(patientData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Patient profile updated successfully`);
      return data as PatientProfile;
    } catch (err) {
      const error = err as Error;
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient profile');
      throw error;
    }
  };
  
  const getPatientById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as PatientProfile;
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching patient:', error);
      toast.error('Failed to load patient data');
      throw error;
    }
  };
  
  return {
    patients,
    isLoading,
    error,
    refreshPatients: fetchPatients,
    createPatient,
    updatePatient,
    getPatientById
  };
}
