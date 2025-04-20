
export interface PatientProfile {
  id: string;
  medical_id: string;
  blood_group?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  chronic_conditions?: string[];
  emergency_contact?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalVisit {
  id: string;
  patient_id: string;
  doctor_id: string;
  visit_date: string;
  chief_complaint?: string;
  visit_type: string;
  visit_notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
  doctor?: {
    name: string;
    department?: string;
    avatar?: string;
  };
  diagnoses?: Diagnosis[];
  prescriptions?: Prescription[];
  lab_reports?: LabReport[];
  files?: FileUpload[];
}

export interface Diagnosis {
  id: string;
  visit_id: string;
  diagnosis_code?: string;
  diagnosis_description: string;
  diagnosis_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  visit_id: string;
  medicines: MedicineItem[];
  instructions?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  doctor_name?: string;
}

export interface MedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface LabReport {
  id: string;
  visit_id: string;
  report_type: string;
  report_date: string;
  results?: any;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  files?: FileUpload[];
}

export interface FileUpload {
  id: string;
  visit_id?: string;
  lab_report_id?: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  url?: string;
}

export interface Medication {
  id: string;
  name: string;
  generic_name?: string;
  drug_class?: string;
  interactions?: string[];
  contraindications?: string[];
  created_at: string;
  updated_at: string;
}

export interface MedicationConflict {
  conflict_medicine: string;
  conflicting_with: string;
  conflict_type: string;
}
