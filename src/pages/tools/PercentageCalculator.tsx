
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

const PercentageCalculator = () => {
  // Basic percentage calculator
  const [percentValue, setPercentValue] = useState<string>("");
  const [baseValue, setBaseValue] = useState<string>("");
  const [resultValue, setResultValue] = useState<string>("");
  
  // Percentage change calculator
  const [originalValue, setOriginalValue] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [percentageChange, setPercentageChange] = useState<string>("");
  const [isIncrease, setIsIncrease] = useState<boolean>(true);

  // Percentage distribution calculator
  const [totalValue, setTotalValue] = useState<string>("");
  const [part1Value, setPart1Value] = useState<string>("");
  const [part2Value, setPart2Value] = useState<string>("");
  const [part3Value, setPart3Value] = useState<string>("");
  const [percentage1, setPercentage1] = useState<string>("");
  const [percentage2, setPercentage2] = useState<string>("");
  const [percentage3, setPercentage3] = useState<string>("");

  // Calculate X% of Y
  const calculatePercentageOf = () => {
    if (!percentValue || !baseValue) {
      toast.error("Please enter all values");
      return;
    }

    try {
      const percent = parseFloat(percentValue);
      const base = parseFloat(baseValue);
      const result = (percent / 100) * base;
      setResultValue(result.toFixed(2));
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  // Calculate X is what percent of Y
  const calculateWhatPercent = () => {
    if (!resultValue || !baseValue) {
      toast.error("Please enter all values");
      return;
    }

    try {
      const result = parseFloat(resultValue);
      const base = parseFloat(baseValue);
      const percent = (result / base) * 100;
      setPercentValue(percent.toFixed(2));
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  // X is Y% of what value
  const calculateBaseValue = () => {
    if (!resultValue || !percentValue) {
      toast.error("Please enter all values");
      return;
    }

    try {
      const result = parseFloat(resultValue);
      const percent = parseFloat(percentValue);
      const base = result / (percent / 100);
      setBaseValue(base.toFixed(2));
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  // Calculate percentage change
  const calculatePercentageChange = () => {
    if (!originalValue || !newValue) {
      toast.error("Please enter both original and new values");
      return;
    }

    try {
      const original = parseFloat(originalValue);
      const newVal = parseFloat(newValue);
      const change = ((newVal - original) / original) * 100;
      setPercentageChange(Math.abs(change).toFixed(2));
      setIsIncrease(change >= 0);
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  // Calculate new value from percentage change
  const calculateNewValue = () => {
    if (!originalValue || !percentageChange) {
      toast.error("Please enter original value and percentage change");
      return;
    }

    try {
      const original = parseFloat(originalValue);
      const percent = parseFloat(percentageChange);
      const newVal = isIncrease 
        ? original + (original * (percent / 100))
        : original - (original * (percent / 100));
      setNewValue(newVal.toFixed(2));
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  // Calculate percentage distribution
  const calculateDistribution = () => {
    if (!totalValue || (!part1Value && !part2Value && !part3Value)) {
      toast.error("Please enter the total and at least one part value");
      return;
    }

    try {
      const total = parseFloat(totalValue);
      
      if (part1Value) {
        const part1 = parseFloat(part1Value);
        setPercentage1(((part1 / total) * 100).toFixed(2));
      }
      
      if (part2Value) {
        const part2 = parseFloat(part2Value);
        setPercentage2(((part2 / total) * 100).toFixed(2));
      }
      
      if (part3Value) {
        const part3 = parseFloat(part3Value);
        setPercentage3(((part3 / total) * 100).toFixed(2));
      }
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  // Calculate part values from percentages
  const calculatePartValues = () => {
    if (!totalValue || (!percentage1 && !percentage2 && !percentage3)) {
      toast.error("Please enter the total and at least one percentage");
      return;
    }

    try {
      const total = parseFloat(totalValue);
      
      if (percentage1) {
        const percent1 = parseFloat(percentage1);
        setPart1Value(((percent1 / 100) * total).toFixed(2));
      }
      
      if (percentage2) {
        const percent2 = parseFloat(percentage2);
        setPart2Value(((percent2 / 100) * total).toFixed(2));
      }
      
      if (percentage3) {
        const percent3 = parseFloat(percentage3);
        setPart3Value(((percent3 / 100) * total).toFixed(2));
      }
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  const resetFields = (calcType: string) => {
    switch (calcType) {
      case "basic":
        setPercentValue("");
        setBaseValue("");
        setResultValue("");
        break;
      case "change":
        setOriginalValue("");
        setNewValue("");
        setPercentageChange("");
        setIsIncrease(true);
        break;
      case "distribution":
        setTotalValue("");
        setPart1Value("");
        setPart2Value("");
        setPart3Value("");
        setPercentage1("");
        setPercentage2("");
        setPercentage3("");
        break;
    }
  };

  return (
    <ToolLayout title="Percentage Calculator">
      <Card className="p-6">
        <div className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Percentage</TabsTrigger>
              <TabsTrigger value="change">Percentage Change</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div>
                    <Label htmlFor="percent-value">Percentage (%)</Label>
                    <Input
                      id="percent-value"
                      type="number"
                      placeholder="e.g. 20"
                      value={percentValue}
                      onChange={(e) => setPercentValue(e.target.value)}
                    />
                  </div>
                  <div className="text-center self-center">
                    <span>of</span>
                  </div>
                  <div>
                    <Label htmlFor="base-value">Value</Label>
                    <Input
                      id="base-value"
                      type="number"
                      placeholder="e.g. 500"
                      value={baseValue}
                      onChange={(e) => setBaseValue(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-md w-full text-center">
                    <span className="font-medium">Result: </span>
                    <span>{resultValue || "—"}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={calculatePercentageOf}
                    className="flex-1"
                  >
                    Calculate % of Value
                  </Button>
                  <Button 
                    onClick={calculateWhatPercent}
                    className="flex-1"
                  >
                    Calculate What %
                  </Button>
                  <Button 
                    onClick={calculateBaseValue}
                    className="flex-1"
                  >
                    Calculate Value
                  </Button>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("basic")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">How to use</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">X% of Y:</span> Enter percentage and value, click "Calculate % of Value"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">X is what % of Y:</span> Enter result and value, click "Calculate What %"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">X is Y% of what?:</span> Enter result and percentage, click "Calculate Value"
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="change" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original-value">Original Value</Label>
                    <Input
                      id="original-value"
                      type="number"
                      placeholder="e.g. 200"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-value">New Value</Label>
                    <Input
                      id="new-value"
                      type="number"
                      placeholder="e.g. 250"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="percentage-change">Percentage Change</Label>
                    <Input
                      id="percentage-change"
                      type="number"
                      placeholder="e.g. 25"
                      value={percentageChange}
                      onChange={(e) => setPercentageChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="change-type">Change Type</Label>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        type="button"
                        variant={isIncrease ? "default" : "outline"}
                        onClick={() => setIsIncrease(true)}
                      >
                        Increase
                      </Button>
                      <Button
                        type="button"
                        variant={!isIncrease ? "default" : "outline"}
                        onClick={() => setIsIncrease(false)}
                      >
                        Decrease
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-md w-full text-center">
                    {percentageChange && 
                      <div>
                        <span className="font-medium">
                          {isIncrease ? "Increase" : "Decrease"} of {percentageChange}%
                        </span>
                      </div>
                    }
                    {originalValue && newValue && 
                      <div>
                        <span className="font-medium">
                          From {originalValue} to {newValue}
                        </span>
                      </div>
                    }
                    {(!percentageChange && !originalValue && !newValue) && "—"}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={calculatePercentageChange}
                    className="flex-1"
                  >
                    Calculate % Change
                  </Button>
                  <Button 
                    onClick={calculateNewValue}
                    className="flex-1"
                  >
                    Calculate New Value
                  </Button>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("change")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">How to use</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Find % change:</span> Enter original and new values, click "Calculate % Change"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Find new value after % change:</span> Enter original value, percentage, and select increase/decrease, click "Calculate New Value"
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="distribution" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="total-value">Total Value</Label>
                  <Input
                    id="total-value"
                    type="number"
                    placeholder="e.g. 1000"
                    value={totalValue}
                    onChange={(e) => setTotalValue(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="part-1">Part 1</Label>
                    <Input
                      id="part-1"
                      type="number"
                      placeholder="Value"
                      value={part1Value}
                      onChange={(e) => setPart1Value(e.target.value)}
                    />
                    <div className="mt-2 text-center bg-muted/50 py-1 px-2 rounded">
                      {percentage1 ? `${percentage1}%` : "—"}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="part-2">Part 2</Label>
                    <Input
                      id="part-2"
                      type="number"
                      placeholder="Value"
                      value={part2Value}
                      onChange={(e) => setPart2Value(e.target.value)}
                    />
                    <div className="mt-2 text-center bg-muted/50 py-1 px-2 rounded">
                      {percentage2 ? `${percentage2}%` : "—"}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="part-3">Part 3</Label>
                    <Input
                      id="part-3"
                      type="number"
                      placeholder="Value"
                      value={part3Value}
                      onChange={(e) => setPart3Value(e.target.value)}
                    />
                    <div className="mt-2 text-center bg-muted/50 py-1 px-2 rounded">
                      {percentage3 ? `${percentage3}%` : "—"}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="percent-1">Percentage 1 (%)</Label>
                    <Input
                      id="percent-1"
                      type="number"
                      placeholder="e.g. 50"
                      value={percentage1}
                      onChange={(e) => setPercentage1(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="percent-2">Percentage 2 (%)</Label>
                    <Input
                      id="percent-2"
                      type="number"
                      placeholder="e.g. 30"
                      value={percentage2}
                      onChange={(e) => setPercentage2(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="percent-3">Percentage 3 (%)</Label>
                    <Input
                      id="percent-3"
                      type="number"
                      placeholder="e.g. 20"
                      value={percentage3}
                      onChange={(e) => setPercentage3(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={calculateDistribution}
                    className="flex-1"
                  >
                    Calculate Percentages
                  </Button>
                  <Button 
                    onClick={calculatePartValues}
                    className="flex-1"
                  >
                    Calculate Values
                  </Button>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("distribution")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">How to use</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Find percentages:</span> Enter total and part values, click "Calculate Percentages"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Find part values from percentages:</span> Enter total and percentages, click "Calculate Values"
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Common Percentage Formulas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Percentage of a Value</h4>
                <p className="text-sm text-muted-foreground mb-2">To find X% of Y:</p>
                <div className="font-mono bg-muted/50 p-2 rounded">
                  Result = (X / 100) × Y
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Example: 20% of 500 = (20 / 100) × 500 = 100
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">X is What Percent of Y</h4>
                <p className="text-sm text-muted-foreground mb-2">To find what percent X is of Y:</p>
                <div className="font-mono bg-muted/50 p-2 rounded">
                  Percentage = (X / Y) × 100
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Example: 20 is what percent of 80? (20 / 80) × 100 = 25%
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Percentage Change</h4>
                <p className="text-sm text-muted-foreground mb-2">To find percentage change:</p>
                <div className="font-mono bg-muted/50 p-2 rounded">
                  % Change = ((New - Original) / Original) × 100
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Example: From 200 to 250 = ((250 - 200) / 200) × 100 = 25% increase
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Value After Percentage Change</h4>
                <p className="text-sm text-muted-foreground mb-2">To find new value after percentage change:</p>
                <div className="font-mono bg-muted/50 p-2 rounded">
                  New Value = Original × (1 + (% Change / 100))
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Example: 200 + 25% = 200 × (1 + (25 / 100)) = 250
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default PercentageCalculator;
