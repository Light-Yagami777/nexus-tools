
import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Database, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type StorageUnit = 'bit' | 'byte' | 'kilobit' | 'kilobyte' | 'megabit' | 'megabyte' | 'gigabit' | 'gigabyte' | 'terabit' | 'terabyte' | 'petabit' | 'petabyte';

const DataStorageConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<StorageUnit>('gigabyte');
  const [toUnit, setToUnit] = useState<StorageUnit>('megabyte');
  const [result, setResult] = useState<string>('');

  // Conversion factors to bits
  const conversionFactors: Record<StorageUnit, number> = {
    'bit': 1,
    'byte': 8,
    'kilobit': 1000,
    'kilobyte': 8 * 1000,
    'megabit': 1000 * 1000,
    'megabyte': 8 * 1000 * 1000,
    'gigabit': 1000 * 1000 * 1000,
    'gigabyte': 8 * 1000 * 1000 * 1000,
    'terabit': 1000 * 1000 * 1000 * 1000,
    'terabyte': 8 * 1000 * 1000 * 1000 * 1000,
    'petabit': 1000 * 1000 * 1000 * 1000 * 1000,
    'petabyte': 8 * 1000 * 1000 * 1000 * 1000 * 1000
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
    
    const inBits = input * conversionFactors[fromUnit];
    
    const converted = inBits / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 8,
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
    { value: 'kilobit', label: 'Kilobit (Kb)' },
    { value: 'kilobyte', label: 'Kilobyte (KB)' },
    { value: 'megabit', label: 'Megabit (Mb)' },
    { value: 'megabyte', label: 'Megabyte (MB)' },
    { value: 'gigabit', label: 'Gigabit (Gb)' },
    { value: 'gigabyte', label: 'Gigabyte (GB)' },
    { value: 'terabit', label: 'Terabit (Tb)' },
    { value: 'terabyte', label: 'Terabyte (TB)' },
    { value: 'petabit', label: 'Petabit (Pb)' },
    { value: 'petabyte', label: 'Petabyte (PB)' }
  ];

  const unitLabels: Record<StorageUnit, string> = {
    'bit': 'b',
    'byte': 'B',
    'kilobit': 'Kb',
    'kilobyte': 'KB',
    'megabit': 'Mb',
    'megabyte': 'MB',
    'gigabit': 'Gb',
    'gigabyte': 'GB',
    'terabit': 'Tb',
    'terabyte': 'TB',
    'petabit': 'Pb',
    'petabyte': 'PB'
  };

  return (
    <ToolLayout 
      title="Data Storage Converter" 
      description="Convert between different units of digital storage"
      icon={<Database className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Data Storage Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units of digital storage
            </p>
          </div>

          <Card className="p-6 max-w-lg mx-auto">
            <div className="space-y-6">
              <div>
                <Label htmlFor="inputValue">Data Size</Label>
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
                    {result ? `${result} ${unitLabels[toUnit]}` : '-'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Data Storage Units Explained</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Decimal Units (SI)</h3>
                  <ul className="space-y-2">
                    <li>1 Kilobyte (KB) = 1,000 bytes</li>
                    <li>1 Megabyte (MB) = 1,000 KB = 1,000,000 bytes</li>
                    <li>1 Gigabyte (GB) = 1,000 MB = 1,000,000,000 bytes</li>
                    <li>1 Terabyte (TB) = 1,000 GB = 1,000,000,000,000 bytes</li>
                    <li>1 Petabyte (PB) = 1,000 TB = 1,000,000,000,000,000 bytes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Binary Units</h3>
                  <ul className="space-y-2">
                    <li>1 Kibibyte (KiB) = 1,024 bytes</li>
                    <li>1 Mebibyte (MiB) = 1,024 KiB = 1,048,576 bytes</li>
                    <li>1 Gibibyte (GiB) = 1,024 MiB = 1,073,741,824 bytes</li>
                    <li>1 Tebibyte (TiB) = 1,024 GiB = 1,099,511,627,776 bytes</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Important Conversions</h3>
                <ul className="space-y-2">
                  <li>8 bits = 1 byte</li>
                  <li>1 Kilobyte = 8 Kilobits</li>
                  <li>1 Megabyte = 8 Megabits</li>
                  <li>1 Gigabyte = 8 Gigabits</li>
                </ul>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default DataStorageConverter;
