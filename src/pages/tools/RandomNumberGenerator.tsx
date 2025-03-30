
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Dice, RefreshCw, Copy, HistoryIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const RandomNumberGenerator = () => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [sortResults, setSortResults] = useState<boolean>(false);
  const [formatType, setFormatType] = useState<string>("comma");
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<{ numbers: number[], timestamp: string }[]>([]);

  const generateRandomNumbers = () => {
    if (min > max) {
      toast.error('Minimum value must be less than or equal to maximum value');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    // Check if we can generate enough unique numbers in the range
    const range = max - min + 1;
    if (!allowDuplicates && quantity > range) {
      toast.error(`Cannot generate ${quantity} unique numbers in the range ${min} to ${max}`);
      return;
    }

    let numbers: number[] = [];

    if (allowDuplicates) {
      // Generate random numbers with duplicates allowed
      for (let i = 0; i < quantity; i++) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(randomNumber);
      }
    } else {
      // Generate unique random numbers
      const availableNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      
      // Fisher-Yates shuffle algorithm
      for (let i = availableNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
      }
      
      numbers = availableNumbers.slice(0, quantity);
    }

    // Sort numbers if needed
    if (sortResults) {
      numbers.sort((a, b) => a - b);
    }

    setRandomNumbers(numbers);
    
    // Add to history
    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => [{ numbers: [...numbers], timestamp }, ...prev].slice(0, 5));
    
    toast.success(`Generated ${quantity} random number${quantity > 1 ? 's' : ''}`);
  };

  const copyToClipboard = (numbers: number[]) => {
    let textToCopy = '';
    
    if (formatType === 'comma') {
      textToCopy = numbers.join(', ');
    } else if (formatType === 'line') {
      textToCopy = numbers.join('\n');
    } else if (formatType === 'space') {
      textToCopy = numbers.join(' ');
    } else if (formatType === 'array') {
      textToCopy = `[${numbers.join(', ')}]`;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success('Numbers copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const formatNumbersForDisplay = (numbers: number[]): string => {
    if (formatType === 'comma') {
      return numbers.join(', ');
    } else if (formatType === 'line') {
      return numbers.join('\n');
    } else if (formatType === 'space') {
      return numbers.join(' ');
    } else if (formatType === 'array') {
      return `[${numbers.join(', ')}]`;
    }
    return numbers.join(', ');
  };

  const validateNumericInput = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      setter(parsedValue);
    }
  };

  return (
    <ToolLayout 
      title="Random Number Generator" 
      description="Generate random numbers within a specified range"
      icon={<Dice className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Random Number Generator</CardTitle>
          <CardDescription>Configure your random number generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-value">Minimum Value</Label>
                <Input
                  id="min-value"
                  type="number"
                  value={min}
                  onChange={(e) => validateNumericInput(e.target.value, setMin)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="max-value">Maximum Value</Label>
                <Input
                  id="max-value"
                  type="number"
                  value={max}
                  onChange={(e) => validateNumericInput(e.target.value, setMax)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => validateNumericInput(e.target.value, setQuantity)}
                className="mt-1"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-duplicates">Allow Duplicates</Label>
                <Switch
                  id="allow-duplicates"
                  checked={allowDuplicates}
                  onCheckedChange={setAllowDuplicates}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sort-results">Sort Results</Label>
                <Switch
                  id="sort-results"
                  checked={sortResults}
                  onCheckedChange={setSortResults}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Output Format</Label>
              <RadioGroup 
                value={formatType} 
                onValueChange={setFormatType}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comma" id="format-comma" />
                  <Label htmlFor="format-comma">Comma-separated</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="space" id="format-space" />
                  <Label htmlFor="format-space">Space-separated</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="line" id="format-line" />
                  <Label htmlFor="format-line">Line-separated</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="array" id="format-array" />
                  <Label htmlFor="format-array">Array syntax</Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={generateRandomNumbers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Random Numbers
            </Button>
          </div>
        </CardContent>
      </Card>

      {randomNumbers.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Generated Numbers</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(randomNumbers)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md">
              <pre className="whitespace-pre-wrap break-words font-mono text-sm">
                {formatNumbersForDisplay(randomNumbers)}
              </pre>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Generated {randomNumbers.length} number{randomNumbers.length > 1 ? 's' : ''} 
              between {min} and {max}
              {!allowDuplicates && ' (no duplicates)'}
              {sortResults && ' (sorted)'}
            </div>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HistoryIcon className="h-5 w-5 mr-2" />
              History
            </CardTitle>
            <CardDescription>Recent number generations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="border p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(item.numbers)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-mono truncate">
                    {item.numbers.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </ToolLayout>
  );
};

export default RandomNumberGenerator;
