// Text Library Component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReaderContext } from '../../context/ReaderContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

// Sample texts for demonstration
const SAMPLE_TEXTS = [
  {
    id: 1,
    title: 'Der kleine Prinz',
    author: 'Antoine de Saint-Exupéry',
    language: 'German',
    level: 'B1',
    excerpt: 'Als ich sechs Jahre alt war, sah ich einmal ein wunderbares Bild...',
    fullText: `Als ich sechs Jahre alt war, sah ich einmal ein wunderbares Bild in einem Buch über den Urwald, das "Erlebte Geschichten" hieß. Es stellte eine Riesenschlange dar, die ein Raubtier verschlang.

Die großen Leute haben mir geraten, mit den Zeichnungen von offenen und geschlossenen Riesenschlangen aufzuhören und mich mehr für Geografie, Geschichte, Rechnen und Grammatik zu interessieren.

So habe ich denn eine großartige Karriere aufgegeben und das Fliegen gelernt. Ich bin überall in der Welt herumgeflogen.`,
  },
  {
    id: 2,
    title: 'Ein Tag in Berlin',
    author: 'Sample Text',
    language: 'German',
    level: 'A2',
    excerpt: 'Berlin ist die Hauptstadt von Deutschland. Es ist eine große Stadt...',
    fullText: `Berlin ist die Hauptstadt von Deutschland. Es ist eine große Stadt mit vielen Menschen. In Berlin gibt es viele interessante Orte.

Der Fernsehturm ist sehr hoch. Man kann von oben die ganze Stadt sehen. Das Brandenburger Tor ist sehr berühmt. Viele Touristen machen dort Fotos.

In Berlin kann man gut essen. Es gibt Restaurants aus vielen Ländern. Die öffentlichen Verkehrsmittel sind gut. Man kann mit der U-Bahn, S-Bahn oder Bus fahren.`,
  },
  {
    id: 3,
    title: 'Die deutsche Sprache',
    author: 'Sample Text',
    language: 'German',
    level: 'B2',
    excerpt: 'Deutsch ist eine westgermanische Sprache, die weltweit von etwa 100 Millionen...',
    fullText: `Deutsch ist eine westgermanische Sprache, die weltweit von etwa 100 Millionen Menschen als Muttersprache und von weiteren 80 Millionen als Zweit- oder Fremdsprache gesprochen wird.

Die deutsche Sprache zeichnet sich durch ihre komplexe Grammatik aus, insbesondere durch das System der vier Fälle (Nominativ, Genitiv, Dativ, Akkusativ) und die drei grammatischen Geschlechter (maskulin, feminin, neutral).

Ein charakteristisches Merkmal des Deutschen ist die Möglichkeit, durch Komposition neue Wörter zu bilden, wodurch sehr lange zusammengesetzte Substantive entstehen können.`,
  },
];

export function TextLibrary() {
  const navigate = useNavigate();
  const { loadText } = useReaderContext();
  const [selectedText, setSelectedText] = useState(null);

  const handleSelectText = (text) => {
    loadText(text.fullText, {
      title: text.title,
      author: text.author,
      language: text.language,
      level: text.level,
    });
    navigate('/reader');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Text Library</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_TEXTS.map((text) => (
          <Card key={text.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div onClick={() => setSelectedText(text)}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {text.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">by {text.author}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                  {text.language}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {text.level}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                {text.excerpt}
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
