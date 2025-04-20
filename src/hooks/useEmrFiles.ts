
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileUpload } from '@/types/emr.types';
import { toast } from 'sonner';

export function useEmrFiles() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const uploadFile = async (
    file: File, 
    path: string, 
    visitId?: string,
    labReportId?: string,
    userId: string = ''
  ): Promise<FileUpload> => {
    if (!visitId && !labReportId) {
      throw new Error('Either visitId or labReportId must be provided');
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // 1. Upload file to storage
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `${path}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('emr_files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });
      
      if (uploadError) throw uploadError;
      
      // 2. Get the file URL
      const { data: urlData } = await supabase.storage
        .from('emr_files')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry
      
      // 3. Record the file in the database
      const fileRecord = {
        visit_id: visitId || null,
        lab_report_id: labReportId || null,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: userId,
      };
      
      const { data: dbData, error: dbError } = await supabase
        .from('file_uploads')
        .insert(fileRecord)
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      toast.success('File uploaded successfully');
      return { ...dbData, url: urlData.signedUrl } as FileUpload;
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const getFileUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('emr_files')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  };
  
  const getFilesByVisitId = async (visitId: string) => {
    try {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('visit_id', visitId);
      
      if (error) throw error;
      
      return data as FileUpload[];
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  };
  
  const getFilesByLabReportId = async (labReportId: string) => {
    try {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('lab_report_id', labReportId);
      
      if (error) throw error;
      
      return data as FileUpload[];
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  };
  
  return {
    uploadFile,
    getFileUrl,
    getFilesByVisitId,
    getFilesByLabReportId,
    isUploading,
    uploadProgress
  };
}
