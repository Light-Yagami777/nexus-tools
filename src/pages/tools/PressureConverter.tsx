
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowDown, Gauge } from 'lucide-react';

type PressureUnit = 'pascal' | 'kilopascal' | 'megapascal' | 'bar' | 'psi' | 'ksi' | 'atmosphere' | 'torr' | 'mmHg' | 'inHg';

const PressureConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<PressureUnit>('bar');
  const [toUnit, setToUnit] = useState<PressureUnit>('psi');
  const [result, setResult] = useState<string>('');

  // Conversion factors to pascals
  const conversionFactors: Record<PressureUnit, number> = {
    'pascal': 1,
    'kilopascal': 1000,
    'megapascal': 1000000,
    'bar': 100000,
    'psi': 6894.76,
    'ksi': 6894760,
    'atmosphere': 101325,
    'torr': 133.322,
    'mmHg': 133.322,
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
    
    // Convert to base unit (pascals)
    const inPascals = input * conversionFactors[fromUnit];
    
    // Convert from base unit to target unit
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
    { value: 'bar', label: 'Bar (bar)' },
    { value: 'psi', label: 'Pounds per Square Inch (psi)' },
    { value: 'ksi', label: 'Kilopounds per Square Inch (ksi)' },
    { value: 'atmosphere', label: 'Standard Atmosphere (atm)' },
    { value: 'torr', label: 'Torr (Torr)' },
    { value: 'mmHg', label: 'Millimeters of Mercury (mmHg)' },
    { value: 'inHg', label: 'Inches of Mercury (inHg)' }
  ];

  const unitSymbols: Record<PressureUnit, string> = {
    'pascal': 'Pa',
    'kilopascal': 'kPa',
    'megapascal': 'MPa',
    'bar': 'bar',
    'psi': 'psi',
    'ksi': 'ksi',
    'atmosphere': 'atm',
    'torr': 'Torr',
    'mmHg': 'mmHg',
    'inHg': 'inHg'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Pressure Converter</h1>
            <p className="text-muted-foreground">
              Convert between different pressure units
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
                    {result ? `${result} ${unitSymbols[toUnit]}` : '-'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Pressure Conversion Reference</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Common Pressure Conversions</h3>
                  <ul className="space-y-2">
                    <li>1 bar = 100,000 Pa</li>
                    <li>1 bar = 14.5038 psi</li>
                    <li>1 atmosphere = 101,325 Pa</li>
                    <li>1 atmosphere = 1.01325 bar</li>
                    <li>1 atmosphere = 14.6959 psi</li>
                    <li>1 atmosphere = 760 mmHg (Torr)</li>
                    <li>1 psi = 6,894.76 Pa</li>
                    <li>1 psi = 0.068948 bar</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Practical Examples</h3>
                  <ul className="space-y-2">
                    <li>Standard atmospheric pressure: 1 atm (101,325 Pa)</li>
                    <li>Car tire pressure: ~30-35 psi (2.1-2.4 bar)</li>
                    <li>Bicycle tire pressure: ~80-130 psi (5.5-9.0 bar)</li>
                    <li>Blood pressure (normal): ~120/80 mmHg</li>
                    <li>Deep ocean (10,000m): ~1,000 bar</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default PressureConverter;
