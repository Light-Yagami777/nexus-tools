import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Flask, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type VolumeUnit = 'liter' | 'milliliter' | 'cubicMeter' | 'cubicCentimeter' | 'cubicInch' | 'cubicFoot' | 'gallon' | 'pint' | 'quart' | 'fluidOunce';

const VolumeConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<VolumeUnit>('liter');
  const [toUnit, setToUnit] = useState<VolumeUnit>('gallon');
  const [result, setResult] = useState<string>('');

  const conversionFactors: Record<VolumeUnit, number> = {
    'liter': 1,
    'milliliter': 0.001,
    'cubicMeter': 1000,
    'cubicCentimeter': 0.000001,
    'cubicInch': 0.0000163871,
    'cubicFoot': 28.3168,
    'gallon': 3.78541,
    'pint': 0.473176,
    'quart': 0.946353,
    'fluidOunce': 0.0295735
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
    
    const inLiters = input * conversionFactors[fromUnit];
    
    const converted = inLiters / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 8,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: VolumeUnit; label: string }[] = [
    { value: 'liter', label: 'Liter (L)' },
    { value: 'milliliter', label: 'Milliliter (mL)' },
    { value: 'cubicMeter', label: 'Cubic Meter (m³)' },
    { value: 'cubicCentimeter', label: 'Cubic Centimeter (cm³)' },
    { value: 'cubicInch', label: 'Cubic Inch (in³)' },
    { value: 'cubicFoot', label: 'Cubic Foot (ft³)' },
    { value: 'gallon', label: 'Gallon (gal)' },
    { value: 'pint', label: 'Pint (pt)' },
    { value: 'quart', label: 'Quart (qt)' },
    { value: 'fluidOunce', label: 'Fluid Ounce (fl oz)' }
  ];

  const unitLabels: Record<VolumeUnit, string> = {
    'liter': 'L',
    'milliliter': 'mL',
    'cubicMeter': 'm³',
    'cubicCentimeter': 'cm³',
    'cubicInch': 'in³',
    'cubicFoot': 'ft³',
    'gallon': 'gal',
    'pint': 'pt',
    'quart': 'qt',
    'fluidOunce': 'fl oz'
  };

  return (
    <ToolLayout 
      title="Volume Converter" 
      description="Convert between different units of volume"
      icon={<Flask className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Volume Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units of volume
            </p>
          </div>

          <Card className="p-6 max-w-lg mx-auto">
            <div className="space-y-6">
              <div>
                <Label htmlFor="inputValue">Volume</Label>
                <Input
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter volume"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fromUnit">From</Label>
                <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as VolumeUnit)}>
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
                <Select value={toUnit} onValueChange={(value) => setToUnit(value as VolumeUnit)}>
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
            <h2 className="text-xl font-semibold mb-4">Volume Conversion Examples</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Common Volume Units</h3>
                  <ul className="space-y-2">
                    <li>1 liter (L) = 1000 milliliters (mL)</li>
                    <li>1 cubic meter (m³) = 1000 liters</li>
                    <li>1 gallon (gal) = 3.785 liters</li>
                    <li>1 pint (pt) = 0.473 liters</li>
                    <li>1 quart (qt) = 0.946 liters</li>
                    <li>1 fluid ounce (fl oz) = 0.0295 liters</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Everyday Volume Comparisons</h3>
                  <ul className="space-y-2">
                    <li>A soda can is approximately 355 mL</li>
                    <li>A standard water bottle is 0.5 to 1 liter</li>
                    <li>A bathtub holds about 80 gallons</li>
                    <li>A hot tub can hold 500+ gallons</li>
                    <li>An Olympic swimming pool holds 2.5 million liters</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default VolumeConverter;
