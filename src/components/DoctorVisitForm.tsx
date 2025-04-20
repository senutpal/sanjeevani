
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import VisitRegistrationForm from "./DoctorVisit/VisitRegistrationForm";
import { useQueuePoll } from "@/hooks/useQueuePoll";
import VisitHistoryCard from "./DoctorVisit/VisitHistoryCard";
import { useDoctorVisits } from "@/hooks/useDoctorVisits";
import UserNotifications from "./UserNotifications";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";

const DoctorVisitForm: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { visits, loading, formatDate } = useDoctorVisits(user?.id);
  const { refetch } = useQueuePoll();

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  // Callback to trigger queue refresh after registration
  const handleRegistered = () => {
    refetch();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Your Health Portal</h2>
          <p className="text-muted-foreground">
            Manage your appointments and medical visits
          </p>
        </div>
        
        {profile?.role === "patient" && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleSettingsClick}
          >
            <User className="h-4 w-4" />
            My Profile
          </Button>
        )}
      </div>

      <VisitRegistrationForm onRegistered={handleRegistered} />
      <VisitHistoryCard 
        visits={visits} 
        loadingVisits={loading} 
        formatDate={formatDate} 
      />
    </div>
  );
};

export default DoctorVisitForm;
