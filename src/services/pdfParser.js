// PDF to Text Conversion Service
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for PDF.js
const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * Extract text from PDF file
 * @param {File} file - PDF file
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const numPages = pdf.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items and join them
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Validate if file is a PDF
 * @param {File} file
 * @returns {boolean}
 */
export function isPdfFile(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Get PDF metadata
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function getPdfMetadata(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const metadata = await pdf.getMetadata();
    
    return {
      numPages: pdf.numPages,
      info: metadata.info,
      metadata: metadata.metadata,
    };
  } catch (error) {
    console.error('PDF metadata error:', error);
    return null;
  }
}

export default {
  extractTextFromPdf,
  isPdfFile,
  getPdfMetadata,
};
