
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DoctorVisit } from '@/integrations/supabase/database.types';

export const useDoctorVisits = (userId?: string) => {
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [loading, setLoading] = useState(true);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    const fetchVisits = async () => {
      if (!userId) {
        setLoading(false);
        setVisits([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("doctor_visits")
          .select("*")
          .eq("patient_id", userId)  // Only fetch this user's visits
          .order("created_at", { ascending: false });

        if (error) throw error;

        setVisits(data || []);
      } catch (error: any) {
        console.error("Error fetching visits:", error.message);
        toast.error("Failed to load your visits");
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();

    // Subscribe to changes for this user's visits using real-time
    const channel = supabase
      .channel('user-visits')
      .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'doctor_visits',
            filter: userId ? `patient_id=eq.${userId}` : undefined
          }, 
          (payload) => {
            console.log('Real-time update for visits:', payload);
            
            // Handle different events
            if (payload.eventType === 'INSERT') {
              // Add the new visit to the list
              setVisits(prev => [payload.new as DoctorVisit, ...prev]);
              toast.success("Your visit has been registered");
            } else if (payload.eventType === 'UPDATE') {
              // Update the visit in the list
              setVisits(prev => 
                prev.map(visit => 
                  visit.id === payload.new.id ? payload.new as DoctorVisit : visit
                )
              );
              // Toast notification for status updates
              if (payload.old.status !== payload.new.status) {
                toast.info(`Visit status updated to: ${payload.new.status}`);
              }
            } else if (payload.eventType === 'DELETE') {
              // Remove the visit from the list
              setVisits(prev => 
                prev.filter(visit => visit.id !== payload.old.id)
              );
            }
          })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    visits,
    loading,
    formatDate
  };
};
