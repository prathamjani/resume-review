import React, { useState, useCallback } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
        onFileUpload(file);
      } else {
        alert('Please upload only PDF, DOC, DOCX, or text files');
      }
    }
  }, [onFileUpload]);

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    const validExtensions = ['.pdf', '.txt', '.doc', '.docx'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isValidFileType(file)) {
        setSelectedFile(file);
        onFileUpload(file);
      } else {
        alert('Please upload only PDF, DOC, DOCX, or text files');
      }
    }
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${isLoading ? 'loading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        
        <div className="upload-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Analyzing resume for personal information...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📄</div>
              <h3>Drop your resume here or click to browse</h3>
              <p>Supports PDF, DOC, DOCX, and text files</p>
              <label htmlFor="file-input" className="upload-button">
                Choose File
              </label>
              {selectedFile && (
                <div className="selected-file">
                  <span>Selected: {selectedFile.name}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="privacy-notice">
        <p>🔒 Your resume is processed locally and securely. We help identify personal information that should be removed for anonymous hiring processes.</p>
      </div>
    </div>
  );
};

export default FileUpload;