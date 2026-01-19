// PDF Upload Component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractTextFromPdf, isPdfFile } from '../../services/pdfParser';
import { useReaderContext } from '../../context/ReaderContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Loading } from '../UI/Loading';
import { LanguageSelector } from '../UI/LanguageSelector';

export function PdfUpload() {
  const navigate = useNavigate();
  const { loadText, setTargetLanguage } = useReaderContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('de');

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isPdfFile(file)) {
      setError('Please select a valid PDF file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(file);
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text found in PDF');
      }

      // Set the target language before loading text
      setTargetLanguage(selectedLanguage);

      loadText(text, {
        title: file.name.replace('.pdf', ''),
        source: 'upload',
      });

      navigate('/reader');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload PDF</h2>
      
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onChange={setSelectedLanguage}
        label="Translate to"
        className="mb-6"
      />
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
        {isUploading ? (
          <Loading text="Extracting text from PDF..." />
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button as="span" variant="primary">
                  Select PDF File
                </Button>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            
            <p className="mt-2 text-sm text-gray-600">
              Upload a PDF to start reading
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p className="font-semibold mb-2">Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>PDFs with selectable text work best</li>
          <li>Scanned PDFs may not work properly</li>
          <li>Large files may take longer to process</li>
        </ul>
      </div>
    </Card>
  );
}

export default PdfUpload;
