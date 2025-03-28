
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dice1 } from 'lucide-react';

const RandomNumberGenerator = () => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [unique, setUnique] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);

  const generateNumbers = () => {
    if (min > max) {
      toast.error('Minimum value must be less than maximum value');
      return;
    }

    if (unique && (max - min + 1) < count) {
      toast.error(`Cannot generate ${count} unique numbers in the range ${min} to ${max}`);
      return;
    }

    const result: number[] = [];
    const used = new Set<number>();

    for (let i = 0; i < count; i++) {
      let num: number;
      if (unique) {
        do {
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (used.has(num));
        used.add(num);
      } else {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      result.push(num);
    }

    setNumbers(result);
  };

  const copyToClipboard = () => {
    if (numbers.length === 0) return;
    
    navigator.clipboard.writeText(numbers.join(', '))
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  return (
    <ToolLayout 
      title="Random Number Generator" 
      description="Generate random numbers within a specified range with options for uniqueness and distribution"
      icon={<Dice1 size={24} />}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-value">Minimum Value</Label>
              <Input 
                id="min-value" 
                type="number" 
                value={min} 
                onChange={(e) => setMin(Number(e.target.value))} 
              />
            </div>
            <div>
              <Label htmlFor="max-value">Maximum Value</Label>
              <Input 
                id="max-value" 
                type="number" 
                value={max} 
                onChange={(e) => setMax(Number(e.target.value))} 
              />
            </div>
          </div>
          
          <div>
            <Label>Number of results: {count}</Label>
            <Slider 
              value={[count]} 
              min={1} 
              max={100} 
              step={1} 
              onValueChange={([value]) => setCount(value)} 
              className="my-2" 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="unique" 
              checked={unique} 
              onCheckedChange={setUnique} 
            />
            <Label htmlFor="unique">Generate unique numbers</Label>
          </div>
          
          <Button onClick={generateNumbers} className="w-full">Generate Random Numbers</Button>
          
          {numbers.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <Label>Generated Numbers</Label>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>Copy</Button>
              </div>
              <div className="p-4 bg-muted rounded-md overflow-auto max-h-40">
                <p className="font-mono">{numbers.join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default RandomNumberGenerator;
