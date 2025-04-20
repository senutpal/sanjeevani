
// Patient status for OPD Queue
export type PatientStatus = 'waiting' | 'assigned' | 'completed';

// Patient in OPD Queue
export interface OpdPatient {
  id: string;
  name: string;
  department: string;
  waitTime: number; // in minutes
  status: PatientStatus;
  assignedDoctor?: string;
  joinedAt: string; // ISO timestamp
  isNew?: boolean; // For animation
  tokenNumber?: number; // Token number for queue management
  registrationTime?: string; // Time when patient registered
  symptoms?: string; // Symptoms and concerns submitted during registration
}

// Department types
export type Department = 'ENT' | 'Ortho' | 'Cardio' | 'Neuro' | 'General' | 'Pediatric' | 'Gynecology';

// Bed status
export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

// Bed information
export interface Bed {
  id: string;
  number: string;
  ward: string;
  floor: number;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
}

// Inventory item status
export type InventoryStatus = 'in-stock' | 'low' | 'out-of-stock';

// Inventory item
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  status: InventoryStatus;
  category: string;
  lastRestocked?: string; // ISO timestamp
  expiryDate?: string; // ISO date for expiry tracking
}

// Patient admission status
export type AdmissionStatus = 'critical' | 'stable' | 'recovering' | 'ready-for-discharge';

// Admitted patient
export interface AdmittedPatient {
  id: string;
  name: string;
  admissionDate: string; // ISO timestamp
  ward: string;
  bedId: string;
  bedNumber: string;
  diagnosis: string;
  status: AdmissionStatus;
}

// OPD Prediction data point
export interface OpdPrediction {
  date: string; // ISO date
  hour: number;
  predictedCount: number;
  isPeak: boolean;
}

// User role
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'staff' | 'patient';

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: Department;
  avatar?: string;
}

// Inventory Action Types
export type InventoryActionType = 'restock' | 'use';

export interface InventoryAction {
  type: InventoryActionType;
  quantity: number;
  itemId: string;
  expiryDate?: string; // Only used for restocking
}
