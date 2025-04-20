
import React, { useState } from 'react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea
} from 'recharts';
import { OpdPrediction } from '@/lib/types/types';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface OpdPredictionChartProps {
  data: OpdPrediction[];
}

const OpdPredictionChart: React.FC<OpdPredictionChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  
  // Format data for display
  const formattedData = data.map(item => ({
    ...item,
    label: `${format(new Date(item.date), 'EEE')} ${item.hour}:00`,
    dayHour: `${item.date}-${item.hour}`,
    // Pre-compute color for use in the chart
    color: item.isPeak ? '#ef4444' : '#3b82f6'
  }));
  
  const chartConfig = {
    prediction: {
      label: 'Patient Volume',
      color: '#3b82f6', // Blue
    },
    peak: {
      label: 'Peak Hours',
      color: '#ef4444', // Red
    },
    default: {
      label: 'Regular Hours',
      color: '#3b82f6', // Blue
    },
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">7-Day OPD Volume Prediction</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="chart-type">Line Chart</Label>
          <Switch
            id="chart-type"
            checked={chartType === 'bar'}
            onCheckedChange={(checked) => setChartType(checked ? 'bar' : 'line')}
          />
          <Label htmlFor="chart-type">Bar Chart</Label>
        </div>
      </div>

      <div className="w-full h-96 bg-card rounded-lg border p-4">
        <ChartContainer 
          className="w-full h-full" 
          config={chartConfig}
        >
          {chartType === 'bar' ? (
            <BarChart data={formattedData} margin={{ top: 10, right: 30, left: 5, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                angle={-45} 
                textAnchor="end"
                tick={{ fontSize: 12 }}
                height={60}
              />
              <YAxis label={{ value: 'Patients', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" />
              {/* Use separate Bars for peak and non-peak hours */}
              <Bar 
                dataKey="predictedCount" 
                name="Regular Hours"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
              {/* Create a BarChart that only shows peak hours */}
              <Bar 
                dataKey={(entry) => entry.isPeak ? entry.predictedCount : 0}
                name="Peak Hours"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          ) : (
            <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 5, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                angle={-45} 
                textAnchor="end"
                tick={{ fontSize: 12 }}
                height={60}
              />
              <YAxis label={{ value: 'Patients', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" />
              <Line 
                type="monotone" 
                dataKey="predictedCount" 
                name="Predicted Patient Count"
                stroke="#3b82f6"
                dot={(props) => {
                  // Use props to access original data point
                  const { cx, cy, payload } = props;
                  const isPeak = payload.isPeak;
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={4} 
                      fill={isPeak ? '#ef4444' : '#3b82f6'} 
                    />
                  );
                }}
                strokeWidth={2}
                animationDuration={1000}
              />
            </LineChart>
          )}
        </ChartContainer>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
          <span className="text-sm">Regular Hours</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
          <span className="text-sm">Peak Hours</span>
        </div>
      </div>
    </div>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-md p-3 shadow-md">
        <p className="font-medium">{format(new Date(data.date), 'EEEE, MMM d')}</p>
        <p>Time: {data.hour}:00</p>
        <p className="font-semibold">
          Predicted Patients: {data.predictedCount}
        </p>
        {data.isPeak && (
          <p className="text-red-500 font-medium">Peak Hour</p>
        )}
      </div>
    );
  }

  return null;
};

export default OpdPredictionChart;
