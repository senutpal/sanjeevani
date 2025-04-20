
import React from "react";
import DoctorVisitForm from "@/components/DoctorVisitForm";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DoctorVisitPage: React.FC = () => {
  const { profile } = useAuth();
  // Fix the type error by checking if the role is one of the staff roles
  // If not a staff role, treat as a patient
  const isPatient = !profile?.role || !['admin', 'doctor', 'nurse', 'staff'].includes(profile.role);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Doctor Visit Registration</h1>
        <p className="text-muted-foreground">
          {isPatient 
            ? "Schedule an appointment with our medical staff" 
            : "Manage patient appointments and scheduling"}
        </p>
      </div>
      
      {isPatient && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Your Patient Portal</CardTitle>
            <CardDescription>
              This is your dedicated area to manage your appointments and visits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Welcome to Sanjeevani's patient portal. Here you can:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Register for a new doctor visit</li>
              <li>View your upcoming appointments</li>
              <li>Check which doctor you are assigned to</li>
              <li>See appointment details including date and time</li>
            </ul>
          </CardContent>
        </Card>
      )}
      
      <DoctorVisitForm />
    </div>
  );
};

export default DoctorVisitPage;
