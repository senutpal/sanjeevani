
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PatientProfile } from '@/types/emr.types';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface PatientProfileFormProps {
  patient?: PatientProfile;
  onSubmit: (data: Partial<PatientProfile>) => Promise<void>;
  onCancel?: () => void;
}

export default function PatientProfileForm({
  patient,
  onSubmit,
  onCancel
}: PatientProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!patient;
  
  const defaultValues = {
    blood_group: patient?.blood_group || '',
    height: patient?.height || undefined,
    weight: patient?.weight || undefined,
    allergies: patient?.allergies ? patient.allergies.join(', ') : '',
    chronic_conditions: patient?.chronic_conditions ? patient.chronic_conditions.join(', ') : '',
    emergency_contact: patient?.emergency_contact || '',
    emergency_contact_phone: patient?.emergency_contact_phone || ''
  };
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues
  });
  
  const processSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Process arrays from comma-separated strings
      const processedData = {
        ...data,
        allergies: data.allergies ? data.allergies.split(',').map((a: string) => a.trim()).filter(Boolean) : undefined,
        chronic_conditions: data.chronic_conditions ? 
          data.chronic_conditions.split(',').map((c: string) => c.trim()).filter(Boolean) : undefined
      };
      
      await onSubmit(processedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Patient Profile' : 'Create Patient Profile'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-4">
          {patient?.medical_id && (
            <div className="space-y-2">
              <Label htmlFor="medical_id">Medical ID</Label>
              <Input id="medical_id" value={patient.medical_id} disabled />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Input
                id="blood_group"
                placeholder="e.g. A+, B-, O+"
                {...register('blood_group')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                placeholder="Height in cm"
                {...register('height', { valueAsNumber: true })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                placeholder="Weight in kg"
                {...register('weight', { valueAsNumber: true })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                placeholder="Contact name"
                {...register('emergency_contact')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                placeholder="Contact phone number"
                {...register('emergency_contact_phone')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies (comma-separated)</Label>
            <Textarea
              id="allergies"
              placeholder="e.g. Penicillin, Peanuts, Latex"
              {...register('allergies')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chronic_conditions">Chronic Conditions (comma-separated)</Label>
            <Textarea
              id="chronic_conditions"
              placeholder="e.g. Diabetes, Hypertension, Asthma"
              {...register('chronic_conditions')}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Profile' : 'Create Profile'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
