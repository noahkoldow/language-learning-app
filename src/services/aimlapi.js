// AIML API Service for Gemini models (OpenAI-compatible interface)
// This provides an alternative to the Google Gemini API when quota is exhausted

const AIML_API_KEY = import.meta.env.VITE_AIML_API_KEY;
const AIML_BASE_URL = 'https://api.aimlapi.com/v1';

// Model priority list for AIML API
const AIML_MODEL_PRIORITY = [
  'gemini-2.0-flash',
  'gemini-pro',
  'gemini-1.0-pro',
];

/**
 * Helper function to call AIML API with model fallback
 * @param {string} prompt - The prompt to send
 * @param {string} operationType - Type of operation for logging
 * @returns {Promise<string>} - Result from successful model
 */
async function callAIMLAPI(prompt, operationType = 'API call') {
  if (!AIML_API_KEY || AIML_API_KEY.trim() === '') {
    throw new Error('AIML API key not configured');
  }

  let lastError = null;

  // Try each model in priority order
  for (const modelName of AIML_MODEL_PRIORITY) {
    try {
      console.log(`Trying AIML API model: ${modelName} for ${operationType}`);
      
      const response = await fetch(`${AIML_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AIML_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from AIML API');
      }

      const result = data.choices[0].message.content;
      console.log(`Successfully used AIML API model: ${modelName} for ${operationType}`);
      return result;
    } catch (error) {
      console.warn(`AIML API model ${modelName} failed for ${operationType}:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }

  // All models failed
  throw new Error(`AIML API ${operationType} failed: All models failed. Last error: ${lastError?.message}`);
}

/**
 * Translate text with structure preservation using AIML API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} cefrLevel - CEFR level (A1, A2, B1, B2, C1, C2)
 * @param {string} sourceLanguage - Source language (optional)
 * @returns {Promise<string>} - Translated text
 */
export async function translateWithStructure(
  text,
  targetLanguage,
  cefrLevel = 'B2',
  sourceLanguage = 'auto'
) {
  const prompt = `You are a language learning assistant. Translate the following text to ${targetLanguage} at CEFR level ${cefrLevel}.

CRITICAL REQUIREMENTS:
1. Maintain the EXACT sentence structure of the original text
2. Each sentence in the original must correspond to exactly one sentence in the translation
3. Keep word order as close as possible to the original for structural comparison
4. Only adjust vocabulary complexity to match the ${cefrLevel} level
5. Preserve paragraph breaks and formatting
6. Do NOT add explanations, only provide the translation

${sourceLanguage !== 'auto' ? `Source language: ${sourceLanguage}` : ''}

Text to translate:
${text}`;

  return callAIMLAPI(prompt, 'translation');
}

/**
 * Translate a single word with context using AIML API
 * @param {string} word - Word to translate
 * @param {string} targetLanguage - Target language
 * @param {string} context - Sentence context
 * @returns {Promise<string>} - Translated word with brief explanation
 */
export async function translateWord(word, targetLanguage, context = '') {
  const prompt = `Translate the word "${word}" to ${targetLanguage}.
${context ? `Context: "${context}"` : ''}

Provide:
1. The translation
2. A brief explanation (1 sentence) if helpful for understanding

Format: [translation] - [brief explanation if needed]
Example: "casa - house, home"

Keep it concise.`;

  return callAIMLAPI(prompt, 'word translation');
}

/**
 * Simplify text by reducing CEFR level using AIML API
 * @param {string} text - Text to simplify
 * @param {string} language - Language of the text
 * @param {string} targetLevel - Target CEFR level
 * @returns {Promise<string>} - Simplified text
 */
export async function simplifyText(text, language, targetLevel) {
  const prompt = `You are a language learning assistant. Simplify the following ${language} text to CEFR level ${targetLevel}.

CRITICAL REQUIREMENTS:
1. Maintain the EXACT sentence structure and count
2. Each sentence must remain one sentence
3. Keep the same word order as much as possible
4. Only replace complex vocabulary with simpler alternatives
5. Preserve all paragraph breaks
6. Do NOT add explanations

Text to simplify:
${text}`;

  return callAIMLAPI(prompt, 'simplification');
}

export default {
  translateWithStructure,
  translateWord,
  simplifyText,
};
