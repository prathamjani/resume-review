import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export class DocumentService {
  static async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
          let fullText = '';
          
          // Extract text from each page
          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            
            // Process items to preserve line breaks and formatting
            let pageText = '';
            let lastY = 0;
            
            textContent.items.forEach((item: any, index: number) => {
              // Check if item has transform property (TextItem)
              if (item.transform && item.str) {
                const currentY = item.transform[5];
                
                // If Y position changed significantly, it's likely a new line
                if (index > 0 && Math.abs(currentY - lastY) > 5) {
                  pageText += '\n';
                }
                
                pageText += item.str;
                
                // Add space if the next item is on the same line
                if (index < textContent.items.length - 1) {
                  const nextItem = textContent.items[index + 1] as any;
                  if (nextItem.transform) {
                    const nextY = nextItem.transform[5];
                    if (Math.abs(currentY - nextY) <= 5) {
                      pageText += ' ';
                    }
                  }
                }
                
                lastY = currentY;
              } else if (item.str) {
                // Fallback for items without transform
                pageText += item.str + ' ';
              }
            });
            
            fullText += pageText + '\n\n';
          }
          
          resolve(fullText.trim());
        } catch (error) {
          reject(new Error('Failed to extract text from PDF: ' + (error as Error).message));
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Failed to read PDF file'));
      };
      
      fileReader.readAsArrayBuffer(file);
    });
  }

  static async extractTextFromTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = (event) => {
        const text = event.target?.result as string;
        resolve(text);
      };
      
      fileReader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };
      
      fileReader.readAsText(file);
    });
  }

  static async extractTextFromDocx(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          // Clean up the text but preserve structure
          const cleanText = result.value
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive blank lines
            .trim();
          resolve(cleanText);
        } catch (error) {
          reject(new Error('Failed to extract text from DOCX: ' + (error as Error).message));
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Failed to read DOCX file'));
      };
      
      fileReader.readAsArrayBuffer(file);
    });
  }

  static async extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (file.type === 'text/plain') {
      return this.extractTextFromTextFile(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.type === 'application/msword' || 
               file.name.endsWith('.docx') || 
               file.name.endsWith('.doc')) {
      return this.extractTextFromDocx(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF, DOC, DOCX, or text file.');
    }
  }
}