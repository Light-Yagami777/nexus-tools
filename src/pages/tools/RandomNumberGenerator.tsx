
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Dice1 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { motion } from 'framer-motion';

const RandomNumberGenerator = () => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [includeDecimal, setIncludeDecimal] = useState<boolean>(false);
  const [decimalPlaces, setDecimalPlaces] = useState<number>(2);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const generateNumbers = () => {
    setError('');

    // Validate inputs
    if (min > max) {
      setError('Minimum value must be less than or equal to maximum value');
      return;
    }

    if (count < 1) {
      setError('Count must be at least 1');
      return;
    }

    if (!allowDuplicates && (max - min + 1) < count) {
      setError('Not enough numbers in range to generate unique values. Increase range or decrease count.');
      return;
    }

    const numbers: string[] = [];
    const usedNumbers = new Set<number>();
    
    for (let i = 0; i < count; i++) {
      let num: number;
      
      if (includeDecimal) {
        // Generate decimal number
        num = min + Math.random() * (max - min);
        // Round to specified decimal places
        num = Number(num.toFixed(decimalPlaces));
      } else {
        // Generate integer
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
      if (!allowDuplicates) {
        // If we've already used this number and duplicates aren't allowed, try again
        if (usedNumbers.has(num)) {
          i--; // Retry this iteration
          continue;
        }
        usedNumbers.add(num);
      }
      
      numbers.push(num.toString());
    }
    
    setResult(numbers);
  };

  const copyResults = () => {
    if (result.length === 0) return;
    
    navigator.clipboard.writeText(result.join(', '))
      .then(() => {
        // Show success message
        console.log('Copied to clipboard');
      })
      .catch(err => {
        // Show error message
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <ToolLayout
      title="Random Number Generator"
      description="Generate random numbers with custom ranges and options"
      icon={<Dice1 className="h-6 w-6" />}
      extraPadding={true}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Random Number Generator</CardTitle>
            <CardDescription>
              Generate random numbers with custom parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min">Minimum Value</Label>
                <Input 
                  id="min" 
                  type="number" 
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max">Maximum Value</Label>
                <Input 
                  id="max" 
                  type="number" 
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="count">Number of Results</Label>
              <Input 
                id="count" 
                type="number" 
                value={count}
                min="1"
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-duplicates" className="cursor-pointer">Allow Duplicates</Label>
              <Switch 
                id="allow-duplicates" 
                checked={allowDuplicates}
                onCheckedChange={setAllowDuplicates}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="include-decimal" className="cursor-pointer">Include Decimals</Label>
              <Switch 
                id="include-decimal" 
                checked={includeDecimal}
                onCheckedChange={setIncludeDecimal}
              />
            </div>
            
            {includeDecimal && (
              <div>
                <Label htmlFor="decimal-places">Decimal Places</Label>
                <Input 
                  id="decimal-places" 
                  type="number" 
                  value={decimalPlaces}
                  min="0"
                  max="10"
                  onChange={(e) => setDecimalPlaces(Number(e.target.value))}
                />
              </div>
            )}
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={generateNumbers}>Generate Numbers</Button>
              <Button variant="outline" onClick={() => setResult([])}>Clear Results</Button>
            </div>
          </CardContent>
        </Card>
        
        {result.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md mb-4">
                <p className="font-mono break-all">{result.join(', ')}</p>
              </div>
              <Button onClick={copyResults} variant="secondary">Copy Results</Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </ToolLayout>
  );
};

export default RandomNumberGenerator;
