import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded }) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'image/png'
    );
    
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type === 'image/png'
    );
    
    if (files.length > 0) {
      onFilesAdded(files);
    }
    
    // Reset input value to allow selecting same files again
    e.target.value = '';
  }, [onFilesAdded]);

  return (
    <div className="w-full">
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Drop PNG images here or click to select
        </p>
        <p className="text-sm text-gray-500">
          Multiple PNG files supported
        </p>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/png"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};