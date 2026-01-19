/**
 * Text processing utilities for splitting text into pages
 */

const WORDS_PER_PAGE = 300; // Approximate words per page for reading
const CHARS_PER_PAGE = 2000; // Fallback: characters per page

/**
 * Split text into pages based on word count
 * @param {string} text - The full text to split
 * @param {number} wordsPerPage - Words per page (default: 300)
 * @returns {string[]} - Array of page texts
 */
export function splitTextIntoPages(text, wordsPerPage = WORDS_PER_PAGE) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Split by paragraphs first to maintain structure
  const paragraphs = text.split(/\n\n+/);
  const pages = [];
  let currentPage = '';
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.split(/\s+/).filter(w => w.length > 0);
    const paragraphWordCount = paragraphWords.length;

    // If adding this paragraph would exceed the limit
    if (currentWordCount + paragraphWordCount > wordsPerPage && currentPage) {
      pages.push(currentPage.trim());
      currentPage = paragraph;
      currentWordCount = paragraphWordCount;
    } else {
      currentPage += (currentPage ? '\n\n' : '') + paragraph;
      currentWordCount += paragraphWordCount;
    }
  }

  // Add the last page if it has content
  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [text];
}

/**
 * Count words in text
 * @param {string} text
 * @returns {number}
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Extract a sentence containing a specific word
 * @param {string} text - The full text
 * @param {number} wordIndex - Index of the word in the text
 * @returns {string} - The sentence containing the word
 */
export function extractSentence(text, wordIndex) {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let charCount = 0;
  for (const sentence of sentences) {
    const sentenceEnd = charCount + sentence.length;
    if (wordIndex >= charCount && wordIndex < sentenceEnd) {
      return sentence.trim();
    }
    charCount = sentenceEnd;
  }
  
  return '';
}

/**
 * Get word at position in text
 * @param {string} text
 * @param {number} position - Character position
 * @returns {object} - {word: string, startIndex: number, endIndex: number}
 */
export function getWordAtPosition(text, position) {
  // Find word boundaries
  let start = position;
  let end = position;
  
  // Find start of word
  while (start > 0 && /\w/.test(text[start - 1])) {
    start--;
  }
  
  // Find end of word
  while (end < text.length && /\w/.test(text[end])) {
    end++;
  }
  
  return {
    word: text.substring(start, end),
    startIndex: start,
    endIndex: end,
  };
}

/**
 * Estimate reading time in minutes
 * @param {string} text
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number}
 */
export function estimateReadingTime(text, wordsPerMinute = 200) {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}
