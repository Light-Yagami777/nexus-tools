
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock } from "lucide-react";
import { toast } from "sonner";

interface TimeUnit {
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeCalculator = () => {
  // Time calculation
  const [time1, setTime1] = useState<string>("");
  const [time2, setTime2] = useState<string>("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [calculationResult, setCalculationResult] = useState<string>("");
  
  // Time converter
  const [convertTime, setConvertTime] = useState<string>("");
  const [convertFrom, setConvertFrom] = useState<string>("hours");
  const [convertTo, setConvertTo] = useState<string>("minutes");
  const [conversionResult, setConversionResult] = useState<string>("");
  
  // Time breakdown
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [seconds, setSeconds] = useState<string>("");
  const [breakdownResult, setBreakdownResult] = useState<string>("");

  const parseTimeString = (timeStr: string): TimeUnit => {
    // Format: HH:MM:SS or HH:MM
    const parts = timeStr.split(":");
    
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    
    if (parts.length >= 1) hours = parseInt(parts[0]) || 0;
    if (parts.length >= 2) minutes = parseInt(parts[1]) || 0;
    if (parts.length >= 3) seconds = parseInt(parts[2]) || 0;
    
    return { hours, minutes, seconds };
  };

  const formatTimeString = (time: TimeUnit): string => {
    // Normalize time (e.g., convert 90 minutes to 1 hour 30 minutes)
    let { hours, minutes, seconds } = time;
    
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds %= 60;
    }
    
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const timeToSeconds = (time: TimeUnit): number => {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
  };

  const secondsToTime = (totalSeconds: number): TimeUnit => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds };
  };

  const calculateTime = () => {
    if (!time1) {
      toast.error("Please enter the first time");
      return;
    }

    if (!time2) {
      toast.error("Please enter the second time");
      return;
    }

    try {
      const t1 = parseTimeString(time1);
      const t2 = parseTimeString(time2);
      
      const t1Seconds = timeToSeconds(t1);
      const t2Seconds = timeToSeconds(t2);
      
      let resultSeconds;
      
      if (operation === "add") {
        resultSeconds = t1Seconds + t2Seconds;
      } else {
        resultSeconds = t1Seconds - t2Seconds;
        
        // Handle negative time
        if (resultSeconds < 0) {
          resultSeconds = Math.abs(resultSeconds);
          toast.warning("Result is negative. Displaying absolute value.");
        }
      }
      
      const resultTime = secondsToTime(resultSeconds);
      setCalculationResult(formatTimeString(resultTime));
    } catch (error) {
      toast.error("Invalid time format. Please use HH:MM:SS or HH:MM.");
    }
  };

  const convertTimeUnit = () => {
    if (!convertTime) {
      toast.error("Please enter a time value");
      return;
    }

    try {
      const timeValue = parseFloat(convertTime);
      
      if (isNaN(timeValue) || timeValue < 0) {
        toast.error("Please enter a valid positive number");
        return;
      }
      
      let resultValue;
      
      // Convert to seconds first
      let valueInSeconds;
      switch (convertFrom) {
        case "seconds":
          valueInSeconds = timeValue;
          break;
        case "minutes":
          valueInSeconds = timeValue * 60;
          break;
        case "hours":
          valueInSeconds = timeValue * 3600;
          break;
        case "days":
          valueInSeconds = timeValue * 86400;
          break;
        case "weeks":
          valueInSeconds = timeValue * 604800;
          break;
        default:
          valueInSeconds = timeValue;
      }
      
      // Convert from seconds to target unit
      switch (convertTo) {
        case "seconds":
          resultValue = valueInSeconds;
          break;
        case "minutes":
          resultValue = valueInSeconds / 60;
          break;
        case "hours":
          resultValue = valueInSeconds / 3600;
          break;
        case "days":
          resultValue = valueInSeconds / 86400;
          break;
        case "weeks":
          resultValue = valueInSeconds / 604800;
          break;
        default:
          resultValue = valueInSeconds;
      }
      
      setConversionResult(resultValue.toFixed(2));
    } catch (error) {
      toast.error("Invalid input. Please enter a valid number.");
    }
  };

  const breakdownTime = () => {
    if (!hours && !minutes && !seconds) {
      toast.error("Please enter at least one time value");
      return;
    }

    try {
      const h = parseInt(hours) || 0;
      const m = parseInt(minutes) || 0;
      const s = parseInt(seconds) || 0;
      
      if (h < 0 || m < 0 || s < 0) {
        toast.error("Time values cannot be negative");
        return;
      }
      
      const totalSeconds = h * 3600 + m * 60 + s;
      
      const days = Math.floor(totalSeconds / 86400);
      const remainingHours = Math.floor((totalSeconds % 86400) / 3600);
      const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
      const remainingSeconds = totalSeconds % 60;
      
      let result = '';
      
      if (days > 0) {
        result += `${days} day${days !== 1 ? 's' : ''}, `;
      }
      
      result += `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}, `;
      result += `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}, `;
      result += `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
      
      setBreakdownResult(result);
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  const resetFields = (calcType: string) => {
    switch (calcType) {
      case "calculator":
        setTime1("");
        setTime2("");
        setCalculationResult("");
        break;
      case "converter":
        setConvertTime("");
        setConversionResult("");
        break;
      case "breakdown":
        setHours("");
        setMinutes("");
        setSeconds("");
        setBreakdownResult("");
        break;
    }
  };

  return (
    <ToolLayout title="Time Calculator">
      <Card className="p-6">
        <div className="space-y-6">
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Time Calculator</TabsTrigger>
              <TabsTrigger value="converter">Time Converter</TabsTrigger>
              <TabsTrigger value="breakdown">Time Breakdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="time1">First Time (HH:MM:SS)</Label>
                  <Input
                    id="time1"
                    type="text"
                    placeholder="e.g. 01:30:00"
                    value={time1}
                    onChange={(e) => setTime1(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: Hours:Minutes:Seconds (24-hour format)
                  </p>
                </div>
                
                <div>
                  <Label>Operation</Label>
                  <RadioGroup 
                    value={operation} 
                    onValueChange={(value) => setOperation(value as "add" | "subtract")}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="add" id="add" />
                      <Label htmlFor="add">Add</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="subtract" id="subtract" />
                      <Label htmlFor="subtract">Subtract</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="time2">Second Time (HH:MM:SS)</Label>
                  <Input
                    id="time2"
                    type="text"
                    placeholder="e.g. 00:45:30"
                    value={time2}
                    onChange={(e) => setTime2(e.target.value)}
                  />
                </div>
                
                <Button onClick={calculateTime}>
                  Calculate
                </Button>
                
                <div className="mt-4">
                  <Label>Result</Label>
                  <div className="rounded-lg p-6 border text-center">
                    <div className="text-3xl font-bold">
                      {calculationResult || "00:00:00"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {operation === "add" ? "Total time" : "Time difference"}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("calculator")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">Examples</h3>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 text-sm">
                    <div>1:30:00 + 0:45:00</div>
                    <div>=</div>
                    <div>2:15:00</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div>2:20:30 - 1:15:45</div>
                    <div>=</div>
                    <div>1:04:45</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="converter" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="convert-time">Value</Label>
                    <Input
                      id="convert-time"
                      type="number"
                      placeholder="e.g. 2"
                      value={convertTime}
                      onChange={(e) => setConvertTime(e.target.value)}
                      min="0"
                      step="any"
                    />
                  </div>
                  <div>
                    <Label htmlFor="convert-from">From</Label>
                    <Select 
                      value={convertFrom} 
                      onValueChange={setConvertFrom}
                    >
                      <SelectTrigger id="convert-from">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">Seconds</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="convert-to">To</Label>
                    <Select 
                      value={convertTo} 
                      onValueChange={setConvertTo}
                    >
                      <SelectTrigger id="convert-to">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">Seconds</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={convertTimeUnit}>
                  Convert
                </Button>
                
                <div className="mt-4">
                  <Label>Result</Label>
                  <div className="rounded-lg p-6 border text-center">
                    <div className="text-3xl font-bold">
                      {conversionResult || "0"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {convertTo}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("converter")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">1 minute =</div>
                  <div className="font-medium">60 seconds</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">1 hour =</div>
                  <div className="font-medium">60 minutes</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">1 day =</div>
                  <div className="font-medium">24 hours</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">1 week =</div>
                  <div className="font-medium">7 days</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="breakdown" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      placeholder="e.g. 2"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                      id="minutes"
                      type="number"
                      placeholder="e.g. 30"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seconds">Seconds</Label>
                    <Input
                      id="seconds"
                      type="number"
                      placeholder="e.g. 45"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
                
                <Button onClick={breakdownTime}>
                  Break Down Time
                </Button>
                
                <div className="mt-4">
                  <Label>Result</Label>
                  <div className="rounded-lg p-6 border">
                    <div className="text-xl font-medium break-words">
                      {breakdownResult || "No time entered yet"}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("breakdown")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">How to use</h3>
                <p className="text-sm text-muted-foreground">
                  Enter hours, minutes, and seconds to see a comprehensive breakdown of the time. This is useful for converting a total time into a more readable format, including days, hours, minutes, and seconds.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Common Time Conversions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Minutes to Hours</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div>15 minutes</div>
                  <div>0.25 hours</div>
                  <div>30 minutes</div>
                  <div>0.5 hours</div>
                  <div>45 minutes</div>
                  <div>0.75 hours</div>
                  <div>60 minutes</div>
                  <div>1 hour</div>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Hours to Minutes</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div>0.25 hours</div>
                  <div>15 minutes</div>
                  <div>0.5 hours</div>
                  <div>30 minutes</div>
                  <div>0.75 hours</div>
                  <div>45 minutes</div>
                  <div>1 hour</div>
                  <div>60 minutes</div>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Hours to Days</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div>6 hours</div>
                  <div>0.25 days</div>
                  <div>12 hours</div>
                  <div>0.5 days</div>
                  <div>18 hours</div>
                  <div>0.75 days</div>
                  <div>24 hours</div>
                  <div>1 day</div>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Days to Hours</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div>0.25 days</div>
                  <div>6 hours</div>
                  <div>0.5 days</div>
                  <div>12 hours</div>
                  <div>0.75 days</div>
                  <div>18 hours</div>
                  <div>1 day</div>
                  <div>24 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default TimeCalculator;
