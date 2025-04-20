
import { useState, useEffect } from 'react';
import { OpdPatient } from '@/lib/types/types';
import { fetchOpdQueue } from '@/lib/api/fetchData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OpdQueueItem } from '@/integrations/supabase/database.types';

interface UseQueuePollOptions {
  interval?: number; // in milliseconds
  initialData?: OpdPatient[];
}

export const useQueuePoll = ({ interval = 30000, initialData = [] }: UseQueuePollOptions = {}) => {
  const [data, setData] = useState<OpdPatient[]>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const markNewPatients = (currentPatients: OpdPatient[], newPatients: OpdPatient[]): OpdPatient[] => {
      // Get existing patient IDs
      const existingIds = new Set(currentPatients.map(patient => patient.id));
      
      // Mark new patients
      return newPatients.map(patient => ({
        ...patient,
        isNew: !existingIds.has(patient.id)
      }));
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In development/demo, use mock data
        if (process.env.NODE_ENV === 'development') {
          const newData = await fetchOpdQueue();
          setData(prevData => markNewPatients(prevData, newData));
          setLoading(false);
          return;
        }

        // In production, fetch directly from Supabase
        const { data: opdQueueData, error: fetchError } = await supabase
          .from('opd_queue')
          .select('*')
          .order('joined_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Convert Supabase data to OpdPatient format
        // Type the response data properly
        const queueItems = opdQueueData as OpdQueueItem[];
        const formattedData: OpdPatient[] = queueItems.map(item => ({
          id: item.id,
          name: item.name,
          department: item.department,
          waitTime: item.wait_time,
          status: item.status,
          assignedDoctor: item.assigned_doctor || undefined,
          joinedAt: item.joined_at,
          tokenNumber: item.token_number,
          registrationTime: item.registration_time || item.joined_at
        }));

        setData(prevData => markNewPatients(prevData, formattedData));
        setError(null);
      } catch (err) {
        console.error('Error fetching OPD queue:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Subscribe to real-time changes in the opd_queue table
    const channel = supabase
      .channel('opd-queue-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'opd_queue' }, 
          (payload) => {
            console.log('Real-time update for OPD queue:', payload);
            
            // Handle different event types
            if (payload.eventType === 'INSERT') {
              // A new patient has been added
              const newItem = payload.new as OpdQueueItem;
              const newPatient: OpdPatient = {
                id: newItem.id,
                name: newItem.name,
                department: newItem.department,
                waitTime: newItem.wait_time,
                status: newItem.status,
                assignedDoctor: newItem.assigned_doctor || undefined,
                joinedAt: newItem.joined_at,
                tokenNumber: newItem.token_number,
                registrationTime: newItem.registration_time || newItem.joined_at,
                isNew: true
              };
              
              setData(prevData => [newPatient, ...prevData]);
              toast.info(`New patient added to queue: ${newItem.name}`);
            } else if (payload.eventType === 'UPDATE') {
              // A patient's status has been updated
              const updatedItem = payload.new as OpdQueueItem;
              
              setData(prevData => 
                prevData.map(patient => 
                  patient.id === updatedItem.id 
                    ? {
                        ...patient,
                        status: updatedItem.status,
                        waitTime: updatedItem.wait_time,
                        assignedDoctor: updatedItem.assigned_doctor || undefined,
                        isNew: false
                      } 
                    : patient
                )
              );
            } else if (payload.eventType === 'DELETE') {
              // A patient has been removed
              const deletedItemId = payload.old.id;
              setData(prevData => prevData.filter(patient => patient.id !== deletedItemId));
            }
          })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Set up polling as a fallback
    const pollInterval = setInterval(fetchData, interval);

    // Clean up
    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [interval]);

  const refetch = async () => {
    setLoading(true);
    try {
      const newData = await fetchOpdQueue();
      setData(newData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
