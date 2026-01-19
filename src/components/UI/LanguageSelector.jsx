// Reusable Language Selector Component
import { SUPPORTED_LANGUAGES } from '../../utils/languages';

/**
 * Language Selector Component
 * @param {string} selectedLanguage - Currently selected language code
 * @param {function} onChange - Callback function when language changes
 * @param {string} label - Label for the selector
 * @param {string} className - Additional CSS classes
 */
export function LanguageSelector({ 
  selectedLanguage, 
  onChange, 
  label = 'Übersetzen nach',
  className = ''
}) {
  const handleChange = (e) => {
    const langCode = e.target.value;
    onChange(langCode);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelector;
