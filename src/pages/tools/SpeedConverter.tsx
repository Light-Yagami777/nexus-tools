
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowDown, Gauge } from 'lucide-react';

type SpeedUnit = 'mps' | 'kph' | 'mph' | 'knot' | 'ftps';

const SpeedConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<SpeedUnit>('kph');
  const [toUnit, setToUnit] = useState<SpeedUnit>('mph');
  const [result, setResult] = useState<string>('');

  // Conversion factors to meters per second
  const conversionFactors: Record<SpeedUnit, number> = {
    'mps': 1,
    'kph': 0.277778,
    'mph': 0.44704,
    'knot': 0.514444,
    'ftps': 0.3048
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
    
    // Convert to base unit (meters per second)
    const inMps = input * conversionFactors[fromUnit];
    
    // Convert from base unit to target unit
    const converted = inMps / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 4,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: SpeedUnit; label: string }[] = [
    { value: 'mps', label: 'Meters per second (m/s)' },
    { value: 'kph', label: 'Kilometers per hour (km/h)' },
    { value: 'mph', label: 'Miles per hour (mph)' },
    { value: 'knot', label: 'Knots (kn)' },
    { value: 'ftps', label: 'Feet per second (ft/s)' }
  ];

  const unitLabels: Record<SpeedUnit, string> = {
    'mps': 'm/s',
    'kph': 'km/h',
    'mph': 'mph',
    'knot': 'kn',
    'ftps': 'ft/s'
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
            <h1 className="text-3xl font-bold mb-2">Speed Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units of speed
            </p>
          </div>

          <Card className="p-6 max-w-lg mx-auto">
            <div className="space-y-6">
              <div>
                <Label htmlFor="inputValue">Speed</Label>
                <Input
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter speed"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fromUnit">From</Label>
                <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as SpeedUnit)}>
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
                <Select value={toUnit} onValueChange={(value) => setToUnit(value as SpeedUnit)}>
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
            <h2 className="text-xl font-semibold mb-4">Speed Conversion Examples</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Speed Comparisons</h3>
                  <ul className="space-y-2">
                    <li>Walking: ~5 km/h (3.1 mph)</li>
                    <li>Running: ~12 km/h (7.5 mph)</li>
                    <li>Cycling: ~20 km/h (12.4 mph)</li>
                    <li>Car highway: ~100 km/h (62.1 mph)</li>
                    <li>Commercial aircraft: ~900 km/h (559 mph)</li>
                    <li>Speed of sound: 343 m/s (1,235 km/h)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Conversion Formulas</h3>
                  <ul className="space-y-2">
                    <li>1 m/s = 3.6 km/h</li>
                    <li>1 m/s = 2.237 mph</li>
                    <li>1 km/h = 0.621 mph</li>
                    <li>1 mph = 1.609 km/h</li>
                    <li>1 knot = 1.852 km/h</li>
                    <li>1 knot = 1.151 mph</li>
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

export default SpeedConverter;
