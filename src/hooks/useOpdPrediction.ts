
import { useState, useEffect } from 'react';
import { OpdPrediction } from '@/lib/types/types';

// Mock function to fetch prediction data - would be replaced by actual API call
const fetchPredictionData = async (): Promise<OpdPrediction[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate 7 days of prediction data with hourly intervals
  const now = new Date();
  const predictions: OpdPrediction[] = [];
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    
    // Generate hourly predictions from 7am to 9pm
    for (let hour = 7; hour <= 21; hour++) {
      // Generate random count with morning and evening peaks
      let baseCount = 5 + Math.floor(Math.random() * 10);
      
      // Morning peak around 9-11am
      if (hour >= 9 && hour <= 11) {
        baseCount += 10 + Math.floor(Math.random() * 15);
      }
      
      // Evening peak around 4-7pm
      if (hour >= 16 && hour <= 19) {
        baseCount += 15 + Math.floor(Math.random() * 20);
      }
      
      // Weekend adjustment (higher on Monday, lower on weekend)
      const dayOfWeek = (date.getDay() + day) % 7;
      if (dayOfWeek === 1) { // Monday
        baseCount = Math.floor(baseCount * 1.3);
      } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
        baseCount = Math.floor(baseCount * 0.7);
      }
      
      // Determine if this is a peak hour
      const isPeak = (hour >= 9 && hour <= 11) || (hour >= 16 && hour <= 19);
      
      predictions.push({
        date: dateStr,
        hour,
        predictedCount: baseCount,
        isPeak
      });
    }
  }
  
  return predictions;
};

export const useOpdPrediction = () => {
  const [predictions, setPredictions] = useState<OpdPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPredictionData();
        setPredictions(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPredictions();
  }, []);

  return { predictions, isLoading, error };
};
