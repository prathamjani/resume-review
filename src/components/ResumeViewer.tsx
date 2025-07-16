import React from 'react';
import { PIIItem } from '../services/geminiService';
import './ResumeViewer.css';

interface ResumeViewerProps {
  originalText: string;
  piiItems: PIIItem[];
  fileName: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ originalText, piiItems, fileName }) => {
  const highlightPII = (text: string): React.ReactElement[] => {
    if (!piiItems || piiItems.length === 0) {
      return [<span key="0">{text}</span>];
    }

    const elements: React.ReactElement[] = [];
    const highlights: { start: number; end: number; item: PIIItem }[] = [];

    // Find all PII positions in the text
    piiItems.forEach((item, index) => {
      const regex = new RegExp(item.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        highlights.push({
          start: match.index,
          end: match.index + match[0].length,
          item: { ...item, text: match[0] }
        });
      }
    });

    // Sort highlights by position
    highlights.sort((a, b) => a.start - b.start);

    // Remove overlapping highlights
    const nonOverlapping: typeof highlights = [];
    highlights.forEach(current => {
      const lastNonOverlapping = nonOverlapping[nonOverlapping.length - 1];
      if (!lastNonOverlapping || current.start >= lastNonOverlapping.end) {
        nonOverlapping.push(current);
      }
    });

    // Build the highlighted text
    let currentIndex = 0;
    nonOverlapping.forEach((highlight, index) => {
      // Add text before highlight
      if (currentIndex < highlight.start) {
        elements.push(
          <span key={`text-${index}`}>
            {text.substring(currentIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      elements.push(
        <span
          key={`highlight-${index}`}
          className={`pii-highlight pii-type-${highlight.item.type}`}
          title={`${highlight.item.type.toUpperCase()}: ${highlight.item.text}`}
        >
          {highlight.item.text}
        </span>
      );

      currentIndex = highlight.end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      elements.push(
        <span key="text-end">
          {text.substring(currentIndex)}
        </span>
      );
    }

    return elements;
  };

  const formatTextWithLineBreaks = (text: string): React.ReactElement[] => {
    // Split text into lines and process each line
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    
    lines.forEach((line, lineIndex) => {
      if (line.trim() === '') {
        // Empty line - add a line break
        elements.push(<br key={`br-${lineIndex}`} />);
      } else {
        // Process line for PII highlighting
        const lineElements = highlightPII(line);
        elements.push(
          <div key={`line-${lineIndex}`} className="resume-line">
            {lineElements}
          </div>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="resume-viewer">
      <div className="resume-viewer-header">
        <h3>📄 {fileName}</h3>
        <div className="resume-stats">
          <span className="word-count">
            {originalText.split(/\s+/).filter(word => word.length > 0).length} words
          </span>
          <span className="pii-count">
            {piiItems.length} PII item{piiItems.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>
      
      <div className="resume-content">
        <div className="resume-text">
          {formatTextWithLineBreaks(originalText)}
        </div>
      </div>
      
      <div className="resume-legend">
        <h4>PII Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color pii-type-name"></span>
            <span>Name</span>
          </div>
          <div className="legend-item">
            <span className="legend-color pii-type-email"></span>
            <span>Email</span>
          </div>
          <div className="legend-item">
            <span className="legend-color pii-type-phone"></span>
            <span>Phone</span>
          </div>
          <div className="legend-item">
            <span className="legend-color pii-type-address"></span>
            <span>Address</span>
          </div>
          <div className="legend-item">
            <span className="legend-color pii-type-linkedin"></span>
            <span>LinkedIn</span>
          </div>
          <div className="legend-item">
            <span className="legend-color pii-type-website"></span>
            <span>Website</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;