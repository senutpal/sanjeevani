
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { 
  Menu, X, Hospital, Bed, FileText, 
  BarChart2, User, Settings, Calendar, 
  Clipboard, Activity
} from 'lucide-react';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import UserNotifications from './UserNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { hasFeatureAccess } from '@/integrations/supabase/database.types';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  feature: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  
  // Define all possible navigation items
  const allNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: Hospital, feature: 'dashboard' },
    { name: 'OPD Queue', path: '/opd-queue', icon: Calendar, feature: 'opdQueue' },
    { name: 'Bed Availability', path: '/bed-availability', icon: Bed, feature: 'bedAvailability' },
    { name: 'Inventory', path: '/inventory', icon: FileText, feature: 'inventory' },
    { name: 'OPD Prediction', path: '/opd-prediction', icon: BarChart2, feature: 'opdPrediction' },
    { name: 'Admissions', path: '/admissions', icon: User, feature: 'admissions' },
    { name: 'Doctor Visit', path: '/doctor-visit', icon: Calendar, feature: 'doctorVisit' },
    { name: 'EMR', path: '/emr', icon: Clipboard, feature: 'doctorVisit' },
  ];

  // Check if profile and feature are defined before filtering
  const navItems = allNavItems.filter(
    item => profile && hasFeatureAccess(profile.role, item.feature as any)
  );

  // Redirect patients directly to doctor-visit page if they're on the dashboard
  useEffect(() => {
    if (profile?.role === 'patient' && location.pathname === '/') {
      navigate('/doctor-visit');
    }
  }, [profile, location.pathname, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if user has access to settings
  const hasSettingsAccess = profile && hasFeatureAccess(profile.role, 'settings' as any);
  
  // Check if current path is in EMR section
  const isEmrSection = location.pathname.startsWith('/emr');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <div className="flex items-center gap-2">
          <Hospital className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg hidden sm:inline-block">Sanjeevani</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          {user && <UserNotifications />}
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 flex-col bg-sidebar border-r pt-16 transition-transform duration-300 md:translate-x-0 md:static md:flex",
            sidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden"
          )}
        >
          <div className="flex flex-col gap-1 p-4 flex-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  (location.pathname === item.path || 
                   (item.path === '/emr' && isEmrSection))
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* EMR Submenu */}
          {isEmrSection && (
            <div className="px-4 py-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-3">
                EMR Management
              </p>
              <div className="flex flex-col gap-1">
                <Link 
                  to="/emr" 
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname === '/emr'
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Activity className="h-4 w-4" />
                  EMR Dashboard
                </Link>
                
                <Link 
                  to="/emr/patients" 
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname.includes('/emr/patients')
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Patients
                </Link>
              </div>
            </div>
          )}
          
          {hasSettingsAccess && (
            <div className="border-t p-4">
              <Link 
                to="/settings" 
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === '/settings'
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
