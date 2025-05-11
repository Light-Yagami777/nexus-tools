
import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { CalendarCheck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
}

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  
  // Set default end date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    setEndDate(formattedDate);
  }, []);
  
  const calculateAge = () => {
    if (!birthDate) {
      toast.error('Please enter a birth date');
      return;
    }
    
    const birthDateTime = new Date(birthDate);
    const endDateTime = endDate ? new Date(endDate) : new Date();
    
    // Check if dates are valid
    if (isNaN(birthDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      toast.error('Please enter valid dates');
      return;
    }
    
    // Check if birth date is in the future or if end date is before birth date
    if (birthDateTime > endDateTime) {
      toast.error('Birth date must be before the end date');
      return;
    }
    
    let years = endDateTime.getFullYear() - birthDateTime.getFullYear();
    let months = endDateTime.getMonth() - birthDateTime.getMonth();
    let days = endDateTime.getDate() - birthDateTime.getDate();
    
    // Adjust days and months if needed
    if (days < 0) {
      months--;
      // Get the last day of the previous month
      const lastMonth = new Date(endDateTime.getFullYear(), endDateTime.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Calculate additional data
    const totalDays = Math.floor((endDateTime.getTime() - birthDateTime.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    
    setAgeResult({
      years,
      months,
      days,
      totalDays,
      totalMonths,
      totalWeeks,
      totalHours,
      totalMinutes
    });
  };

  return (
    <ToolLayout 
      title="Age Calculator" 
      description="Calculate the exact age between two dates"
      icon={<CalendarCheck className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Age Calculator</h1>
            <p className="text-muted-foreground">
              Calculate the exact age between two dates
            </p>
          </div>

          <Card className="p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="birthDate" className="block mb-2">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endDate" className="block mb-2">End Date (Default: Today)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={calculateAge} 
                className="w-full"
                disabled={!birthDate}
              >
                Calculate Age
              </Button>
            </div>

            {ageResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-6 border-t"
              >
                <h3 className="text-lg font-medium mb-4 text-center">Age Result</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">{ageResult.years}</div>
                    <div className="text-sm text-muted-foreground">Years</div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">{ageResult.months}</div>
                    <div className="text-sm text-muted-foreground">Months</div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">{ageResult.days}</div>
                    <div className="text-sm text-muted-foreground">Days</div>
                  </div>
                </div>
                
                <h4 className="text-md font-medium mb-3">Or expressed as:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between pb-2 border-b">
                    <span>Total months:</span>
                    <span className="font-medium">{ageResult.totalMonths.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b">
                    <span>Total weeks:</span>
                    <span className="font-medium">{ageResult.totalWeeks.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b">
                    <span>Total days:</span>
                    <span className="font-medium">{ageResult.totalDays.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b">
                    <span>Total hours:</span>
                    <span className="font-medium">{ageResult.totalHours.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total minutes:</span>
                    <span className="font-medium">{ageResult.totalMinutes.toLocaleString()}</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </Card>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">What can the Age Calculator do?</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <p>
                  The Age Calculator can determine the precise age between any two dates. It's commonly used to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Calculate someone's exact age in years, months, and days</li>
                  <li>Determine an exact period between two historical dates</li>
                  <li>Find out how long you've been at a job or in a relationship</li>
                  <li>Calculate the age of a child in months and days (useful for medical purposes)</li>
                  <li>Track the time since or until important events</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Note: For the most accurate results, this calculator accounts for leap years and varying month lengths.
                </p>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default AgeCalculator;
