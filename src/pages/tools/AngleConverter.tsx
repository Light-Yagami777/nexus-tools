
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowDown, RotateCcw } from 'lucide-react';

type AngleUnit = 'degree' | 'radian' | 'gradian' | 'minute' | 'second' | 'mil' | 'revolution';

const AngleConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<AngleUnit>('degree');
  const [toUnit, setToUnit] = useState<AngleUnit>('radian');
  const [result, setResult] = useState<string>('');

  // Conversion factors to degrees
  const conversionFactors: Record<AngleUnit, number> = {
    'degree': 1,
    'radian': 57.2958,
    'gradian': 0.9,
    'minute': 1/60,
    'second': 1/3600,
    'mil': 0.05625,
    'revolution': 360
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
    
    // Convert to base unit (degrees)
    const inDegrees = input * conversionFactors[fromUnit];
    
    // Convert from base unit to target unit
    const converted = inDegrees / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 10,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: AngleUnit; label: string }[] = [
    { value: 'degree', label: 'Degree (°)' },
    { value: 'radian', label: 'Radian (rad)' },
    { value: 'gradian', label: 'Gradian (grad)' },
    { value: 'minute', label: 'Minute (′)' },
    { value: 'second', label: 'Second (″)' },
    { value: 'mil', label: 'Mil (mil)' },
    { value: 'revolution', label: 'Revolution (rev)' }
  ];

  const unitSymbols: Record<AngleUnit, string> = {
    'degree': '°',
    'radian': 'rad',
    'gradian': 'grad',
    'minute': '′',
    'second': '″',
    'mil': 'mil',
    'revolution': 'rev'
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
            <h1 className="text-3xl font-bold mb-2">Angle Converter</h1>
            <p className="text-muted-foreground">
              Convert between different angle measurement units
            </p>
          </div>

          <Card className="p-6 max-w-lg mx-auto">
            <div className="space-y-6">
              <div>
                <Label htmlFor="inputValue">Angle</Label>
                <Input
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter angle"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fromUnit">From</Label>
                <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as AngleUnit)}>
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
                <Select value={toUnit} onValueChange={(value) => setToUnit(value as AngleUnit)}>
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
            <h2 className="text-xl font-semibold mb-4">Angle Conversion Reference</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Common Angle Conversions</h3>
                  <ul className="space-y-2">
                    <li>1 degree (°) = π/180 radians</li>
                    <li>1 radian (rad) = 180/π degrees ≈ 57.2958°</li>
                    <li>1 gradian (grad) = 0.9 degrees</li>
                    <li>1 degree (°) = 60 minutes (′)</li>
                    <li>1 minute (′) = 60 seconds (″)</li>
                    <li>1 revolution (rev) = 360 degrees</li>
                    <li>1 mil (NATO) = 1/6400 revolution</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Common Angle Values</h3>
                  <ul className="space-y-2">
                    <li>Right angle: 90° = π/2 rad = 100 grad</li>
                    <li>Straight angle: 180° = π rad = 200 grad</li>
                    <li>Full circle: 360° = 2π rad = 400 grad = 1 rev</li>
                    <li>45°: π/4 rad = 50 grad</li>
                    <li>30°: π/6 rad = 33.33 grad</li>
                    <li>60°: π/3 rad = 66.67 grad</li>
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

export default AngleConverter;
