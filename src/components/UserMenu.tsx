
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Calendar, Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { hasFeatureAccess, UserRole } from "@/integrations/supabase/database.types";

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };
  
  if (!user || !profile) return null;
  
  const displayName = profile.name || user.email?.split("@")[0] || "User";
  
  const getRoleIcon = () => {
    switch (profile.role as UserRole) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 text-red-500" />;
      case 'doctor':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'nurse':
        return <User className="h-4 w-4 text-green-500" />;
      case 'staff':
        return <User className="h-4 w-4 text-primary" />;
      case 'patient':
        return <User className="h-4 w-4 text-muted-foreground" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-10">
          <span className="hidden md:inline-block">{displayName}</span>
          <span className="rounded-full bg-primary h-8 w-8 flex items-center justify-center text-sm text-primary-foreground">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-semibold">{displayName}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {getRoleIcon()}
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {hasFeatureAccess(profile.role, 'doctorVisit') && (
          <DropdownMenuItem onClick={() => navigate("/doctor-visit")}>
            <Calendar className="h-4 w-4 mr-2" />
            Doctor Visit
          </DropdownMenuItem>
        )}
        
        {hasFeatureAccess(profile.role, 'settings') && (
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
