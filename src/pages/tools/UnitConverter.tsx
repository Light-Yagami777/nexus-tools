
import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/ToolLayout';
import { motion } from 'framer-motion';
import {
  Ruler,
  Scale,
  Thermometer,
  Gauge,
  Droplets,
  Square,
  Database,
  Compass,
  Gauge as PressureIcon,
  Calculator,
} from 'lucide-react';

const UnitConverter = () => {
  const converters = [
    {
      title: 'Length Converter',
      description: 'Convert between meters, feet, inches, and more',
      icon: <Ruler className="w-10 h-10 text-primary" />,
      href: '/tools/length-converter',
    },
    {
      title: 'Weight Converter',
      description: 'Convert between kg, pounds, ounces, and more',
      icon: <Scale className="w-10 h-10 text-primary" />,
      href: '/tools/weight-converter',
    },
    {
      title: 'Temperature Converter',
      description: 'Convert between Celsius, Fahrenheit, and Kelvin',
      icon: <Thermometer className="w-10 h-10 text-primary" />,
      href: '/tools/temperature-converter',
    },
    {
      title: 'Speed Converter',
      description: 'Convert between mph, km/h, m/s, and more',
      icon: <Gauge className="w-10 h-10 text-primary" />,
      href: '/tools/speed-converter',
    },
    {
      title: 'Volume Converter',
      description: 'Convert between liters, gallons, cups, and more',
      icon: <Droplets className="w-10 h-10 text-primary" />,
      href: '/tools/volume-converter',
    },
    {
      title: 'Area Converter',
      description: 'Convert between square meters, acres, and more',
      icon: <Square className="w-10 h-10 text-primary" />,
      href: '/tools/area-converter',
    },
    {
      title: 'Data Storage Converter',
      description: 'Convert between bytes, kilobytes, megabytes, and more',
      icon: <Database className="w-10 h-10 text-primary" />,
      href: '/tools/data-storage-converter',
    },
    {
      title: 'Angle Converter',
      description: 'Convert between degrees, radians, and more',
      icon: <Compass className="w-10 h-10 text-primary" />,
      href: '/tools/angle-converter',
    },
    {
      title: 'Pressure Converter',
      description: 'Convert between Pascal, bar, psi, and more',
      icon: <PressureIcon className="w-10 h-10 text-primary" />,
      href: '/tools/pressure-converter',
    },
  ];

  return (
    <ToolLayout 
      title="Unit Converter" 
      description="Collection of tools to convert between different units of measurement"
      icon={<Calculator className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {converters.map((converter, index) => (
          <motion.div
            key={converter.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={converter.href}>
              <Card className="h-full p-6 hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="mb-4">{converter.icon}</div>
                <h2 className="text-xl font-semibold mb-2">{converter.title}</h2>
                <p className="text-muted-foreground">{converter.description}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </ToolLayout>
  );
};

export default UnitConverter;
