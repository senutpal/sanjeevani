
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Prescription, MedicineItem } from '@/types/emr.types';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PrescriptionFormProps {
  visitId: string;
  onSubmit: (data: Partial<Prescription>) => Promise<void>;
  onCancel?: () => void;
}

export default function PrescriptionForm({
  visitId,
  onSubmit,
  onCancel
}: PrescriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      visit_id: visitId,
      created_by: user?.id,
      instructions: '',
      medicines: [
        { name: '', dosage: '', frequency: '', duration: '', notes: '' }
      ] as MedicineItem[]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines'
  });
  
  const processSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Clean up any empty medicine entries
      const cleanedData = {
        ...data,
        medicines: data.medicines.filter((m: MedicineItem) => m.name.trim() !== '')
      };
      
      if (cleanedData.medicines.length === 0) {
        throw new Error('At least one medicine is required');
      }
      
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Prescription</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Medicines</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', notes: '' })}
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Medicine
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div 
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
              >
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`medicines.${index}.name`}>
                    Medicine Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`medicines.${index}.name`}
                    placeholder="e.g. Paracetamol, Amoxicillin"
                    {...register(`medicines.${index}.name` as const, { required: true })}
                    className={errors.medicines?.[index]?.name ? 'border-red-500' : ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`medicines.${index}.dosage`}>Dosage</Label>
                  <Input
                    id={`medicines.${index}.dosage`}
                    placeholder="e.g. 500mg, 10ml"
                    {...register(`medicines.${index}.dosage` as const)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`medicines.${index}.frequency`}>Frequency</Label>
                  <Input
                    id={`medicines.${index}.frequency`}
                    placeholder="e.g. Twice daily, Every 8 hours"
                    {...register(`medicines.${index}.frequency` as const)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`medicines.${index}.duration`}>Duration</Label>
                  <Input
                    id={`medicines.${index}.duration`}
                    placeholder="e.g. 7 days, 2 weeks"
                    {...register(`medicines.${index}.duration` as const)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`medicines.${index}.notes`}>Notes</Label>
                  <Input
                    id={`medicines.${index}.notes`}
                    placeholder="e.g. Take after meals"
                    {...register(`medicines.${index}.notes` as const)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">General Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Enter any general instructions for this prescription"
              {...register('instructions')}
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
            {isSubmitting ? 'Adding...' : 'Add Prescription'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
