
import { Database } from './types';

// Export the generated types
export type Tables = Database['public']['Tables'];

// Helper types for database operations
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];

// Type aliases for specific tables
export type Profile = TablesRow<'profiles'> & { phone?: string };
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

// OPD Queue Item with token_number and registration_time
export type OpdQueueItem = TablesRow<'opd_queue'> & { 
  token_number?: number; 
  registration_time?: string;
};
export type OpdQueueItemInsert = TablesInsert<'opd_queue'>;
export type OpdQueueItemUpdate = TablesUpdate<'opd_queue'>;

export type Bed = TablesRow<'beds'>;
export type BedInsert = TablesInsert<'beds'>;
export type BedUpdate = TablesUpdate<'beds'>;

// Inventory Item with expiry_date
export type InventoryItem = TablesRow<'inventory'> & { 
  expiry_date?: string;
};
export type InventoryItemInsert = TablesInsert<'inventory'>;
export type InventoryItemUpdate = TablesUpdate<'inventory'>;

export type Admission = TablesRow<'admissions'>;
export type AdmissionInsert = TablesInsert<'admissions'>;
export type AdmissionUpdate = TablesUpdate<'admissions'>;

export type OpdPrediction = TablesRow<'opd_predictions'>;
export type OpdPredictionInsert = TablesInsert<'opd_predictions'>;
export type OpdPredictionUpdate = TablesUpdate<'opd_predictions'>;

// Doctor Visit with token_number
export type DoctorVisit = TablesRow<'doctor_visits'> & { token_number?: number };
export type DoctorVisitInsert = TablesInsert<'doctor_visits'>;
export type DoctorVisitUpdate = TablesUpdate<'doctor_visits'>;

export type Notification = TablesRow<'notifications'>;
export type NotificationInsert = TablesInsert<'notifications'>;
export type NotificationUpdate = TablesUpdate<'notifications'>;

// Role definitions - adding 'patient' to the UserRole type
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'staff';

// Helper functions for role-based access control
export const isAdmin = (role?: string): boolean => role === 'admin';
export const isDoctor = (role?: string): boolean => role === 'doctor';
export const isNurse = (role?: string): boolean => role === 'nurse';
export const isPatient = (role?: string): boolean => role === 'patient';
export const isStaff = (role?: string): boolean => role === 'staff';

// Check if user has staff-level access (admin, doctor, nurse, staff)
export const hasStaffAccess = (role?: string): boolean => 
  role === 'admin' || role === 'doctor' || role === 'nurse' || role === 'staff';

// Feature access control mapping
export interface FeatureAccess {
  dashboard: UserRole[];
  opdQueue: UserRole[];
  bedAvailability: UserRole[];
  inventory: UserRole[];
  opdPrediction: UserRole[];
  admissions: UserRole[];
  doctorVisit: UserRole[];
  settings: UserRole[];
}

export const featureAccessMap: FeatureAccess = {
  dashboard: ['admin', 'doctor', 'nurse', 'staff'],
  opdQueue: ['admin', 'doctor', 'nurse', 'staff'],
  bedAvailability: ['admin', 'nurse', 'staff'],
  inventory: ['admin', 'staff'],
  opdPrediction: ['admin', 'doctor', 'staff'],
  admissions: ['admin', 'doctor', 'nurse', 'staff'],
  doctorVisit: ['admin', 'doctor', 'nurse', 'patient', 'staff'],
  settings: ['admin', 'patient', 'doctor', 'nurse', 'staff'],
};

// Check if a user has access to a specific feature - with added safety checks
export const hasFeatureAccess = (role: string | undefined, feature: keyof FeatureAccess): boolean => {
  if (!role) return false;
  
  // Check if the feature exists in our map
  const allowedRoles = featureAccessMap[feature];
  if (!allowedRoles) {
    console.warn(`Feature "${feature}" not found in access map`);
    return false;
  }
  
  return allowedRoles.includes(role as UserRole);
};
