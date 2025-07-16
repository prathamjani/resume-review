import React from 'react';
import ResumeViewer from './ResumeViewer';
import ResultsDisplay from './ResultsDisplay';
import { PIIItem } from '../services/geminiService';
import './ResultsLayout.css';

interface ResultsLayoutProps {
  originalText: string;
  piiItems: PIIItem[];
  fileName: string;
  onNewScan: () => void;
}

const ResultsLayout: React.FC<ResultsLayoutProps> = ({
  originalText,
  piiItems,
  fileName,
  onNewScan
}) => {
  return (
    <div className="results-layout">
      <div className="results-header">
        <div className="results-title">
          <h2>📊 Analysis Results</h2>
          <div className="results-summary">
            {piiItems.length > 0 ? (
              <span className="pii-alert">
                ⚠️ {piiItems.length} PII item{piiItems.length !== 1 ? 's' : ''} found
              </span>
            ) : (
              <span className="pii-clear">✅ No PII detected</span>
            )}
          </div>
        </div>
        <div className="results-actions">
          <button className="new-scan-btn" onClick={onNewScan}>
            🔄 New Scan
          </button>
        </div>
      </div>
      
      <div className="results-content">
        <div className="resume-panel">
          <ResumeViewer 
            originalText={originalText}
            piiItems={piiItems}
            fileName={fileName}
          />
        </div>
        
        <div className="alerts-panel">
          <ResultsDisplay 
            piiItems={piiItems}
            onNewScan={onNewScan}
            showActions={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsLayout;