
import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Activity, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PressureUnit = 'pascal' | 'kilopascal' | 'megapascal' | 'bar' | 'millibar' | 'psi' | 'torr' | 'mmHg' | 'atm' | 'inHg';

const PressureConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<PressureUnit>('bar');
  const [toUnit, setToUnit] = useState<PressureUnit>('psi');
  const [result, setResult] = useState<string>('');

  // Conversion factors to pascals (Pa)
  const conversionFactors: Record<PressureUnit, number> = {
    'pascal': 1,
    'kilopascal': 1000,
    'megapascal': 1000000,
    'bar': 100000,
    'millibar': 100,
    'psi': 6894.76,
    'torr': 133.322,
    'mmHg': 133.322,
    'atm': 101325,
    'inHg': 3386.39
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
    
    const inPascals = input * conversionFactors[fromUnit];
    
    const converted = inPascals / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 6,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: PressureUnit; label: string }[] = [
    { value: 'pascal', label: 'Pascal (Pa)' },
    { value: 'kilopascal', label: 'Kilopascal (kPa)' },
    { value: 'megapascal', label: 'Megapascal (MPa)' },
    { value: 'bar', label: 'Bar' },
    { value: 'millibar', label: 'Millibar (mbar)' },
    { value: 'psi', label: 'Pounds per Square Inch (psi)' },
    { value: 'torr', label: 'Torr' },
    { value: 'mmHg', label: 'Millimeters of Mercury (mmHg)' },
    { value: 'atm', label: 'Standard Atmosphere (atm)' },
    { value: 'inHg', label: 'Inches of Mercury (inHg)' }
  ];

  const unitLabels: Record<PressureUnit, string> = {
    'pascal': 'Pa',
    'kilopascal': 'kPa',
    'megapascal': 'MPa',
    'bar': 'bar',
    'millibar': 'mbar',
    'psi': 'psi',
    'torr': 'Torr',
    'mmHg': 'mmHg',
    'atm': 'atm',
    'inHg': 'inHg'
  };

  return (
    <ToolLayout 
      title="Pressure Converter" 
      description="Convert between different units of pressure"
      icon={<Activity className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Pressure Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units of pressure
            </p>
          </div>

          <Card className="p-6 max-w-lg mx-auto">
            <div className="space-y-6">
              <div>
                <Label htmlFor="inputValue">Pressure</Label>
                <Input
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter pressure"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fromUnit">From</Label>
                <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as PressureUnit)}>
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
                <Select value={toUnit} onValueChange={(value) => setToUnit(value as PressureUnit)}>
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
            <h2 className="text-xl font-semibold mb-4">Pressure Units Explained</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Common Pressure Units</h3>
                  <ul className="space-y-2">
                    <li><strong>Pascal (Pa)</strong>: The SI unit of pressure, 1 Pa = 1 N/m²</li>
                    <li><strong>Bar</strong>: 1 bar = 100,000 Pa, close to 1 atmosphere</li>
                    <li><strong>PSI</strong>: Pounds per square inch, common in US and UK</li>
                    <li><strong>Atmosphere (atm)</strong>: Average sea-level pressure</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Other Units</h3>
                  <ul className="space-y-2">
                    <li><strong>Torr</strong>: Named after Torricelli, 1 Torr ≈ 133.32 Pa</li>
                    <li><strong>mmHg</strong>: Millimeters of mercury, used in medicine</li>
                    <li><strong>inHg</strong>: Inches of mercury, used in meteorology</li>
                    <li><strong>Millibar</strong>: Used in meteorology, 1 mbar = 100 Pa</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Common Conversions</h3>
                <ul className="space-y-2">
                  <li>1 bar ≈ 14.5038 psi</li>
                  <li>1 atmosphere ≈ 1.01325 bar ≈ 14.6959 psi</li>
                  <li>1 mmHg ≈ 0.00132 atm ≈ 0.0193 psi</li>
                  <li>1 psi ≈ 6,894.76 Pa ≈ 6.89 kPa</li>
                </ul>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default PressureConverter;
