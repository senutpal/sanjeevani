
import React from 'react';
import { BedStatus, Bed } from '@/lib/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bed as BedIcon, User } from 'lucide-react';
import { useBeds } from '@/hooks/useBeds';
import StatusBadge from '@/components/StatusBadge';

const BedAvailabilityPage = () => {
  const { beds, isLoading, error } = useBeds();

  // Group beds by floor
  const bedsByFloor = React.useMemo(() => {
    if (!beds) return {};
    
    return beds.reduce<Record<number, Bed[]>>((acc, bed) => {
      if (!acc[bed.floor]) {
        acc[bed.floor] = [];
      }
      acc[bed.floor].push(bed);
      return acc;
    }, {});
  }, [beds]);

  // Group beds by ward
  const bedsByWard = React.useMemo(() => {
    if (!beds) return {};
    
    return beds.reduce<Record<string, Bed[]>>((acc, bed) => {
      if (!acc[bed.ward]) {
        acc[bed.ward] = [];
      }
      acc[bed.ward].push(bed);
      return acc;
    }, {});
  }, [beds]);

  const getBedStatusColorClass = (status: BedStatus): string => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'occupied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading bed availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">Error loading bed data</p>
      </div>
    );
  }

  if (!beds || beds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BedIcon className="h-16 w-16 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground">No bed data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bed Availability</h1>
          <p className="text-muted-foreground">Monitor and manage hospital beds across wards and floors</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span className="text-sm">Maintenance</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="floor">
        <TabsList className="mb-4">
          <TabsTrigger value="floor">By Floor</TabsTrigger>
          <TabsTrigger value="ward">By Ward</TabsTrigger>
        </TabsList>
        
        <TabsContent value="floor">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(bedsByFloor).map(([floor, floorBeds]) => (
              <Card key={floor} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>Floor {floor}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {floorBeds.map((bed) => (
                      <HoverCard key={bed.id} openDelay={200} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <div 
                            className={`p-3 rounded-md border flex flex-col items-center justify-center transition-colors cursor-pointer hover:shadow-md ${
                              bed.status === 'occupied' ? 'border-red-300 dark:border-red-800' : 
                              bed.status === 'available' ? 'border-green-300 dark:border-green-800' : 
                              bed.status === 'reserved' ? 'border-yellow-300 dark:border-yellow-800' : 
                              'border-gray-300 dark:border-gray-700'
                            }`}
                          >
                            <BedIcon className={`h-5 w-5 mb-2 ${
                              bed.status === 'occupied' ? 'text-red-500' : 
                              bed.status === 'available' ? 'text-green-500' : 
                              bed.status === 'reserved' ? 'text-yellow-500' : 
                              'text-gray-500'
                            }`} />
                            <span className="font-medium text-sm">{bed.number}</span>
                            <span className="text-xs text-muted-foreground">{bed.ward}</span>
                            <StatusBadge 
                              status={bed.status} 
                              colorClass={getBedStatusColorClass(bed.status)} 
                              className="mt-2"
                            />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64 p-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold">Bed {bed.number}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Ward:</span>
                              <span className="text-sm">{bed.ward}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Floor:</span>
                              <span className="text-sm">{bed.floor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Status:</span>
                              <StatusBadge 
                                status={bed.status} 
                                colorClass={getBedStatusColorClass(bed.status)} 
                              />
                            </div>
                            {bed.status === 'occupied' && bed.patientName && (
                              <div className="pt-2 border-t mt-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{bed.patientName}</span>
                                </div>
                                {bed.patientId && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Patient ID: {bed.patientId}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ward">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(bedsByWard).map(([ward, wardBeds]) => (
              <Card key={ward} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>{ward} Ward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {wardBeds.map((bed) => (
                      <TooltipProvider key={bed.id}>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`p-3 rounded-md border flex flex-col items-center justify-center transition-colors cursor-pointer hover:shadow-md ${
                                bed.status === 'occupied' ? 'border-red-300 dark:border-red-800' : 
                                bed.status === 'available' ? 'border-green-300 dark:border-green-800' : 
                                bed.status === 'reserved' ? 'border-yellow-300 dark:border-yellow-800' : 
                                'border-gray-300 dark:border-gray-700'
                              }`}
                            >
                              <BedIcon className={`h-5 w-5 mb-2 ${
                                bed.status === 'occupied' ? 'text-red-500' : 
                                bed.status === 'available' ? 'text-green-500' : 
                                bed.status === 'reserved' ? 'text-yellow-500' : 
                                'text-gray-500'
                              }`} />
                              <span className="font-medium text-sm">{bed.number}</span>
                              <span className="text-xs text-muted-foreground">Floor {bed.floor}</span>
                              <StatusBadge 
                                status={bed.status} 
                                colorClass={getBedStatusColorClass(bed.status)} 
                                className="mt-2"
                              />
                            </div>
                          </TooltipTrigger>
                          {bed.status === 'occupied' && bed.patientName ? (
                            <TooltipContent>
                              <p>Patient: {bed.patientName}</p>
                              {bed.patientId && <p className="text-xs">ID: {bed.patientId}</p>}
                            </TooltipContent>
                          ) : null}
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BedAvailabilityPage;
