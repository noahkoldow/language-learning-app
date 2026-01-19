// CEFR (Common European Framework of Reference for Languages) Level Definitions

export const CEFR_LEVELS = {
  A1: {
    code: 'A1',
    name: 'Beginner',
    description: 'Can understand and use familiar everyday expressions and very basic phrases.',
    order: 1,
  },
  A2: {
    code: 'A2',
    name: 'Elementary',
    description: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance.',
    order: 2,
  },
  B1: {
    code: 'B1',
    name: 'Intermediate',
    description: 'Can understand the main points of clear standard input on familiar matters.',
    order: 3,
  },
  B2: {
    code: 'B2',
    name: 'Upper Intermediate',
    description: 'Can understand the main ideas of complex text on both concrete and abstract topics.',
    order: 4,
  },
  C1: {
    code: 'C1',
    name: 'Advanced',
    description: 'Can understand a wide range of demanding, longer texts.',
    order: 5,
  },
  C2: {
    code: 'C2',
    name: 'Proficiency',
    description: 'Can understand with ease virtually everything heard or read.',
    order: 6,
  },
};

export const CEFR_LEVEL_CODES = Object.keys(CEFR_LEVELS);

/**
 * Get the next lower CEFR level
 * @param {string} currentLevel - Current CEFR level (e.g., 'B2')
 * @param {number} steps - Number of steps to go down (default: 1)
 * @returns {string|null} - Lower level code or null if already at lowest
 */
export function getLowerLevel(currentLevel, steps = 1) {
  const current = CEFR_LEVELS[currentLevel];
  if (!current) return null;
  
  const targetOrder = current.order - steps;
  const targetLevel = Object.values(CEFR_LEVELS).find(
    level => level.order === targetOrder
  );
  
  return targetLevel ? targetLevel.code : null;
}

/**
 * Get the next higher CEFR level
 * @param {string} currentLevel - Current CEFR level (e.g., 'A2')
 * @param {number} steps - Number of steps to go up (default: 1)
 * @returns {string|null} - Higher level code or null if already at highest
 */
export function getHigherLevel(currentLevel, steps = 1) {
  const current = CEFR_LEVELS[currentLevel];
  if (!current) return null;
  
  const targetOrder = current.order + steps;
  const targetLevel = Object.values(CEFR_LEVELS).find(
    level => level.order === targetOrder
  );
  
  return targetLevel ? targetLevel.code : null;
}

/**
 * Check if a level is valid
 * @param {string} level - CEFR level code
 * @returns {boolean}
 */
export function isValidLevel(level) {
  return CEFR_LEVEL_CODES.includes(level);
}

/**
 * Get level info
 * @param {string} level - CEFR level code
 * @returns {object|null}
 */
export function getLevelInfo(level) {
  return CEFR_LEVELS[level] || null;
}
