
import { useState, useEffect } from 'react';
import { InventoryItem } from '@/lib/types/types';
import { fetchInventory } from '@/lib/api/fetchData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInventoryData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchInventory();
      setInventoryItems(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err as Error);
      toast.error("Failed to load inventory items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();

    // Subscribe to real-time changes to inventory
    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'inventory'
          }, 
          (payload) => {
            console.log('Real-time update for inventory:', payload);
            fetchInventoryData();
          })
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refetchInventory = () => {
    return fetchInventoryData();
  };

  return { inventoryItems, isLoading, error, refetchInventory };
};
