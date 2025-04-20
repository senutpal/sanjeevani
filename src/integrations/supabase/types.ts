export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admissions: {
        Row: {
          admission_date: string
          bed_id: string
          bed_number: string
          created_at: string
          diagnosis: string
          discharged_at: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["admission_status"]
          updated_at: string
          ward: string
        }
        Insert: {
          admission_date?: string
          bed_id: string
          bed_number: string
          created_at?: string
          diagnosis: string
          discharged_at?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["admission_status"]
          updated_at?: string
          ward: string
        }
        Update: {
          admission_date?: string
          bed_id?: string
          bed_number?: string
          created_at?: string
          diagnosis?: string
          discharged_at?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["admission_status"]
          updated_at?: string
          ward?: string
        }
        Relationships: [
          {
            foreignKeyName: "admissions_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
        ]
      }
      beds: {
        Row: {
          created_at: string
          floor: number
          id: string
          number: string
          patient_id: string | null
          patient_name: string | null
          status: Database["public"]["Enums"]["bed_status"]
          updated_at: string
          ward: string
        }
        Insert: {
          created_at?: string
          floor: number
          id?: string
          number: string
          patient_id?: string | null
          patient_name?: string | null
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string
          ward: string
        }
        Update: {
          created_at?: string
          floor?: number
          id?: string
          number?: string
          patient_id?: string | null
          patient_name?: string | null
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string
          ward?: string
        }
        Relationships: []
      }
      diagnoses: {
        Row: {
          created_at: string
          diagnosis_code: string | null
          diagnosis_description: string
          diagnosis_notes: string | null
          id: string
          updated_at: string
          visit_id: string
        }
        Insert: {
          created_at?: string
          diagnosis_code?: string | null
          diagnosis_description: string
          diagnosis_notes?: string | null
          id?: string
          updated_at?: string
          visit_id: string
        }
        Update: {
          created_at?: string
          diagnosis_code?: string | null
          diagnosis_description?: string
          diagnosis_notes?: string | null
          id?: string
          updated_at?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnoses_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "medical_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_visits: {
        Row: {
          appointment_date: string | null
          assigned_doctor: string | null
          created_at: string
          department: string
          id: string
          patient_id: string
          status: string
          symptoms: string | null
          updated_at: string
        }
        Insert: {
          appointment_date?: string | null
          assigned_doctor?: string | null
          created_at?: string
          department: string
          id?: string
          patient_id: string
          status?: string
          symptoms?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string | null
          assigned_doctor?: string | null
          created_at?: string
          department?: string
          id?: string
          patient_id?: string
          status?: string
          symptoms?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      file_uploads: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          lab_report_id: string | null
          updated_at: string
          uploaded_by: string
          visit_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          lab_report_id?: string | null
          updated_at?: string
          uploaded_by: string
          visit_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          lab_report_id?: string | null
          updated_at?: string
          uploaded_by?: string
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_lab_report_id_fkey"
            columns: ["lab_report_id"]
            isOneToOne: false
            referencedRelation: "lab_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_uploads_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_uploads_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "medical_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string
          created_at: string
          id: string
          last_restocked: string | null
          name: string
          quantity: number
          status: Database["public"]["Enums"]["inventory_status"]
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          name: string
          quantity?: number
          status?: Database["public"]["Enums"]["inventory_status"]
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          name?: string
          quantity?: number
          status?: Database["public"]["Enums"]["inventory_status"]
          updated_at?: string
        }
        Relationships: []
      }
      lab_reports: {
        Row: {
          created_at: string
          created_by: string
          id: string
          notes: string | null
          report_date: string
          report_type: string
          results: Json | null
          updated_at: string
          visit_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          report_date?: string
          report_type: string
          results?: Json | null
          updated_at?: string
          visit_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          report_date?: string
          report_type?: string
          results?: Json | null
          updated_at?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_reports_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "medical_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_visits: {
        Row: {
          chief_complaint: string | null
          created_at: string
          doctor_id: string
          id: string
          patient_id: string
          status: string
          updated_at: string
          visit_date: string
          visit_notes: string | null
          visit_type: string
        }
        Insert: {
          chief_complaint?: string | null
          created_at?: string
          doctor_id: string
          id?: string
          patient_id: string
          status?: string
          updated_at?: string
          visit_date?: string
          visit_notes?: string | null
          visit_type: string
        }
        Update: {
          chief_complaint?: string | null
          created_at?: string
          doctor_id?: string
          id?: string
          patient_id?: string
          status?: string
          updated_at?: string
          visit_date?: string
          visit_notes?: string | null
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_visits_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          contraindications: string[] | null
          created_at: string
          drug_class: string | null
          generic_name: string | null
          id: string
          interactions: string[] | null
          name: string
          updated_at: string
        }
        Insert: {
          contraindications?: string[] | null
          created_at?: string
          drug_class?: string | null
          generic_name?: string | null
          id?: string
          interactions?: string[] | null
          name: string
          updated_at?: string
        }
        Update: {
          contraindications?: string[] | null
          created_at?: string
          drug_class?: string | null
          generic_name?: string | null
          id?: string
          interactions?: string[] | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      opd_predictions: {
        Row: {
          created_at: string
          date: string
          hour: number
          id: string
          is_peak: boolean
          predicted_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          hour: number
          id?: string
          is_peak?: boolean
          predicted_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          hour?: number
          id?: string
          is_peak?: boolean
          predicted_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      opd_queue: {
        Row: {
          assigned_doctor: string | null
          completed_at: string | null
          created_at: string
          department: Database["public"]["Enums"]["department_type"]
          id: string
          joined_at: string
          name: string
          registration_time: string | null
          status: Database["public"]["Enums"]["patient_status"]
          token_number: number | null
          updated_at: string
          wait_time: number
        }
        Insert: {
          assigned_doctor?: string | null
          completed_at?: string | null
          created_at?: string
          department: Database["public"]["Enums"]["department_type"]
          id?: string
          joined_at?: string
          name: string
          registration_time?: string | null
          status?: Database["public"]["Enums"]["patient_status"]
          token_number?: number | null
          updated_at?: string
          wait_time?: number
        }
        Update: {
          assigned_doctor?: string | null
          completed_at?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          id?: string
          joined_at?: string
          name?: string
          registration_time?: string | null
          status?: Database["public"]["Enums"]["patient_status"]
          token_number?: number | null
          updated_at?: string
          wait_time?: number
        }
        Relationships: [
          {
            foreignKeyName: "opd_queue_assigned_doctor_fkey"
            columns: ["assigned_doctor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_profiles: {
        Row: {
          allergies: string[] | null
          blood_group: string | null
          chronic_conditions: string[] | null
          created_at: string
          emergency_contact: string | null
          emergency_contact_phone: string | null
          height: number | null
          id: string
          medical_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          allergies?: string[] | null
          blood_group?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          height?: number | null
          id: string
          medical_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          allergies?: string[] | null
          blood_group?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          height?: number | null
          id?: string
          medical_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          instructions: string | null
          medicines: Json
          updated_at: string
          visit_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          instructions?: string | null
          medicines: Json
          updated_at?: string
          visit_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          instructions?: string | null
          medicines?: Json
          updated_at?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "medical_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          department: Database["public"]["Enums"]["department_type"] | null
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          email: string
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_medication_conflicts: {
        Args: { patient_id: string; new_medications: Json }
        Returns: {
          conflict_medicine: string
          conflicting_with: string
          conflict_type: string
        }[]
      }
      generate_medical_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_doctor: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_medical_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_nurse: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      admission_status:
        | "critical"
        | "stable"
        | "recovering"
        | "ready-for-discharge"
      bed_status: "available" | "occupied" | "reserved" | "maintenance"
      department_type:
        | "ENT"
        | "Ortho"
        | "Cardio"
        | "Neuro"
        | "General"
        | "Pediatric"
        | "Gynecology"
      inventory_status: "in-stock" | "low" | "out-of-stock"
      patient_status: "waiting" | "assigned" | "completed"
      user_role: "admin" | "doctor" | "nurse" | "staff" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admission_status: [
        "critical",
        "stable",
        "recovering",
        "ready-for-discharge",
      ],
      bed_status: ["available", "occupied", "reserved", "maintenance"],
      department_type: [
        "ENT",
        "Ortho",
        "Cardio",
        "Neuro",
        "General",
        "Pediatric",
        "Gynecology",
      ],
      inventory_status: ["in-stock", "low", "out-of-stock"],
      patient_status: ["waiting", "assigned", "completed"],
      user_role: ["admin", "doctor", "nurse", "staff", "patient"],
    },
  },
} as const
