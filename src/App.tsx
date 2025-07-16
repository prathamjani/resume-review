import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsLayout from './components/ResultsLayout';
import { GeminiService, PIIItem } from './services/geminiService';
import { DocumentService } from './services/documentService';
import './App.css';

const App: React.FC = () => {
  const [piiItems, setPiiItems] = useState<PIIItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [originalText, setOriginalText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY || '';

  const handleFileUpload = async (file: File) => {
    if (!geminiApiKey.trim()) {
      setError('Gemini API key is not configured. Please add REACT_APP_GEMINI_API_KEY to your .env.local file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Extract text from file
      const text = await DocumentService.extractTextFromFile(file);
      
      if (!text || text.trim().length === 0) {
        setError('The uploaded file appears to be empty or contains no readable text');
        setIsLoading(false);
        return;
      }

      // Store original text and filename
      setOriginalText(text);
      setFileName(file.name);

      // Detect PII using Gemini API
      const geminiService = new GeminiService(geminiApiKey);
      const detectedPII = await geminiService.detectPersonalInfo(text);
      
      setPiiItems(detectedPII);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewScan = () => {
    setShowResults(false);
    setPiiItems([]);
    setOriginalText('');
    setFileName('');
    setError(null);
  };



  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1>Resume Privacy Checker</h1>
            <p>Identify and anonymize personal information for blind hiring</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {!showResults ? (
            <>
              <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
              
              {error && (
                <div className="error-message">
                  <div className="error-icon">❌</div>
                  <p>{error}</p>
                </div>
              )}

            </>
          ) : (
            <ResultsLayout 
              originalText={originalText}
              piiItems={piiItems}
              fileName={fileName}
              onNewScan={handleNewScan}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
