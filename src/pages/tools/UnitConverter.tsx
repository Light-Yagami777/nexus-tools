
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolLayout from "@/components/ToolLayout";
import { ArrowRight, Ruler } from "lucide-react";
import { toast } from "sonner";

// Common unit types that will be used across all converter tools
type ConverterType = 
  | "length" 
  | "weight" 
  | "temperature" 
  | "speed" 
  | "volume" 
  | "area" 
  | "dataStorage" 
  | "pressure" 
  | "angle";

interface UnitOption {
  value: string;
  label: string;
  conversionFactor?: number;
}

interface ConverterConfig {
  type: ConverterType;
  title: string;
  description: string;
  baseUnit: string;
  units: UnitOption[];
  icon: React.ReactNode;
  specialConversion?: boolean;
}

const UnitConverter = () => {
  const [activeType, setActiveType] = useState<ConverterType>("length");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [result, setResult] = useState<string>("");

  // Length converter configuration
  const lengthConfig: ConverterConfig = {
    type: "length",
    title: "Length Converter",
    description: "Convert between different units of length such as meters, feet, inches, and more.",
    baseUnit: "m",
    icon: <Ruler />,
    units: [
      { value: "km", label: "Kilometers", conversionFactor: 0.001 },
      { value: "m", label: "Meters", conversionFactor: 1 },
      { value: "cm", label: "Centimeters", conversionFactor: 100 },
      { value: "mm", label: "Millimeters", conversionFactor: 1000 },
      { value: "mi", label: "Miles", conversionFactor: 0.000621371 },
      { value: "yd", label: "Yards", conversionFactor: 1.09361 },
      { value: "ft", label: "Feet", conversionFactor: 3.28084 },
      { value: "in", label: "Inches", conversionFactor: 39.3701 },
    ]
  };

  // Weight converter configuration
  const weightConfig: ConverterConfig = {
    type: "weight",
    title: "Weight Converter",
    description: "Convert between different units of weight including kilograms, pounds, ounces, and more.",
    baseUnit: "kg",
    icon: <Ruler />,
    units: [
      { value: "kg", label: "Kilograms", conversionFactor: 1 },
      { value: "g", label: "Grams", conversionFactor: 1000 },
      { value: "mg", label: "Milligrams", conversionFactor: 1000000 },
      { value: "lb", label: "Pounds", conversionFactor: 2.20462 },
      { value: "oz", label: "Ounces", conversionFactor: 35.274 },
      { value: "ton", label: "Metric Tons", conversionFactor: 0.001 },
      { value: "st", label: "Stone", conversionFactor: 0.157473 },
    ]
  };

  // Temperature converter configuration (special case)
  const temperatureConfig: ConverterConfig = {
    type: "temperature",
    title: "Temperature Converter",
    description: "Convert between Celsius, Fahrenheit, Kelvin, and other temperature units.",
    baseUnit: "c",
    icon: <Ruler />,
    specialConversion: true,
    units: [
      { value: "c", label: "Celsius" },
      { value: "f", label: "Fahrenheit" },
      { value: "k", label: "Kelvin" },
    ]
  };

  // Speed converter configuration
  const speedConfig: ConverterConfig = {
    type: "speed",
    title: "Speed Converter",
    description: "Convert between different units of speed such as mph, km/h, m/s, and knots.",
    baseUnit: "mps",
    icon: <Ruler />,
    units: [
      { value: "mps", label: "Meters per second", conversionFactor: 1 },
      { value: "kph", label: "Kilometers per hour", conversionFactor: 3.6 },
      { value: "mph", label: "Miles per hour", conversionFactor: 2.23694 },
      { value: "fps", label: "Feet per second", conversionFactor: 3.28084 },
      { value: "knot", label: "Knots", conversionFactor: 1.94384 },
    ]
  };

  // Volume converter configuration
  const volumeConfig: ConverterConfig = {
    type: "volume",
    title: "Volume Converter",
    description: "Convert between different units of volume like liters, gallons, cubic meters, and more.",
    baseUnit: "l",
    icon: <Ruler />,
    units: [
      { value: "l", label: "Liters", conversionFactor: 1 },
      { value: "ml", label: "Milliliters", conversionFactor: 1000 },
      { value: "m3", label: "Cubic meters", conversionFactor: 0.001 },
      { value: "gal", label: "Gallons (US)", conversionFactor: 0.264172 },
      { value: "qt", label: "Quarts (US)", conversionFactor: 1.05669 },
      { value: "pt", label: "Pints (US)", conversionFactor: 2.11338 },
      { value: "cup", label: "Cups", conversionFactor: 4.22675 },
      { value: "oz", label: "Fluid Ounces (US)", conversionFactor: 33.814 },
      { value: "tbsp", label: "Tablespoons", conversionFactor: 67.628 },
      { value: "tsp", label: "Teaspoons", conversionFactor: 202.884 },
    ]
  };

  // Area converter configuration
  const areaConfig: ConverterConfig = {
    type: "area",
    title: "Area Converter",
    description: "Convert between different units of area including square meters, acres, hectares, and more.",
    baseUnit: "m2",
    icon: <Ruler />,
    units: [
      { value: "m2", label: "Square meters", conversionFactor: 1 },
      { value: "km2", label: "Square kilometers", conversionFactor: 0.000001 },
      { value: "cm2", label: "Square centimeters", conversionFactor: 10000 },
      { value: "mm2", label: "Square millimeters", conversionFactor: 1000000 },
      { value: "ha", label: "Hectares", conversionFactor: 0.0001 },
      { value: "acre", label: "Acres", conversionFactor: 0.000247105 },
      { value: "ft2", label: "Square feet", conversionFactor: 10.7639 },
      { value: "in2", label: "Square inches", conversionFactor: 1550 },
      { value: "yd2", label: "Square yards", conversionFactor: 1.19599 },
      { value: "mi2", label: "Square miles", conversionFactor: 3.861e-7 },
    ]
  };

  // Data storage converter configuration
  const dataStorageConfig: ConverterConfig = {
    type: "dataStorage",
    title: "Data Storage Converter",
    description: "Convert between different digital storage units from bits to petabytes.",
    baseUnit: "byte",
    icon: <Ruler />,
    units: [
      { value: "bit", label: "Bits", conversionFactor: 8 },
      { value: "byte", label: "Bytes", conversionFactor: 1 },
      { value: "kb", label: "Kilobytes", conversionFactor: 0.001 },
      { value: "mb", label: "Megabytes", conversionFactor: 0.000001 },
      { value: "gb", label: "Gigabytes", conversionFactor: 1e-9 },
      { value: "tb", label: "Terabytes", conversionFactor: 1e-12 },
      { value: "pb", label: "Petabytes", conversionFactor: 1e-15 },
      { value: "kib", label: "Kibibytes", conversionFactor: 0.0009765625 },
      { value: "mib", label: "Mebibytes", conversionFactor: 9.5367e-7 },
      { value: "gib", label: "Gibibytes", conversionFactor: 9.3132e-10 },
      { value: "tib", label: "Tebibytes", conversionFactor: 9.0949e-13 },
    ]
  };

  // Pressure converter configuration
  const pressureConfig: ConverterConfig = {
    type: "pressure",
    title: "Pressure Converter",
    description: "Convert between different pressure units like pascals, bars, psi, and more.",
    baseUnit: "pa",
    icon: <Ruler />,
    units: [
      { value: "pa", label: "Pascals", conversionFactor: 1 },
      { value: "kpa", label: "Kilopascals", conversionFactor: 0.001 },
      { value: "mpa", label: "Megapascals", conversionFactor: 0.000001 },
      { value: "bar", label: "Bars", conversionFactor: 0.00001 },
      { value: "psi", label: "PSI", conversionFactor: 0.000145038 },
      { value: "atm", label: "Atmospheres", conversionFactor: 9.86923e-6 },
      { value: "torr", label: "Torr", conversionFactor: 0.00750062 },
      { value: "mmhg", label: "mm of Mercury", conversionFactor: 0.00750062 },
    ]
  };

  // Angle converter configuration
  const angleConfig: ConverterConfig = {
    type: "angle",
    title: "Angle Converter",
    description: "Convert between different angle units including degrees, radians, and gradians.",
    baseUnit: "deg",
    icon: <Ruler />,
    units: [
      { value: "deg", label: "Degrees", conversionFactor: 1 },
      { value: "rad", label: "Radians", conversionFactor: 0.0174533 },
      { value: "grad", label: "Gradians", conversionFactor: 1.11111 },
      { value: "arcmin", label: "Arc minutes", conversionFactor: 60 },
      { value: "arcsec", label: "Arc seconds", conversionFactor: 3600 },
      { value: "turn", label: "Turns", conversionFactor: 0.00277778 },
    ]
  };

  // Map of all converter configurations
  const converterConfigs: Record<ConverterType, ConverterConfig> = {
    length: lengthConfig,
    weight: weightConfig,
    temperature: temperatureConfig,
    speed: speedConfig,
    volume: volumeConfig,
    area: areaConfig,
    dataStorage: dataStorageConfig,
    pressure: pressureConfig,
    angle: angleConfig,
  };

  // Current active configuration
  const activeConfig = converterConfigs[activeType];

  // Set default units when converter type changes
  React.useEffect(() => {
    if (activeConfig && activeConfig.units.length > 0) {
      setFromUnit(activeConfig.units[0].value);
      setToUnit(activeConfig.units.length > 1 ? activeConfig.units[1].value : activeConfig.units[0].value);
      setInputValue("1");
      setResult("");
    }
  }, [activeType]);

  // Handle conversion
  const handleConvert = () => {
    if (!inputValue || !fromUnit || !toUnit) {
      toast.error("Please fill in all fields");
      return;
    }

    const input = parseFloat(inputValue);
    if (isNaN(input)) {
      toast.error("Please enter a valid number");
      return;
    }

    // Special case for temperature
    if (activeConfig.specialConversion && activeType === "temperature") {
      let resultValue: number;

      // Convert from source to target temperature unit
      if (fromUnit === "c" && toUnit === "f") {
        resultValue = (input * 9/5) + 32;
      } else if (fromUnit === "c" && toUnit === "k") {
        resultValue = input + 273.15;
      } else if (fromUnit === "f" && toUnit === "c") {
        resultValue = (input - 32) * 5/9;
      } else if (fromUnit === "f" && toUnit === "k") {
        resultValue = (input - 32) * 5/9 + 273.15;
      } else if (fromUnit === "k" && toUnit === "c") {
        resultValue = input - 273.15;
      } else if (fromUnit === "k" && toUnit === "f") {
        resultValue = (input - 273.15) * 9/5 + 32;
      } else {
        resultValue = input; // Same unit
      }

      setResult(resultValue.toFixed(4));
    } else {
      // Standard conversion using conversion factors
      const fromUnitObj = activeConfig.units.find(u => u.value === fromUnit);
      const toUnitObj = activeConfig.units.find(u => u.value === toUnit);

      if (!fromUnitObj || !toUnitObj || 
          fromUnitObj.conversionFactor === undefined || 
          toUnitObj.conversionFactor === undefined) {
        toast.error("Conversion not available");
        return;
      }

      // Convert to base unit then to target unit
      const valueInBaseUnit = input / fromUnitObj.conversionFactor;
      const resultValue = valueInBaseUnit * toUnitObj.conversionFactor;

      setResult(resultValue.toFixed(4));
    }

    toast.success("Conversion complete");
  };

  // Handle input swap
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setResult("");
  };

  return (
    <ToolLayout title={activeConfig.title} description={activeConfig.description} icon={activeConfig.icon}>
      <Card className="p-6">
        <Tabs 
          defaultValue="length" 
          value={activeType}
          onValueChange={(value) => setActiveType(value as ConverterType)} 
          className="w-full mb-6"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-1 mb-4">
            <TabsTrigger value="length">Length</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="speed">Speed</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
            <TabsTrigger value="dataStorage">Data Storage</TabsTrigger>
            <TabsTrigger value="pressure">Pressure</TabsTrigger>
            <TabsTrigger value="angle">Angle</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-5 items-end">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="input-value">Value</Label>
            <Input
              id="input-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from-unit">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger id="from-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {activeConfig.units.map((unit) => (
                  <SelectItem key={`from-${unit.value}`} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center items-end">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSwap}
              className="h-10 w-10"
              aria-label="Swap units"
            >
              <ArrowRight className="rotate-90 md:rotate-0" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-unit">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger id="to-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {activeConfig.units.map((unit) => (
                  <SelectItem key={`to-${unit.value}`} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Button onClick={handleConvert} className="w-full">Convert</Button>
          
          <Card className="p-4 flex items-center justify-between">
            <span className="text-muted-foreground">Result:</span>
            <span className="text-xl font-semibold">
              {result ? `${result} ${toUnit}` : "—"}
            </span>
          </Card>
        </div>

        <div className="mt-8 bg-muted p-4 rounded-lg text-sm">
          <h3 className="font-medium mb-2">About {activeConfig.title}</h3>
          <p className="text-muted-foreground">
            {activeConfig.description} This converter provides accurate 
            conversions between the most commonly used units.
          </p>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default UnitConverter;
