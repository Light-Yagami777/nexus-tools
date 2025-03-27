
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  nextBirthday: {
    months: number;
    days: number;
    date: string;
  };
}

const AgeCalculator = () => {
  const today = new Date();
  const formattedToday = formatDate(today);
  
  const [birthDate, setBirthDate] = useState<string>("");
  const [calculationDate, setCalculationDate] = useState<string>(formattedToday);
  const [includeTime, setIncludeTime] = useState<boolean>(false);
  const [birthTime, setBirthTime] = useState<string>("00:00");
  const [calculationTime, setCalculationTime] = useState<string>(formatTime(today));
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [dateFormat, setDateFormat] = useState<"MM/DD/YYYY" | "DD/MM/YYYY">("MM/DD/YYYY");

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const formatDisplayDate = (dateString: string, format: "MM/DD/YYYY" | "DD/MM/YYYY"): string => {
    const [year, month, day] = dateString.split('-');
    return format === "MM/DD/YYYY" ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
  };

  const calculateAge = () => {
    if (!birthDate) {
      toast.error("Please enter a birth date");
      return;
    }

    try {
      const birthDateObj = new Date(birthDate);
      if (includeTime) {
        const [birthHours, birthMinutes] = birthTime.split(':').map(Number);
        birthDateObj.setHours(birthHours, birthMinutes, 0, 0);
      } else {
        birthDateObj.setHours(0, 0, 0, 0);
      }

      const calcDateObj = new Date(calculationDate);
      if (includeTime) {
        const [calcHours, calcMinutes] = calculationTime.split(':').map(Number);
        calcDateObj.setHours(calcHours, calcMinutes, 0, 0);
      } else {
        calcDateObj.setHours(23, 59, 59, 999);
      }

      if (birthDateObj > calcDateObj) {
        toast.error("Birth date cannot be in the future");
        return;
      }

      // Calculate years, months, days
      let years = calcDateObj.getFullYear() - birthDateObj.getFullYear();
      let months = calcDateObj.getMonth() - birthDateObj.getMonth();
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      let days = calcDateObj.getDate() - birthDateObj.getDate();
      
      if (days < 0) {
        months--;
        // Get the number of days in the previous month
        const prevMonth = new Date(calcDateObj.getFullYear(), calcDateObj.getMonth(), 0);
        days += prevMonth.getDate();
        
        if (months < 0) {
          years--;
          months += 12;
        }
      }

      // Total values
      const diffTime = Math.abs(calcDateObj.getTime() - birthDateObj.getTime());
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalMonths = years * 12 + months;
      const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

      // Calculate next birthday
      const nextBirthdayYear = calcDateObj.getMonth() > birthDateObj.getMonth() || 
        (calcDateObj.getMonth() === birthDateObj.getMonth() && calcDateObj.getDate() >= birthDateObj.getDate()) 
        ? calcDateObj.getFullYear() + 1 
        : calcDateObj.getFullYear();
      
      const nextBirthdayDate = new Date(nextBirthdayYear, birthDateObj.getMonth(), birthDateObj.getDate());
      
      const timeToBirthday = Math.abs(nextBirthdayDate.getTime() - calcDateObj.getTime());
      const daysToBirthday = Math.ceil(timeToBirthday / (1000 * 60 * 60 * 24));
      
      let monthsToBirthday = 0;
      let remainingDays = daysToBirthday;
      
      // Convert days to months and days
      const currentDate = new Date(calcDateObj);
      while (remainingDays > 0) {
        const currentMonth = currentDate.getMonth();
        currentDate.setMonth(currentMonth + 1);
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        
        if (remainingDays >= daysInMonth) {
          monthsToBirthday++;
          remainingDays -= daysInMonth;
        } else {
          break;
        }
      }

      const nextBirthdayFormatted = nextBirthdayDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      setAgeResult({
        years,
        months,
        days,
        totalMonths,
        totalWeeks,
        totalDays,
        totalHours,
        nextBirthday: {
          months: monthsToBirthday,
          days: remainingDays,
          date: nextBirthdayFormatted
        }
      });
    } catch (error) {
      toast.error("Error calculating age. Please check your inputs.");
      console.error(error);
    }
  };

  return (
    <ToolLayout title="Age Calculator">
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Calculate Your Age</h2>
              <p className="text-muted-foreground mb-4">
                Enter your birth date and time to calculate your exact age and find out when your next birthday is.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="date-format">Date Format</Label>
                <RadioGroup 
                  id="date-format" 
                  value={dateFormat}
                  onValueChange={(value) => setDateFormat(value as "MM/DD/YYYY" | "DD/MM/YYYY")}
                  className="flex mt-2 space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MM/DD/YYYY" id="MM/DD/YYYY" />
                    <Label htmlFor="MM/DD/YYYY">MM/DD/YYYY</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DD/MM/YYYY" id="DD/MM/YYYY" />
                    <Label htmlFor="DD/MM/YYYY">DD/MM/YYYY</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="birth-date">Date of Birth</Label>
                <Input
                  id="birth-date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={calculationDate}
                  placeholder="MM/DD/YYYY"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include-time"
                    checked={includeTime}
                    onChange={(e) => setIncludeTime(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="include-time">Include time for precise calculation</Label>
                </div>
              </div>
              
              {includeTime && (
                <div>
                  <Label htmlFor="birth-time">Time of Birth</Label>
                  <Input
                    id="birth-time"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="calculation-date">Calculate Age At</Label>
                <Input
                  id="calculation-date"
                  type="date"
                  value={calculationDate}
                  onChange={(e) => setCalculationDate(e.target.value)}
                  placeholder="MM/DD/YYYY"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Default is today's date.
                </p>
              </div>
              
              {includeTime && (
                <div>
                  <Label htmlFor="calculation-time">Time</Label>
                  <Input
                    id="calculation-time"
                    type="time"
                    value={calculationTime}
                    onChange={(e) => setCalculationTime(e.target.value)}
                  />
                </div>
              )}
              
              <Button onClick={calculateAge} className="w-full">Calculate Age</Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {ageResult ? (
              <div className="space-y-6">
                <div className="rounded-lg p-6 border bg-muted/50 text-center">
                  <h3 className="text-lg font-medium mb-2">Your Age</h3>
                  <div className="text-4xl font-bold mb-2">
                    {ageResult.years} <span className="text-lg font-normal">years</span>
                  </div>
                  <div className="text-xl font-medium">
                    {ageResult.months} <span className="text-sm">months</span> {ageResult.days} <span className="text-sm">days</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg p-4 border">
                    <h4 className="text-sm font-medium mb-1">Next Birthday</h4>
                    <div className="text-xl font-bold">
                      {ageResult.nextBirthday.months}m {ageResult.nextBirthday.days}d
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {ageResult.nextBirthday.date}
                    </div>
                  </div>
                  <div className="rounded-lg p-4 border">
                    <h4 className="text-sm font-medium mb-1">Total Months</h4>
                    <div className="text-xl font-bold">
                      {ageResult.totalMonths}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Age in Different Units</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg border flex flex-col">
                      <span className="text-sm text-muted-foreground">Weeks</span>
                      <span className="text-lg font-medium">{ageResult.totalWeeks.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-lg border flex flex-col">
                      <span className="text-sm text-muted-foreground">Days</span>
                      <span className="text-lg font-medium">{ageResult.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-lg border flex flex-col">
                      <span className="text-sm text-muted-foreground">Hours</span>
                      <span className="text-lg font-medium">{ageResult.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-lg border flex flex-col">
                      <span className="text-sm text-muted-foreground">Minutes</span>
                      <span className="text-lg font-medium">{(ageResult.totalHours * 60).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-2">
                  <h3 className="text-sm font-medium">At a Glance</h3>
                  <p className="text-sm">
                    Born on: <span className="font-medium">{formatDisplayDate(birthDate, dateFormat)}</span>
                    {includeTime && <span> at {birthTime}</span>}
                  </p>
                  <p className="text-sm">
                    Age as of: <span className="font-medium">{formatDisplayDate(calculationDate, dateFormat)}</span>
                    {includeTime && <span> at {calculationTime}</span>}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Age Results</h3>
                <p className="text-muted-foreground">
                  Enter your birth date and calculate to see your exact age and next birthday.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Did You Know?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Age Milestones</h4>
              <p className="text-sm text-muted-foreground">
                Different cultures celebrate different age milestones. In Japan, the 60th birthday (Kanreki) is especially important as it represents a complete cycle of the Chinese zodiac.
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Leap Year Birthdays</h4>
              <p className="text-sm text-muted-foreground">
                People born on February 29 (leap day) usually celebrate their birthdays on either February 28 or March 1 in non-leap years. They're called "leaplings" or "leap-year babies."
              </p>
            </div>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default AgeCalculator;
