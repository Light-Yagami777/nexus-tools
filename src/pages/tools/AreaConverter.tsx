
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowDown, Maximize2 } from 'lucide-react';

type AreaUnit = 'square-meter' | 'square-kilometer' | 'square-centimeter' | 'square-millimeter' | 'square-mile' | 'square-yard' | 'square-foot' | 'square-inch' | 'hectare' | 'acre';

const AreaConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<AreaUnit>('square-meter');
  const [toUnit, setToUnit] = useState<AreaUnit>('acre');
  const [result, setResult] = useState<string>('');

  // Conversion factors to square meters
  const conversionFactors: Record<AreaUnit, number> = {
    'square-meter': 1,
    'square-kilometer': 1000000,
    'square-centimeter': 0.0001,
    'square-millimeter': 0.000001,
    'square-mile': 2589988.11,
    'square-yard': 0.836127,
    'square-foot': 0.092903,
    'square-inch': 0.00064516,
    'hectare': 10000,
    'acre': 4046.86
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
    
    // Convert to base unit (square meters)
    const inSquareMeters = input * conversionFactors[fromUnit];
    
    // Convert from base unit to target unit
    const converted = inSquareMeters / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 8,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: AreaUnit; label: string }[] = [
    { value: 'square-meter', label: 'Square Meter (m²)' },
    { value: 'square-kilometer', label: 'Square Kilometer (km²)' },
    { value: 'square-centimeter', label: 'Square Centimeter (cm²)' },
    { value: 'square-millimeter', label: 'Square Millimeter (mm²)' },
    { value: 'square-mile', label: 'Square Mile (mi²)' },
    { value: 'square-yard', label: 'Square Yard (yd²)' },
    { value: 'square-foot', label: 'Square Foot (ft²)' },
    { value: 'square-inch', label: 'Square Inch (in²)' },
    { value: 'hectare', label: 'Hectare (ha)' },
    { value: 'acre', label: 'Acre (ac)' }
  ];

  const unitLabels: Record<AreaUnit, string> = {
    'square-meter': 'm²',
    'square-kilometer': 'km²',
    'square-centimeter': 'cm²',
    'square-millimeter': 'mm²',
    'square-mile': 'mi²',
    'square-yard': 'yd²',
    'square-foot': 'ft²',
    'square-inch': 'in²',
    'hectare': 'ha',
    'acre': 'ac'
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
            <h1 className="text-3xl font-bold mb-2">Area Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units of area
            </p>
          </div>

          <Card className="p-6 max-w-lg mx-auto">
            <div className="space-y-6">
              <div>
                <Label htmlFor="inputValue">Area</Label>
                <Input
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter area"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fromUnit">From</Label>
                <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as AreaUnit)}>
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
                <Select value={toUnit} onValueChange={(value) => setToUnit(value as AreaUnit)}>
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
            <h2 className="text-xl font-semibold mb-4">Area Conversion Reference</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Metric Units</h3>
                  <ul className="space-y-2">
                    <li>1 square kilometer (km²) = 1,000,000 square meters</li>
                    <li>1 hectare (ha) = 10,000 square meters</li>
                    <li>1 square meter (m²) = 10,000 square centimeters</li>
                    <li>1 square centimeter (cm²) = 100 square millimeters</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Imperial/US Units</h3>
                  <ul className="space-y-2">
                    <li>1 square mile (mi²) = 640 acres</li>
                    <li>1 acre (ac) = 4,840 square yards</li>
                    <li>1 square yard (yd²) = 9 square feet</li>
                    <li>1 square foot (ft²) = 144 square inches</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Cross-System Conversions</h3>
                <ul className="space-y-2">
                  <li>1 square meter ≈ 10.764 square feet</li>
                  <li>1 square foot ≈ 0.093 square meters</li>
                  <li>1 acre ≈ 0.405 hectares</li>
                  <li>1 hectare ≈ 2.471 acres</li>
                  <li>1 square mile ≈ 2.59 square kilometers</li>
                  <li>1 square kilometer ≈ 0.386 square miles</li>
                </ul>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AreaConverter;
