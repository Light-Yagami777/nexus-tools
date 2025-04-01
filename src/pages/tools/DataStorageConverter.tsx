
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowDown, Database } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';

type StorageUnit = 'bit' | 'byte' | 'kibibyte' | 'mebibyte' | 'gibibyte' | 'tebibyte' | 'pebibyte';

const DataStorageConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<StorageUnit>('gibibyte');
  const [toUnit, setToUnit] = useState<StorageUnit>('mebibyte');
  const [result, setResult] = useState<string>('');

  // Binary conversion factors (powers of 1024)
  const conversionFactors: Record<StorageUnit, number> = {
    'bit': 0.125,
    'byte': 1,
    'kibibyte': 1024, // 2^10
    'mebibyte': 1048576, // 2^20 (1024^2)
    'gibibyte': 1073741824, // 2^30 (1024^3)
    'tebibyte': 1099511627776, // 2^40 (1024^4)
    'pebibyte': 1125899906842624 // 2^50 (1024^5)
  };

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit]);

  const convert = () => {
    const input = parseFloat(inputValue);
    
    if (isNaN(input)) {
      setResult('');
      return;
    }
    
    // Convert to base unit (bytes)
    const inBytes = input * conversionFactors[fromUnit];
    
    // Convert from base unit to target unit
    const converted = inBytes / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 10,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: StorageUnit; label: string }[] = [
    { value: 'bit', label: 'Bit (b)' },
    { value: 'byte', label: 'Byte (B)' },
    { value: 'kibibyte', label: 'Kibibyte (KiB)' },
    { value: 'mebibyte', label: 'Mebibyte (MiB)' },
    { value: 'gibibyte', label: 'Gibibyte (GiB)' },
    { value: 'tebibyte', label: 'Tebibyte (TiB)' },
    { value: 'pebibyte', label: 'Pebibyte (PiB)' }
  ];

  const unitAbbreviations: Record<StorageUnit, string> = {
    'bit': 'b',
    'byte': 'B',
    'kibibyte': 'KiB',
    'mebibyte': 'MiB',
    'gibibyte': 'GiB',
    'tebibyte': 'TiB',
    'pebibyte': 'PiB'
  };

  return (
    <ToolLayout 
      title="Data Storage Converter" 
      description="Convert between different digital storage units"
      icon={<Database className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card className="p-6 max-w-lg mx-auto">
        <div className="space-y-6">
          <div>
            <Label htmlFor="inputValue">Value</Label>
            <Input
              id="inputValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fromUnit">From</Label>
            <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as StorageUnit)}>
              <SelectTrigger id="fromUnit" className="mt-1">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleSwapUnits}
              className="rounded-full p-2 bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <ArrowDown className="h-4 w-4 text-primary" />
            </button>
          </div>

          <div>
            <Label htmlFor="toUnit">To</Label>
            <Select value={toUnit} onValueChange={(value) => setToUnit(value as StorageUnit)}>
              <SelectTrigger id="toUnit" className="mt-1">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Result</div>
              <div className="text-2xl font-bold">
                {result ? `${result} ${unitAbbreviations[toUnit]}` : '-'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Binary Storage Units Guide</h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Binary Units (Used by Operating Systems)</h3>
              <ul className="space-y-2">
                <li>8 Bits = 1 Byte</li>
                <li>1 Kibibyte (KiB) = 1,024 Bytes</li>
                <li>1 Mebibyte (MiB) = 1,024 KiB</li>
                <li>1 Gibibyte (GiB) = 1,024 MiB</li>
                <li>1 Tebibyte (TiB) = 1,024 GiB</li>
                <li>1 Pebibyte (PiB) = 1,024 TiB</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Common Conversions</h3>
              <ul className="space-y-2">
                <li>1 KiB = 1,024 Bytes</li>
                <li>1 MiB = 1,048,576 Bytes</li>
                <li>1 GiB = 1,073,741,824 Bytes</li>
                <li>1 TiB = 1,099,511,627,776 Bytes</li>
                <li>1 PiB = 1,125,899,906,842,624 Bytes</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Important Notes</h3>
            <ul className="space-y-2">
              <li>Operating systems like Windows, macOS, and Linux use binary units (1 KiB = 1,024 bytes)</li>
              <li>This is why a "1 TB" hard drive shows as ~931 GiB in your OS</li>
              <li>This converter uses binary units (powers of 1024) as used by operating systems</li>
            </ul>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default DataStorageConverter;
