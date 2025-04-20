
import React, { useState, useEffect } from 'react';
import { useQueuePoll } from '@/hooks/useQueuePoll';
import PatientQueueCard from '@/components/PatientQueueCard';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, RefreshCw, UserPlus, UserCheck, Clock, Filter } from 'lucide-react';
import { OpdPatient } from '@/lib/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OpdQueuePage: React.FC = () => {
  const { data: patients, loading, error, refetch } = useQueuePoll();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('OpdQueuePage mounted, setting up extra monitoring...');
    
    const monitorChannel = supabase
      .channel('monitor-opd-queue')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'opd_queue' }, 
          (payload) => {
            console.log('MONITOR: Real-time update for OPD queue:', payload);
            if (payload.new) {
              toast.info(`Queue update: ${payload.eventType} - ${payload.new.name || 'Unknown'}`);
            }
          })
      .subscribe((status) => {
        console.log('Monitor subscription status:', status);
      });
      
    const checkRealtimeSetup = async () => {
      try {
        console.log('Checking for recent queue entries');
        const { data } = await supabase
          .from('opd_queue')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        console.log('Recent queue entries:', data);
      } catch (err) {
        console.error('Error checking queue entries:', err);
      }
    };
    
    checkRealtimeSetup();
      
    return () => {
      supabase.removeChannel(monitorChannel);
    };
  }, []);

  const departments = ['All', ...new Set(patients.map(p => p.department))];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.tokenNumber?.toString() || '').includes(searchTerm) ||
      patient.department.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = !statusFilter || patient.status === statusFilter;
    const matchesDepartment = !departmentFilter || departmentFilter === 'All' || patient.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Group patients by status
  const patientsByStatus: Record<string, OpdPatient[]> = {};
  
  filteredPatients.forEach(patient => {
    if (!patientsByStatus[patient.status]) {
      patientsByStatus[patient.status] = [];
    }
    patientsByStatus[patient.status].push(patient);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">OPD Queue</h1>
          <p className="text-muted-foreground">Manage outpatient department queue</p>
        </div>
        <Button onClick={() => refetch()} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, token #, or department..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select 
          value={departmentFilter || 'All'} 
          onValueChange={(value) => setDepartmentFilter(value === 'All' ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <SelectValue placeholder="Department" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button
            variant={!statusFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'waiting' ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter('waiting')}
            className="gap-2"
          >
            <UserPlus size={16} />
            Waiting
          </Button>
          <Button
            variant={statusFilter === 'assigned' ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter('assigned')}
            className="gap-2"
          >
            <UserCheck size={16} />
            With Doctor
          </Button>
        </div>
      </div>

      {loading && filteredPatients.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="hospital-card animate-pulse-slow">
              <div className="h-4 w-3/4 bg-muted rounded mb-3"></div>
              <div className="h-3 w-1/2 bg-muted rounded mb-4"></div>
              <div className="grid grid-cols-2 gap-y-2 mb-4">
                <div>
                  <div className="h-2 w-16 bg-muted rounded mb-1"></div>
                  <div className="h-3 w-20 bg-muted rounded"></div>
                </div>
                <div>
                  <div className="h-2 w-16 bg-muted rounded mb-1"></div>
                  <div className="h-3 w-14 bg-muted rounded"></div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="h-8 w-24 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Error loading queue"
          description={error.message}
          action={
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          }
        />
      ) : filteredPatients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description={
            searchTerm || statusFilter || departmentFilter
              ? "Try adjusting your search or filters"
              : "The OPD queue is currently empty"
          }
          action={
            (searchTerm || statusFilter || departmentFilter) && (
              <Button onClick={() => {
                setSearchTerm('');
                setStatusFilter(null);
                setDepartmentFilter(null);
              }} variant="outline">
                Clear Filters
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          {patientsByStatus['waiting'] && patientsByStatus['waiting'].length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-medium">Waiting ({patientsByStatus['waiting'].length})</h2>
                <Badge variant="outline" className="bg-yellow-50">
                  <Clock className="mr-1 h-3.5 w-3.5 text-yellow-500" />
                  <span className="text-yellow-700">In Queue</span>
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientsByStatus['waiting'].map(patient => (
                  <PatientQueueCard
                    key={patient.id}
                    patient={patient}
                    onUpdate={refetch}
                  />
                ))}
              </div>
            </div>
          )}
          
          {patientsByStatus['assigned'] && patientsByStatus['assigned'].length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-medium">With Doctor ({patientsByStatus['assigned'].length})</h2>
                <Badge variant="outline" className="bg-blue-50">
                  <UserCheck className="mr-1 h-3.5 w-3.5 text-blue-500" />
                  <span className="text-blue-700">In Consultation</span>
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientsByStatus['assigned'].map(patient => (
                  <PatientQueueCard
                    key={patient.id}
                    patient={patient}
                    onUpdate={refetch}
                  />
                ))}
              </div>
            </div>
          )}
          
          {patientsByStatus['completed'] && patientsByStatus['completed'].length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-medium">Completed ({patientsByStatus['completed'].length})</h2>
                <Badge variant="outline" className="bg-green-50">
                  <svg className="mr-1 h-3.5 w-3.5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-green-700">Finished</span>
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientsByStatus['completed'].map(patient => (
                  <PatientQueueCard
                    key={patient.id}
                    patient={patient}
                    onUpdate={refetch}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpdQueuePage;
