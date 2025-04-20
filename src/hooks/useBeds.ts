
import { useState, useEffect } from 'react';
import { Bed } from '@/lib/types/types';
import { fetchBeds } from '@/lib/api/fetchData';

export const useBeds = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadBeds = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBeds();
        setBeds(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBeds();
  }, []);

  return { beds, isLoading, error };
};
