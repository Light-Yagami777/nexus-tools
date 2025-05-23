
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, Ruler } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';

type LengthUnit = 'meter' | 'kilometer' | 'centimeter' | 'millimeter' | 'mile' | 'yard' | 'foot' | 'inch';

const LengthConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<LengthUnit>('meter');
  const [toUnit, setToUnit] = useState<LengthUnit>('kilometer');
  const [result, setResult] = useState<string>('');

  const conversionFactors: Record<LengthUnit, number> = {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254
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
    
    const inMeters = input * conversionFactors[fromUnit];
    
    const converted = inMeters / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 10,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: LengthUnit; label: string }[] = [
    { value: 'meter', label: 'Meter (m)' },
    { value: 'kilometer', label: 'Kilometer (km)' },
    { value: 'centimeter', label: 'Centimeter (cm)' },
    { value: 'millimeter', label: 'Millimeter (mm)' },
    { value: 'mile', label: 'Mile (mi)' },
    { value: 'yard', label: 'Yard (yd)' },
    { value: 'foot', label: 'Foot (ft)' },
    { value: 'inch', label: 'Inch (in)' }
  ];

  return (
    <ToolLayout 
      title="Length Converter" 
      description="Convert between different units of length quickly and accurately"
      icon={<Ruler className="h-6 w-6" />}
      extraPadding={false}
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
              placeholder="Enter a value"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fromUnit">From</Label>
            <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as LengthUnit)}>
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
            <Select value={toUnit} onValueChange={(value) => setToUnit(value as LengthUnit)}>
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
                {result ? `${result} ${toUnit}` : '-'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Length Units</h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Metric Units</h3>
              <ul className="space-y-2">
                <li>1 kilometer (km) = 1,000 meters</li>
                <li>1 meter (m) = 100 centimeters</li>
                <li>1 centimeter (cm) = 10 millimeters</li>
                <li>1 millimeter (mm) = 0.001 meters</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Imperial Units</h3>
              <ul className="space-y-2">
                <li>1 mile (mi) = 1,760 yards</li>
                <li>1 yard (yd) = 3 feet</li>
                <li>1 foot (ft) = 12 inches</li>
                <li>1 inch (in) = 2.54 centimeters</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default LengthConverter;
