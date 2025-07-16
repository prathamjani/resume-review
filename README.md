# Resume Privacy Checker

A React application that helps identify and anonymize personally identifiable information (PII) in resumes for blind hiring processes. Built with React, TypeScript, and Google's Gemini AI.

## Features

- **Multiple File Formats**: Supports PDF, DOC, DOCX, and text file uploads via drag-and-drop or file browser
- **PII Detection**: Uses Google's Gemini AI to identify various types of personal information
- **Split-Screen Interface**: View original resume with highlighted PII alongside detailed analysis
- **Comprehensive Analysis**: Detects names, email addresses, phone numbers, addresses, LinkedIn profiles, and personal websites
- **Clear Recommendations**: Provides specific suggestions for anonymizing each type of PII
- **Formatting Preservation**: Maintains original document structure and formatting
- **Responsive Design**: Works on desktop and mobile devices
- **Privacy-First**: All processing happens in your browser with direct API calls

## What We Detect

- **Names**: Full names that could identify candidates
- **Email Addresses**: Personal and professional email addresses
- **Phone Numbers**: Mobile and landline numbers in any format
- **Addresses**: Street addresses with house numbers
- **LinkedIn Profiles**: Personal LinkedIn profile URLs
- **Personal Websites**: Personal websites and portfolio links

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- A Google Gemini API key (free tier available)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd resume-pii-checker
npm install
```

### 2. Get a Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for use in the application

### 3. Configure API Key (Required)

```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add your API key
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run the Application

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## Usage

1. **Upload Resume**: Drag and drop a PDF, DOC, DOCX, or text file, or click to browse for files
2. **Review Results**: The application will analyze your resume in a split-screen view:
   - **Left Panel**: Original resume with PII highlighted in different colors
   - **Right Panel**: Detailed analysis with specific recommendations for each PII item
3. **Follow Recommendations**: Use the provided suggestions to manually anonymize your resume

## Privacy and Security

- **Local Processing**: File content is processed locally in your browser
- **Direct API Calls**: Your resume text is sent directly to Google's Gemini API
- **No Data Storage**: No resume data is stored on any servers
- **Secure Transmission**: All API calls use HTTPS encryption

## API Usage

The application uses Google's Gemini 1.5 Flash model for PII detection. API calls are made directly from your browser to Google's servers, ensuring your data doesn't pass through any intermediary servers.

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Troubleshooting

### Common Issues

**"Gemini API key is not configured" error**
- Ensure you've added REACT_APP_GEMINI_API_KEY to your .env.local file
- Check that the key is valid and has the necessary permissions
- Restart the development server after adding the API key

**"Failed to extract text from PDF" error**
- Try converting your PDF to text format
- Ensure the PDF contains readable text (not just images)

**"API request failed" errors**
- Check your internet connection
- Verify your API key is valid and has remaining quota
- Wait a moment and try again (rate limiting)

## Technical Details

### Built With
- React 18 with TypeScript
- Google Gemini AI API
- PDF-Parse for PDF text extraction
- CSS3 with responsive design

### Architecture
- Frontend-only application (no backend required)
- Direct API integration with Google's Gemini API
- Component-based React architecture
- TypeScript for type safety

### Browser Support
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported
