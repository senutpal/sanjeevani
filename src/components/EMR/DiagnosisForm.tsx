
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Diagnosis } from '@/types/emr.types';
import { Textarea } from '@/components/ui/textarea';

interface DiagnosisFormProps {
  visitId: string;
  onSubmit: (data: Partial<Diagnosis>) => Promise<void>;
  onCancel?: () => void;
}

export default function DiagnosisForm({
  visitId,
  onSubmit,
  onCancel
}: DiagnosisFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      visit_id: visitId,
      diagnosis_code: '',
      diagnosis_description: '',
      diagnosis_notes: ''
    }
  });
  
  const processSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Diagnosis</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagnosis_code">Diagnosis Code (optional)</Label>
            <Input
              id="diagnosis_code"
              placeholder="e.g. ICD-10 code"
              {...register('diagnosis_code')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="diagnosis_description">
              Diagnosis Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="diagnosis_description"
              placeholder="e.g. Hypertension, Diabetes Type 2"
              {...register('diagnosis_description', { required: true })}
              className={errors.diagnosis_description ? 'border-red-500' : ''}
            />
            {errors.diagnosis_description && (
              <p className="text-red-500 text-sm">Diagnosis description is required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="diagnosis_notes">Additional Notes</Label>
            <Textarea
              id="diagnosis_notes"
              placeholder="Enter any additional notes about this diagnosis"
              {...register('diagnosis_notes')}
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
            {isSubmitting ? 'Adding...' : 'Add Diagnosis'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
