
import { PatientStatus, BedStatus, InventoryStatus, AdmissionStatus } from '@/lib/types/types';

// OPD Patient status colors
export const getPatientStatusColor = (status: PatientStatus): string => {
  switch (status) {
    case 'waiting':
      return 'waiting-badge';
    case 'assigned':
      return 'assigned-badge';
    case 'completed':
      return 'completed-badge';
    default:
      return 'waiting-badge';
  }
};

// OPD Patient status text
export const getPatientStatusText = (status: PatientStatus): string => {
  switch (status) {
    case 'waiting':
      return 'Waiting';
    case 'assigned':
      return 'With Doctor';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
};

// Bed status colors
export const getBedStatusColor = (status: BedStatus): string => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'occupied':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'reserved':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'maintenance':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Inventory status colors
export const getInventoryStatusColor = (status: InventoryStatus): string => {
  switch (status) {
    case 'in-stock':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'low':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'out-of-stock':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Admission status colors
export const getAdmissionStatusColor = (status: AdmissionStatus): string => {
  switch (status) {
    case 'critical':
      return 'critical-badge';
    case 'stable':
      return 'stable-badge';
    case 'recovering':
      return 'status-badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'ready-for-discharge':
      return 'status-badge bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'status-badge bg-gray-100 text-gray-800';
  }
};

// Format wait time
export const formatWaitTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  } 
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};
