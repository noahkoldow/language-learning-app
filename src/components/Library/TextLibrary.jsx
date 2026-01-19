// Text Library Component
import { useNavigate } from 'react-router-dom';
import { useReaderContext } from '../../context/ReaderContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { sampleTexts } from '../../data/sampleTexts';

export function TextLibrary() {
  const navigate = useNavigate();
  const { loadText } = useReaderContext();

  const handleSelectText = (text) => {
    // Handle both formats: pages array or fullText string
    if (text.pages && Array.isArray(text.pages)) {
      // New format with pages array
      loadText(text.pages, {
        title: text.title,
        author: text.author,
        language: text.language,
        targetLanguage: text.targetLanguage,
        isPagesArray: true,
      });
    } else {
      // Legacy format with fullText
      loadText(text.fullText, {
        title: text.title,
        author: text.author,
        language: text.language,
        level: text.level,
      });
    }
    navigate('/reader');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Text Library</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleTexts.map((text) => (
          <Card key={text.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {text.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">by {text.author}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                  {text.language.toUpperCase()}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {text.pages.length} pages
                </span>
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                {text.description}
              </p>
              
              <Button 
                variant="primary" 
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectText(text);
                }}
              >
                Read
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TextLibrary;
