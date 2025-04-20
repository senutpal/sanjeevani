
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MedicalVisit, Diagnosis, Prescription } from '@/types/emr.types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useEmrVisits(patientId?: string) {
  const [visits, setVisits] = useState<MedicalVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useAuth();
  
  const fetchVisits = async () => {
    if (!patientId && profile?.role === 'patient') {
      // If a patient is viewing without explicitly providing a patientId
      patientId = profile.id;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('medical_visits')
        .select(`
          *,
          doctor:doctor_id(name, department, avatar)
        `);
      
      // Filter by patient if patientId is provided
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query.order('visit_date', { ascending: false });
      
      if (error) throw error;
      
      setVisits(data as MedicalVisit[]);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching visits:', error);
      setError(error);
      toast.error('Failed to load medical visits');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVisits();
    
    // Subscribe to changes
    const visitsChanges = supabase
      .channel('emr-visits-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'medical_visits' },
          (payload) => {
            console.log('Medical visit change:', payload);
            // Refresh the visits list when changes occur
            fetchVisits();
          })
      .subscribe();
      
    return () => {
      supabase.removeChannel(visitsChanges);
    };
  }, [patientId, profile?.id, profile?.role]);
  
  const createVisit = async (visitData: Partial<MedicalVisit>) => {
    try {
      const { data, error } = await supabase
        .from('medical_visits')
        .insert(visitData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Medical visit created successfully`);
      return data as MedicalVisit;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating visit:', error);
      toast.error('Failed to create medical visit');
      throw error;
    }
  };
  
  const updateVisit = async (id: string, visitData: Partial<MedicalVisit>) => {
    try {
      const { data, error } = await supabase
        .from('medical_visits')
        .update(visitData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Medical visit updated successfully`);
      return data as MedicalVisit;
    } catch (err) {
      const error = err as Error;
      console.error('Error updating visit:', error);
      toast.error('Failed to update medical visit');
      throw error;
    }
  };
  
  const getVisitById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('medical_visits')
        .select(`
          *,
          doctor:doctor_id(name, department, avatar),
          diagnoses:diagnoses(*),
          prescriptions:prescriptions(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as MedicalVisit;
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching visit:', error);
      toast.error('Failed to load medical visit');
      throw error;
    }
  };
  
  const addDiagnosis = async (diagnosis: Partial<Diagnosis>) => {
    try {
      const { data, error } = await supabase
        .from('diagnoses')
        .insert(diagnosis)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Diagnosis added successfully');
      return data as Diagnosis;
    } catch (err) {
      const error = err as Error;
      console.error('Error adding diagnosis:', error);
      toast.error('Failed to add diagnosis');
      throw error;
    }
  };
  
  const addPrescription = async (prescription: Partial<Prescription>) => {
    try {
      // Check for medication conflicts using the database function
      if (prescription.medicines && prescription.visit_id) {
        const { data: visitData } = await supabase
          .from('medical_visits')
          .select('patient_id')
          .eq('id', prescription.visit_id)
          .single();
          
        if (visitData) {
          const { data: conflicts } = await supabase.rpc(
            'check_medication_conflicts', 
            { 
              patient_id: visitData.patient_id,
              new_medications: JSON.stringify(prescription.medicines)
            }
          );
          
          if (conflicts && conflicts.length > 0) {
            const conflictMessages = conflicts.map(
              c => `${c.conflict_medicine} has ${c.conflict_type} with ${c.conflicting_with}`
            );
            
            toast.warning(
              'Medication conflicts detected!', 
              { description: conflictMessages.join('\n') }
            );
            
            // Allow user to continue despite conflicts
            // In a real app, you might want to add a confirmation step
          }
        }
      }
      
      const { data, error } = await supabase
        .from('prescriptions')
        .insert(prescription)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Prescription added successfully');
      return data as Prescription;
    } catch (err) {
      const error = err as Error;
      console.error('Error adding prescription:', error);
      toast.error('Failed to add prescription');
      throw error;
    }
  };
  
  return {
    visits,
    isLoading,
    error,
    refreshVisits: fetchVisits,
    createVisit,
    updateVisit,
    getVisitById,
    addDiagnosis,
    addPrescription
  };
}
