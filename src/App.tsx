import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HfInference } from '@huggingface/inference';
import { FileText, Globe2, Github, Linkedin, Download, Volume2 } from 'lucide-react';

// Maximum PDF size in bytes (10MB)
const MAX_PDF_SIZE = 10 * 1024 * 1024;

// Map of language codes to their corresponding model names
const SUPPORTED_LANGUAGES = [
  { code: 'fr', name: 'French', model: 'Helsinki-NLP/opus-mt-en-fr' },
  { code: 'es', name: 'Spanish', model: 'Helsinki-NLP/opus-mt-en-es' },
  { code: 'de', name: 'German', model: 'Helsinki-NLP/opus-mt-en-de' },
  { code: 'it', name: 'Italian', model: 'Helsinki-NLP/opus-mt-en-it' },
  { code: 'pt', name: 'Portuguese', model: 'Helsinki-NLP/opus-mt-en-pt' },
  { code: 'ru', name: 'Russian', model: 'Helsinki-NLP/opus-mt-en-ru' },
  { code: 'ja', name: 'Japanese', model: 'Helsinki-NLP/opus-mt-en-ja' },
  { code: 'ko', name: 'Korean', model: 'Helsinki-NLP/opus-mt-en-ko' },
  { code: 'zh', name: 'Chinese', model: 'Helsinki-NLP/opus-mt-en-zh' },
  { code: 'hi', name: 'Hindi', model: 'Helsinki-NLP/opus-mt-en-hi' }
];

const hf = new HfInference("here your api will come");

// Helper function to split text into chunks
const splitIntoChunks = (text: string, chunkSize: number = 500): string[] => {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
};

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_PDF_SIZE) {
      alert('PDF file is too large. Maximum size allowed is 10MB.');
      return;
    }

    setIsLoading(true);
    setExtractedText('');
    setTranslatedText('');
    
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      if (!event.target?.result) return;
      
      const pdfData = new Uint8Array(event.target.result as ArrayBuffer);
      try {
        // @ts-ignore
        const pdf = await pdfjsLib.getDocument(pdfData).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        
        setExtractedText(fullText);
        translateText(fullText);
      } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Error processing PDF. Please try again.');
      }
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const translateText = async (text: string) => {
    try {
      setIsTranslating(true);
      const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);
      if (!selectedLang) {
        throw new Error('Language not supported');
      }

      // Split text into smaller chunks
      const chunks = splitIntoChunks(text);
      let translatedChunks: string[] = [];

      // Translate each chunk
      for (const chunk of chunks) {
        if (chunk.trim()) {
          const translation = await hf.translation({
            model: selectedLang.model,
            inputs: chunk,
          });
          translatedChunks.push(translation.translation_text);
        }
      }

      // Combine translated chunks
      setTranslatedText(translatedChunks.join('\n\n'));
    } catch (error) {
      console.error('Translation error:', error);
      alert('Error translating text. The text might be too long or the selected language model might not be available. Please try with a shorter text or a different language.');
    } finally {
      setIsTranslating(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: MAX_PDF_SIZE
  });

  const downloadTranslation = () => {
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated_document_${selectedLanguage}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const speakText = () => {
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = selectedLanguage;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Globe2 className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold">Real-Time Language Translator for PDF</h1>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://github.com/aryan1112003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/aryan-acharya-9b939b316/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-400'}`}
          >
            <input {...getInputProps()} />
            <FileText className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <p className="text-lg mb-2">
              {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here, or click to select'}
            </p>
            <p className="text-sm text-gray-400">Supported format: PDF (max 10MB)</p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select Target Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full md:w-64 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Translation Display */}
        {(extractedText || translatedText) && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Original Text</h2>
              <div className="bg-gray-900 rounded p-4 h-96 overflow-auto">
                {extractedText}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Translated Text</h2>
              <div className="bg-gray-900 rounded p-4 h-96 overflow-auto">
                {isTranslating ? (
                  <div className="h-full flex items-center justify-center">
                    <div>
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                      <p className="mt-4 text-gray-400">Translating...</p>
                    </div>
                  </div>
                ) : (
                  translatedText
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={speakText}
                  disabled={isTranslating}
                  className="flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Speak
                </button>
                <button
                  onClick={downloadTranslation}
                  disabled={isTranslating}
                  className="flex items-center px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-4">Processing document...</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Created by Aryan Acharya. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;