export interface PIIItem {
  text: string;
  type: 'name' | 'email' | 'phone' | 'address' | 'website' | 'linkedin' | 'social';
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

export class GeminiService {
  private apiKey: string;
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async detectPersonalInfo(resumeText: string): Promise<PIIItem[]> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('Gemini API key is missing');
    }

    const prompt = `You are a privacy assistant helping to anonymize resumes for blind hiring reviews.

Find personally identifiable information and return both the text and its type.

DETECT THESE TYPES:
1. "name" - Full names (first AND last name together)
2. "email" - Email addresses 
3. "phone" - Phone numbers in any format
4. "address" - Street addresses with house numbers
5. "website" - Personal websites or portfolios
6. "linkedin" - LinkedIn profile URLs
7. "social" - Other social media links

DO NOT INCLUDE:
- Company names, job titles, skills, qualifications
- University/school names
- City/state/country names only (without street addresses)
- Professional certifications, work experience

Return a JSON array of objects with "text" and "type" fields.
Example format:
[
  {"text": "John Smith", "type": "name"},
  {"text": "john@email.com", "type": "email"},
  {"text": "(555) 123-4567", "type": "phone"}
]

If nothing found, return: []

Resume text:
${resumeText}

JSON array:`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', errorText);
        
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again in a few minutes.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        } else {
          throw new Error(`API request failed with status: ${response.status}. ${errorText}`);
        }
      }

      const data: GeminiResponse = await response.json();

      if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message}`);
      }

      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!output) {
        throw new Error('No output from Gemini');
      }

      // Clean up the output - remove markdown formatting if present
      let cleanOutput = output.trim();
      if (cleanOutput.startsWith('```json')) {
        cleanOutput = cleanOutput.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanOutput.startsWith('```')) {
        cleanOutput = cleanOutput.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      const piiArray = JSON.parse(cleanOutput);

      if (!Array.isArray(piiArray)) {
        throw new Error('Gemini did not return an array');
      }

      return piiArray.filter((item: any) => item && item.text && item.type);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred during PII detection');
    }
  }

  generateCommentForPII(piiText: string, piiType: string): string {
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
  }
}