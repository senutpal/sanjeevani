
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Department } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { toast } from "sonner";

interface VisitRegistrationFormProps {
  onRegistered?: () => void;
}

const VisitRegistrationForm: React.FC<VisitRegistrationFormProps> = ({ onRegistered }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState<Department | "">("");
  const [symptoms, setSymptoms] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!department) {
      toast.error("Please select a department");
      return;
    }

    if (!user) {
      toast.error("You need to be logged in to book a visit");
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Add to doctor_visits table
      const { data, error } = await supabase
        .from("doctor_visits")
        .insert({
          patient_id: user.id,
          department,
          symptoms: symptoms.trim() || null,
          status: "pending"
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Step 2: Generate a unique token number for the OPD queue
      const { data: maxTokenData, error: tokenError } = await supabase
        .from("opd_queue")
        .select("token_number")
        .order("token_number", { ascending: false })
        .limit(1);
      
      if (tokenError) throw tokenError;
      
      // Default to token #1 if no tokens exist, otherwise increment the highest by 1
      const newTokenNumber = maxTokenData && maxTokenData.length > 0 && maxTokenData[0]?.token_number 
        ? Number(maxTokenData[0].token_number) + 1 
        : 1;
      
      // Step 3: Also add to opd_queue table to reflect in real-time queue
      const patientName = profile?.name || "Patient";
      const registrationTime = new Date().toISOString();
      
      const { error: opdQueueError } = await supabase
        .from("opd_queue")
        .insert({
          name: patientName,
          department,
          joined_at: registrationTime,
          registration_time: registrationTime,
          wait_time: 0, // Initial wait time
          status: "waiting",
          token_number: newTokenNumber
        });
      
      if (opdQueueError) throw opdQueueError;
      
      toast.success("Your visit has been registered successfully!");
      console.log("Visit registered:", data);

      // Call optional onRegistered callback to allow parent to refresh queue
      if (onRegistered) {
        onRegistered();
      }
      
      // Reset form fields
      setDepartment("");
      setSymptoms("");
      
    } catch (error: any) {
      toast.error("Failed to register for doctor visit: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          <CardTitle>Register for Doctor Visit</CardTitle>
        </div>
        <CardDescription>
          Please provide the required information to schedule your visit
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name" 
              value={profile?.name || ""} 
              disabled 
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={department} 
              onValueChange={(value) => setDepartment(value as Department)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENT">ENT</SelectItem>
                <SelectItem value="Ortho">Orthopedics</SelectItem>
                <SelectItem value="Cardio">Cardiology</SelectItem>
                <SelectItem value="Neuro">Neurology</SelectItem>
                <SelectItem value="General">General Medicine</SelectItem>
                <SelectItem value="Pediatric">Pediatrics</SelectItem>
                <SelectItem value="Gynecology">Gynecology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms & Concerns</Label>
            <Textarea 
              id="symptoms" 
              placeholder="Briefly describe your symptoms or health concerns" 
              value={symptoms} 
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Register Visit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VisitRegistrationForm;
