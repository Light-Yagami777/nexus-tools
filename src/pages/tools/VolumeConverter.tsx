import React from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FlaskConical } from 'lucide-react';

type VolumeUnit = 'liter' | 'milliliter' | 'cubic-meter' | 'cubic-centimeter' | 'gallon' | 'quart' | 'pint' | 'cup' | 'fluid-ounce' | 'tablespoon' | 'teaspoon';

const VolumeConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<VolumeUnit>('liter');
  const [toUnit, setToUnit] = useState<VolumeUnit>('gallon');
  const [result, setResult] = useState<string>('');

  const conversionFactors: Record<VolumeUnit, number> = {
    'liter': 1,
    'milliliter': 0.001,
    'cubic-meter': 1000,
    'cubic-centimeter': 0.001,
    'gallon': 3.78541,
    'quart': 0.946353,
    'pint': 0.473176,
    'cup': 0.236588,
    'fluid-ounce': 0.0295735,
    'tablespoon': 0.0147868,
    'teaspoon': 0.00492892
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
      maximumFractionDigits: 6,
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
    { value: 'cubic-meter', label: 'Cubic Meter (m³)' },
    { value: 'cubic-centimeter', label: 'Cubic Centimeter (cm³)' },
    { value: 'gallon', label: 'Gallon (gal)' },
    { value: 'quart', label: 'Quart (qt)' },
    { value: 'pint', label: 'Pint (pt)' },
    { value: 'cup', label: 'Cup (c)' },
    { value: 'fluid-ounce', label: 'Fluid Ounce (fl oz)' },
    { value: 'tablespoon', label: 'Tablespoon (tbsp)' },
    { value: 'teaspoon', label: 'Teaspoon (tsp)' }
  ];

  const unitLabels: Record<VolumeUnit, string> = {
    'liter': 'L',
    'milliliter': 'mL',
    'cubic-meter': 'm³',
    'cubic-centimeter': 'cm³',
    'gallon': 'gal',
    'quart': 'qt',
    'pint': 'pt',
    'cup': 'c',
    'fluid-ounce': 'fl oz',
    'tablespoon': 'tbsp',
    'teaspoon': 'tsp'
  };

  return (
    <ToolLayout 
      title="Volume Converter" 
      description="Convert between different units of volume"
      icon={<FlaskConical className="h-6 w-6" />}
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
              Convert between different units of volume and capacity
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
            <h2 className="text-xl font-semibold mb-4">Volume Conversion Reference</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Metric Units</h3>
                  <ul className="space-y-2">
                    <li>1 cubic meter (m³) = 1,000 liters</li>
                    <li>1 liter (L) = 1,000 milliliters</li>
                    <li>1 milliliter (mL) = 1 cubic centimeter (cm³)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">US Customary Units</h3>
                  <ul className="space-y-2">
                    <li>1 gallon (gal) = 4 quarts</li>
                    <li>1 quart (qt) = 2 pints</li>
                    <li>1 pint (pt) = 2 cups</li>
                    <li>1 cup (c) = 8 fluid ounces</li>
                    <li>1 fluid ounce (fl oz) = 2 tablespoons</li>
                    <li>1 tablespoon (tbsp) = 3 teaspoons</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Cross-System Conversions</h3>
                <ul className="space-y-2">
                  <li>1 liter ≈ 0.264 gallons</li>
                  <li>1 gallon ≈ 3.785 liters</li>
                  <li>1 milliliter ≈ 0.034 fluid ounces</li>
                  <li>1 fluid ounce ≈ 29.574 milliliters</li>
                </ul>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default VolumeConverter;
