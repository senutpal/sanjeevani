
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEmrFiles } from '@/hooks/useEmrFiles';
import { FileUpload } from '@/types/emr.types';
import { Upload, Paperclip, File } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FileUploaderProps {
  visitId?: string;
  labReportId?: string;
  onUploadComplete?: (file: FileUpload) => void;
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
}

export default function FileUploader({
  visitId,
  labReportId,
  onUploadComplete,
  allowedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
  maxFileSizeMB = 10
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { uploadFile, isUploading, uploadProgress } = useEmrFiles();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (!file) return;
    
    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxFileSizeMB}MB`);
      event.target.value = '';
      return;
    }
    
    // Check file type if restrictions exist
    if (allowedFileTypes.length > 0) {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!allowedFileTypes.includes(fileExtension) && !allowedFileTypes.includes(file.type)) {
        toast.error(`Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`);
        event.target.value = '';
        return;
      }
    }
    
    setSelectedFile(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    
    if (!visitId && !labReportId) {
      toast.error('Visit or Lab Report reference is required for upload');
      return;
    }
    
    try {
      const path = visitId 
        ? `visits/${visitId}`
        : `lab-reports/${labReportId}`;
      
      const uploadedFile = await uploadFile(
        selectedFile,
        path,
        visitId,
        labReportId,
        user.id
      );
      
      if (onUploadComplete) {
        onUploadComplete(uploadedFile);
      }
      
      // Reset the form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Document</span>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={allowedFileTypes.join(',')}
        />
        
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate flex-1">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
      </div>
      
      <Button
        type="button"
        variant="default"
        className="w-full gap-2"
        disabled={!selectedFile || isUploading}
        onClick={handleUpload}
      >
        <Upload className="h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </div>
  );
}
