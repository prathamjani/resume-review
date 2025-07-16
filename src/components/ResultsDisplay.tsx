import React from 'react';
import { PIIItem } from '../services/geminiService';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
  piiItems: PIIItem[];
  onNewScan: () => void;
  showActions?: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ piiItems, onNewScan, showActions = true }) => {
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'name': return '👤';
      case 'email': return '📧';
      case 'phone': return '📞';
      case 'address': return '🏠';
      case 'linkedin': return '💼';
      case 'website': return '🌐';
      case 'social': return '📱';
      default: return '🔒';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'name': return '#d63384';
      case 'email': return '#dc3545';
      case 'phone': return '#fd7e14';
      case 'address': return '#6f42c1';
      case 'linkedin': return '#0d6efd';
      case 'website': return '#198754';
      case 'social': return '#20c997';
      default: return '#6c757d';
    }
  };

  const generateComment = (_piiText: string, piiType: string): string => {
    switch (piiType) {
      case 'name':
        return 'ANONYMIZE NAME - Replace with "Candidate" or initials only';
      case 'email':
        return 'REMOVE EMAIL - Replace with "Email available upon request"';
      case 'phone':
        return 'REMOVE PHONE - Replace with "Phone available upon request"';
      case 'address':
        return 'REMOVE ADDRESS - Keep only city/state/country';
      case 'linkedin':
        return 'REMOVE LINKEDIN - Delete personal profile link';
      case 'social':
        return 'REMOVE SOCIAL MEDIA - Delete personal profile links';
      case 'website':
        return 'REVIEW WEBSITE - Remove if personal, keep if professional portfolio';
      default:
        return 'REMOVE PERSONAL INFO - This may identify the candidate';
    }
  };

  if (piiItems.length === 0) {
    return (
      <div className="results-container">
        <div className="no-pii-found">
          <div className="success-icon">✅</div>
          <h2>Great News!</h2>
          <p>No personally identifiable information was detected in your resume.</p>
          <p>Your resume appears to be ready for anonymous hiring processes.</p>
          <button className="scan-again-btn" onClick={onNewScan}>
            Scan Another Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="alert-icon">⚠️</div>
        <h2>Privacy Alert</h2>
        <p>
          Found <strong>{piiItems.length}</strong> potential PII item{piiItems.length > 1 ? 's' : ''} that should be reviewed and anonymized before sharing.
        </p>
      </div>

      <div className="pii-items">
        {piiItems.map((item, index) => (
          <div key={index} className="pii-item" style={{ borderLeftColor: getTypeColor(item.type) }}>
            <div className="pii-header">
              <span className="pii-icon">{getTypeIcon(item.type)}</span>
              <span className="pii-type" style={{ color: getTypeColor(item.type) }}>
                {item.type.toUpperCase()}
              </span>
            </div>
            <div className="pii-content">
              <div className="pii-text">
                <strong>Found:</strong> "{item.text}"
              </div>
              <div className="pii-suggestion">
                <strong>Recommendation:</strong> {generateComment(item.text, item.type)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showActions && (
        <div className="action-buttons">
          <button className="scan-again-btn" onClick={onNewScan}>
            Scan Another Resume
          </button>
        </div>
      )}

      <div className="privacy-tips">
        <h3>💡 Privacy Tips</h3>
        <ul>
          <li>Replace your full name with "Candidate" or just initials</li>
          <li>Use "Email/Phone available upon request" instead of actual contact info</li>
          <li>Keep only city/state/country, remove street addresses</li>
          <li>Remove personal social media links and personal websites</li>
          <li>Keep professional portfolio links if they don't reveal identity</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsDisplay;