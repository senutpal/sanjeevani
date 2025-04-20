
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEmrPatients } from '@/hooks/useEmrPatients';
import { useEmrVisits } from '@/hooks/useEmrVisits';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PatientProfileForm from '@/components/EMR/PatientProfileForm';
import VisitCard from '@/components/EMR/VisitCard';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Edit, User, Calendar, FileText, ChevronLeft, Loader2, ClipboardList } from 'lucide-react';
import { PatientProfile } from '@/types/emr.types';
import { useAuth } from '@/contexts/AuthContext';

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { getPatientById, updatePatient } = useEmrPatients();
  const { visits, isLoading: visitsLoading } = useEmrVisits(id);
  
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const isPatient = profile?.role === 'patient';
  const isOwnProfile = isPatient && id === profile?.id;
  
  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast.error('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatient();
  }, [id]);
  
  const handleUpdateProfile = async (data: Partial<PatientProfile>) => {
    if (!patient || !id) return;
    
    try {
      const updatedPatient = await updatePatient(id, data);
      setPatient(updatedPatient);
      setEditMode(false);
      toast.success('Patient profile updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient profile');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
      </div>
    );
  }
  
  if (!patient) {
    return (
      <EmptyState
        title="Patient not found"
        description="The requested patient profile could not be found."
        action={
          <Button onClick={() => navigate('/emr/patients')}>
            Back to Patients
          </Button>
        }
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/emr/patients')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>Patient Profile</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {patient.medical_id}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              {isOwnProfile 
                ? 'Your personal medical profile' 
                : 'View and manage patient information'}
            </p>
          </div>
        </div>
        
        {!editMode && (
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setEditMode(true)}
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
      
      <Tabs 
        defaultValue="profile" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="visits" className="gap-2">
            <Calendar className="h-4 w-4" />
            Medical Visits
          </TabsTrigger>
          <TabsTrigger value="records" className="gap-2">
            <FileText className="h-4 w-4" />
            Records
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          {editMode ? (
            <PatientProfileForm
              patient={patient}
              onSubmit={handleUpdateProfile}
              onCancel={() => setEditMode(false)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Medical profile for patient {patient.medical_id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Information</h3>
                    <Separator className="mb-4" />
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground block">Medical ID</span>
                        <span className="font-medium">{patient.medical_id}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground block">Blood Group</span>
                        <span className="font-medium">{patient.blood_group || 'Not recorded'}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground block">Height</span>
                        <span className="font-medium">{patient.height ? `${patient.height} cm` : 'Not recorded'}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground block">Weight</span>
                        <span className="font-medium">{patient.weight ? `${patient.weight} kg` : 'Not recorded'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Emergency Contact</h3>
                    <Separator className="mb-4" />
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground block">Contact Name</span>
                        <span className="font-medium">{patient.emergency_contact || 'Not recorded'}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground block">Contact Phone</span>
                        <span className="font-medium">{patient.emergency_contact_phone || 'Not recorded'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Medical Information</h3>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground block mb-2">Allergies</span>
                      {patient.allergies && patient.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {patient.allergies.map(allergy => (
                            <Badge key={allergy} variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No allergies recorded</span>
                      )}
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground block mb-2">Chronic Conditions</span>
                      {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {patient.chronic_conditions.map(condition => (
                            <Badge key={condition} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No chronic conditions recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="visits" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Medical Visits</h2>
            
            {!isPatient && (
              <Link to={`/emr/visits/new?patientId=${id}`}>
                <Button variant="outline" className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  New Visit
                </Button>
              </Link>
            )}
          </div>
          
          {visitsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : visits.length === 0 ? (
            <EmptyState
              title="No medical visits"
              description="This patient has no recorded medical visits."
              action={
                !isPatient ? (
                  <Link to={`/emr/visits/new?patientId=${id}`}>
                    <Button>Record New Visit</Button>
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visits.map(visit => (
                <VisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="records" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>
                View all medical records and documents for this patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <Link to={`/emr/patients/${id}/records`}>
                  <Button>View All Medical Records</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetailPage;
