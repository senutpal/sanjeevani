
import React from 'react';
import { useOpdPrediction } from '@/hooks/useOpdPrediction';
import OpdPredictionChart from '@/components/OpdPredictionChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const OpdPredictionPage: React.FC = () => {
  const { predictions, isLoading, error } = useOpdPrediction();

  // Calculate some statistics for the summary cards
  const todayPredictions = predictions.filter(p => 
    p.date === new Date().toISOString().split('T')[0]
  );
  
  const tomorrowPredictions = predictions.filter(p => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return p.date === tomorrow.toISOString().split('T')[0];
  });
  
  const totalToday = todayPredictions.reduce((sum, pred) => sum + pred.predictedCount, 0);
  const totalTomorrow = tomorrowPredictions.reduce((sum, pred) => sum + pred.predictedCount, 0);
  
  const peakHourToday = todayPredictions.length > 0 
    ? todayPredictions.reduce((max, pred) => 
        pred.predictedCount > max.predictedCount ? pred : max, 
        todayPredictions[0]
      )
    : null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">OPD Volume Predictions</h1>
          <p className="text-muted-foreground">
            Forecast patient volume for the next 7 days
          </p>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's total patients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Total</CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM d')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-bold">{totalToday}</div>
            )}
            <p className="text-muted-foreground text-sm">predicted patients</p>
          </CardContent>
        </Card>
        
        {/* Tomorrow's total patients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tomorrow's Total</CardTitle>
            <CardDescription>
              {format(new Date(new Date().setDate(new Date().getDate() + 1)), 'EEEE, MMMM d')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-bold">{totalTomorrow}</div>
            )}
            <p className="text-muted-foreground text-sm">predicted patients</p>
          </CardContent>
        </Card>
        
        {/* Today's peak hour */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Peak Hour</CardTitle>
            <CardDescription>Prepare extra staff</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : peakHourToday ? (
              <>
                <div className="text-3xl font-bold">
                  {peakHourToday.hour}:00 - {peakHourToday.hour + 1}:00
                </div>
                <p className="text-muted-foreground text-sm">
                  ~{peakHourToday.predictedCount} patients/hour
                </p>
              </>
            ) : (
              <div className="text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Main Chart */}
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load prediction data. Please try again later.
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <OpdPredictionChart data={predictions} />
          </CardContent>
        </Card>
      )}
      
      <div className="text-sm text-muted-foreground mt-4">
        <p>* Predictions are based on historical data and current trends.</p>
        <p>* Red bars/points indicate predicted peak hours when additional staff may be needed.</p>
      </div>
    </div>
  );
};

export default OpdPredictionPage;
