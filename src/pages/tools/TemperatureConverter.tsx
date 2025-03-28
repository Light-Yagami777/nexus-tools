
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowDown, Thermometer } from 'lucide-react';

type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

const TemperatureConverter = () => {
  const [inputValue, setInputValue] = useState<string>('0');
  const [fromUnit, setFromUnit] = useState<TemperatureUnit>('celsius');
  const [toUnit, setToUnit] = useState<TemperatureUnit>('fahrenheit');
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit]);

  const convert = () => {
    const input = parseFloat(inputValue);
    
    if (isNaN(input)) {
      setResult('');
      return;
    }
    
    let converted: number;
    
    // Convert to Celsius first (as base unit)
    let inCelsius: number;
    if (fromUnit === 'celsius') {
      inCelsius = input;
    } else if (fromUnit === 'fahrenheit') {
      inCelsius = (input - 32) * 5/9;
    } else { // kelvin
      inCelsius = input - 273.15;
    }
    
    // Convert from Celsius to target unit
    if (toUnit === 'celsius') {
      converted = inCelsius;
    } else if (toUnit === 'fahrenheit') {
      converted = (inCelsius * 9/5) + 32;
    } else { // kelvin
      converted = inCelsius + 273.15;
    }
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: TemperatureUnit; label: string; symbol: string }[] = [
    { value: 'celsius', label: 'Celsius', symbol: '°C' },
    { value: 'fahrenheit', label: 'Fahrenheit', symbol: '°F' },
    { value: 'kelvin', label: 'Kelvin', symbol: 'K' }
  ];

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
            <h1 className="text-3xl font-bold mb-2">Temperature Converter</h1>
            <p className="text-muted-foreground">
              Convert between Celsius, Fahrenheit, and Kelvin
            </p>
          </div>

          <Card className="p-6 max-w-lg mx-auto">
            <div className="space-y-6">
              <div>
                <Label htmlFor="inputValue">Temperature</Label>
                <Input
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter temperature"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fromUnit">From</Label>
                <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as TemperatureUnit)}>
                  <SelectTrigger id="fromUnit" className="mt-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} ({option.symbol})
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
                <Select value={toUnit} onValueChange={(value) => setToUnit(value as TemperatureUnit)}>
                  <SelectTrigger id="toUnit" className="mt-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} ({option.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Result</div>
                  <div className="text-2xl font-bold">
                    {result ? `${result} ${unitOptions.find(u => u.value === toUnit)?.symbol}` : '-'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Temperature Conversion Formulas</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Celsius to Fahrenheit</h3>
                  <p className="font-mono">°F = (°C × 9/5) + 32</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Fahrenheit to Celsius</h3>
                  <p className="font-mono">°C = (°F - 32) × 5/9</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Celsius to Kelvin</h3>
                  <p className="font-mono">K = °C + 273.15</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Kelvin to Celsius</h3>
                  <p className="font-mono">°C = K - 273.15</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Fahrenheit to Kelvin</h3>
                  <p className="font-mono">K = (°F - 32) × 5/9 + 273.15</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Kelvin to Fahrenheit</h3>
                  <p className="font-mono">°F = (K - 273.15) × 9/5 + 32</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Common Temperature Reference Points</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Celsius (°C)</h3>
                  <ul className="space-y-2">
                    <li>Water Freezing: 0°C</li>
                    <li>Room Temperature: ~20-22°C</li>
                    <li>Body Temperature: 37°C</li>
                    <li>Water Boiling: 100°C</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Fahrenheit (°F)</h3>
                  <ul className="space-y-2">
                    <li>Water Freezing: 32°F</li>
                    <li>Room Temperature: ~68-72°F</li>
                    <li>Body Temperature: 98.6°F</li>
                    <li>Water Boiling: 212°F</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Kelvin (K)</h3>
                  <ul className="space-y-2">
                    <li>Absolute Zero: 0 K</li>
                    <li>Water Freezing: 273.15 K</li>
                    <li>Room Temperature: ~293-295 K</li>
                    <li>Water Boiling: 373.15 K</li>
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

export default TemperatureConverter;
