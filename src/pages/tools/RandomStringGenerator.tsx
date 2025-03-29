
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shuffle, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RandomStringGenerator: React.FC = () => {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedString, setGeneratedString] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateRandomString = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+[]{}|;:,.<>?';

    if (charset === '') {
      toast({
        title: "No character set selected",
        description: "Please select at least one character set",
        variant: "destructive",
      });
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setGeneratedString(result);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!generatedString) return;
    
    navigator.clipboard.writeText(generatedString);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The random string has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout title="Random String Generator" extraPadding={true} icon={<Shuffle size={24} />}>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shuffle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Random String Generator</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Generate random strings with customizable length, character sets, and patterns.
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="length">Length: {length} characters</Label>
            <Slider 
              id="length"
              value={[length]} 
              min={4} 
              max={64} 
              step={1} 
              onValueChange={(value) => setLength(value[0])} 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="uppercase" 
                checked={includeUppercase} 
                onCheckedChange={(checked) => setIncludeUppercase(!!checked)} 
              />
              <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lowercase" 
                checked={includeLowercase} 
                onCheckedChange={(checked) => setIncludeLowercase(!!checked)} 
              />
              <Label htmlFor="lowercase">Lowercase (a-z)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="numbers" 
                checked={includeNumbers} 
                onCheckedChange={(checked) => setIncludeNumbers(!!checked)} 
              />
              <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="symbols" 
                checked={includeSymbols} 
                onCheckedChange={(checked) => setIncludeSymbols(!!checked)} 
              />
              <Label htmlFor="symbols">Symbols (!@#$%...)</Label>
            </div>
          </div>
          
          <Button onClick={generateRandomString} className="w-full">
            <Shuffle className="h-4 w-4 mr-2" />
            Generate Random String
          </Button>
          
          {generatedString && (
            <div className="mt-4">
              <Label htmlFor="result">Generated String:</Label>
              <div className="flex mt-1">
                <Input 
                  id="result"
                  value={generatedString} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard} 
                  className="ml-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default RandomStringGenerator;
