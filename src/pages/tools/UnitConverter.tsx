
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { ArrowRight, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnitConverter = () => {
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
            <h1 className="text-3xl font-bold mb-2">Unit Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units of measurement with ease
            </p>
          </div>

          <Tabs defaultValue="length" className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 max-w-3xl mx-auto">
              <TabsTrigger value="length">Length</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              <TabsContent value="length">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Length Converter</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Link to="/tools/length-converter">
                      <Button variant="outline" className="w-full h-32 text-lg">
                        <Ruler className="h-6 w-6 mr-2" />
                        Go to Length Converter
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="weight">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Weight Converter</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Link to="/tools/weight-converter">
                      <Button variant="outline" className="w-full h-32 text-lg">
                        <Ruler className="h-6 w-6 mr-2" />
                        Go to Weight Converter
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="temperature">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature Converter</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Link to="/tools/temperature-converter">
                      <Button variant="outline" className="w-full h-32 text-lg">
                        <Ruler className="h-6 w-6 mr-2" />
                        Go to Temperature Converter
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="area">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Area Converter</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Link to="/tools/area-converter">
                      <Button variant="outline" className="w-full h-32 text-lg">
                        <Ruler className="h-6 w-6 mr-2" />
                        Go to Area Converter
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="volume">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Volume Converter</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Link to="/tools/volume-converter">
                      <Button variant="outline" className="w-full h-32 text-lg">
                        <Ruler className="h-6 w-6 mr-2" />
                        Go to Volume Converter
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">All Converters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link to="/tools/length-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Length Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/weight-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Weight Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/temperature-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Temperature Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/speed-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Speed Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/volume-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Volume Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/area-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Area Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/data-storage-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Data Storage Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/pressure-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Pressure Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/angle-converter">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Angle Converter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default UnitConverter;
