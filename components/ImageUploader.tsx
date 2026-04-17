import React, { useState, useCallback, useEffect } from 'react';
import { UploadIcon, XCircleIcon } from './Icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  onFileSelect: (file: File | null, previewUrl: string | null) => void;
  isRequired?: boolean;
  previewUrl?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileSelect, isRequired, previewUrl }) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    setPreview(previewUrl || null);
  }, [previewUrl]);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onFileSelect(file, result);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    } else {
      setPreview(null);
      setFileName('');
      onFileSelect(null, null);
    }
  }, [onFileSelect]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleFileChange(null);
  };
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label} {isRequired && <span className="text-red-400">*</span>}
      </label>
      <div className="mt-2">
        {preview ? (
          <div className="relative group w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <button 
                onClick={handleRemoveImage}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                aria-label="Remove image"
              >
                <XCircleIcon />
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={id}
            className={`flex justify-center items-center w-full h-48 px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-fuchsia-500 transition-colors ${isDragging ? 'border-fuchsia-500 bg-gray-700/50' : 'bg-gray-700/20'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <UploadIcon />
              <div className="flex text-sm text-gray-400">
                <span className="relative font-semibold text-fuchsia-400">
                  <span>Upload an image</span>
                  <input 
                    id={id} 
                    name={id} 
                    type="file" 
                    className="sr-only" 
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                  />
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;