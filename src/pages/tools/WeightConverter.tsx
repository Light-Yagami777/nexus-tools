import React from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Scale } from 'lucide-react';

type WeightUnit = 'kilogram' | 'gram' | 'milligram' | 'metric-ton' | 'pound' | 'ounce' | 'stone' | 'us-ton';

const WeightConverter = () => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<WeightUnit>('kilogram');
  const [toUnit, setToUnit] = useState<WeightUnit>('pound');
  const [result, setResult] = useState<string>('');

  const conversionFactors: Record<WeightUnit, number> = {
    'kilogram': 1,
    'gram': 0.001,
    'milligram': 0.000001,
    'metric-ton': 1000,
    'pound': 0.45359237,
    'ounce': 0.0283495,
    'stone': 6.35029,
    'us-ton': 907.185
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
    
    const inKilograms = input * conversionFactors[fromUnit];
    
    const converted = inKilograms / conversionFactors[toUnit];
    
    setResult(converted.toLocaleString('en-US', {
      maximumFractionDigits: 10,
      useGrouping: true
    }));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions: { value: WeightUnit; label: string }[] = [
    { value: 'kilogram', label: 'Kilogram (kg)' },
    { value: 'gram', label: 'Gram (g)' },
    { value: 'milligram', label: 'Milligram (mg)' },
    { value: 'metric-ton', label: 'Metric Ton (t)' },
    { value: 'pound', label: 'Pound (lb)' },
    { value: 'ounce', label: 'Ounce (oz)' },
    { value: 'stone', label: 'Stone (st)' },
    { value: 'us-ton', label: 'US Ton' }
  ];

  return (
    <ToolLayout 
      title="Weight Converter" 
      description="Convert between different units of weight"
      icon={<Scale className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Weight Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units of weight and mass
            </p>
          </div>

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
                <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as WeightUnit)}>
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
                <Select value={toUnit} onValueChange={(value) => setToUnit(value as WeightUnit)}>
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
                    {result ? `${result} ${unitOptions.find(u => u.value === toUnit)?.label.split(' ')[0]}` : '-'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Weight Units</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Metric Units</h3>
                  <ul className="space-y-2">
                    <li>1 metric ton (t) = 1,000 kilograms</li>
                    <li>1 kilogram (kg) = 1,000 grams</li>
                    <li>1 gram (g) = 1,000 milligrams</li>
                    <li>1 milligram (mg) = 0.001 grams</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Imperial Units</h3>
                  <ul className="space-y-2">
                    <li>1 US ton = 2,000 pounds</li>
                    <li>1 stone (st) = 14 pounds</li>
                    <li>1 pound (lb) = 16 ounces</li>
                    <li>1 ounce (oz) = 28.35 grams</li>
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

export default WeightConverter;
