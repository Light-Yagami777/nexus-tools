
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

const CaseConverter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [lastConversion, setLastConversion] = useState('');

  const convertCase = (conversionType: string) => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to convert');
      return;
    }

    let result = '';
    setLastConversion(conversionType);

    switch (conversionType) {
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'titlecase':
        result = inputText
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        break;
      case 'sentencecase':
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camelcase':
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[A-Z]/, c => c.toLowerCase());
        break;
      case 'pascalcase':
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[a-z]/, c => c.toUpperCase());
        break;
      case 'snakecase':
        result = inputText
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '');
        break;
      case 'kebabcase':
        result = inputText
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '');
        break;
      case 'togglecase':
        result = inputText
          .split('')
          .map(char => {
            return char === char.toUpperCase() 
              ? char.toLowerCase() 
              : char.toUpperCase();
          })
          .join('');
        break;
      default:
        result = inputText;
    }

    setOutputText(result);
    toast.success(`Text converted to ${conversionType}`);
  };

  const copyToClipboard = () => {
    if (!outputText) {
      toast.error('No text to copy');
      return;
    }

    navigator.clipboard.writeText(outputText)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  const clearText = () => {
    setInputText('');
    setOutputText('');
    setLastConversion('');
  };

  const conversionButtons = [
    { id: 'uppercase', name: 'UPPERCASE' },
    { id: 'lowercase', name: 'lowercase' },
    { id: 'titlecase', name: 'Title Case' },
    { id: 'sentencecase', name: 'Sentence case' },
    { id: 'camelcase', name: 'camelCase' },
    { id: 'pascalcase', name: 'PascalCase' },
    { id: 'snakecase', name: 'snake_case' },
    { id: 'kebabcase', name: 'kebab-case' },
    { id: 'togglecase', name: 'tOGGLE cASE' },
  ];

  return (
    <ToolLayout title="Case Converter">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Convert Text Case</CardTitle>
            <CardDescription>
              Enter your text and convert it to different case formats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Input Text</label>
                <Textarea
                  placeholder="Enter text to convert..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="h-32"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {conversionButtons.map((button) => (
                  <Button
                    key={button.id}
                    onClick={() => convertCase(button.id)}
                    variant={lastConversion === button.id ? "default" : "outline"}
                    className="text-xs"
                  >
                    {button.name}
                  </Button>
                ))}
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Output</label>
                  {outputText && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={copyToClipboard}
                      className="h-8"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <Textarea
                  readOnly
                  value={outputText}
                  className="h-32"
                />
              </div>

              <Button variant="outline" onClick={clearText}>Clear All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CaseConverter;
