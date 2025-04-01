
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Dices, Copy, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const RandomNumberGenerator = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (min >= max) {
      toast.error('Minimum value must be less than maximum value');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    if (!allowDuplicates && (max - min + 1) < quantity) {
      toast.error(`Cannot generate ${quantity} unique numbers in the range ${min} to ${max}`);
      return;
    }

    setIsGenerating(true);

    try {
      let generatedNumbers: number[] = [];

      if (allowDuplicates) {
        // With duplicates, just generate random numbers
        for (let i = 0; i < quantity; i++) {
          const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
          generatedNumbers.push(randomNum);
        }
      } else {
        // Without duplicates, use a pool of available numbers
        const availableNumbers = Array.from(
          { length: max - min + 1 },
          (_, i) => min + i
        );
        
        // Fisher-Yates shuffle
        for (let i = availableNumbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
        }
        
        generatedNumbers = availableNumbers.slice(0, quantity);
      }

      setResults(generatedNumbers);
      toast.success(`Generated ${quantity} random number${quantity > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error generating random numbers:', error);
      toast.error('Failed to generate random numbers');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (results.length === 0) {
      toast.error('No numbers to copy');
      return;
    }

    navigator.clipboard.writeText(results.join(', '))
      .then(() => toast.success('Numbers copied to clipboard'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  return (
    <ToolLayout 
      title="Random Number Generator" 
      description="Generate random numbers within a specified range"
      icon={<Dices className="h-6 w-6" />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Random Number Generator</CardTitle>
          <CardDescription>
            Generate random numbers within a custom range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">Minimum Value</Label>
              <Input
                id="min"
                type="number"
                value={min}
                onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Maximum Value</Label>
              <Input
                id="max"
                type="number"
                value={max}
                onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quantity: {quantity}</Label>
            <Slider
              value={[quantity]}
              min={1}
              max={100}
              step={1}
              onValueChange={(value) => setQuantity(value[0])}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allowDuplicates"
              checked={allowDuplicates}
              onCheckedChange={setAllowDuplicates}
            />
            <Label htmlFor="allowDuplicates">Allow Duplicates</Label>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || min >= max}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate</>
              )}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="mt-6 p-4 border rounded-md bg-secondary">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Results</h3>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="font-mono text-sm break-all leading-relaxed max-h-[200px] overflow-y-auto">
                  {results.join(', ')}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default RandomNumberGenerator;
