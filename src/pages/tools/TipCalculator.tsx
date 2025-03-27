
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState<string>("");
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [numPeople, setNumPeople] = useState<string>("1");
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [perPersonAmount, setPerPersonAmount] = useState<number>(0);
  const [customAmounts, setCustomAmounts] = useState<{ tip: number; total: number }[]>([]);

  const calculateTip = () => {
    if (!billAmount || parseFloat(billAmount) <= 0) {
      toast.error("Please enter a valid bill amount");
      return;
    }

    if (!numPeople || parseInt(numPeople) <= 0) {
      toast.error("Please enter a valid number of people");
      return;
    }

    try {
      const bill = parseFloat(billAmount);
      const people = parseInt(numPeople);
      
      const tip = (bill * tipPercent) / 100;
      const total = bill + tip;
      const perPerson = total / people;
      
      setTipAmount(tip);
      setTotalAmount(total);
      setPerPersonAmount(perPerson);
      
      // Generate custom tip amounts (10%, 15%, 18%, 20%, 25%)
      const customTips = [10, 15, 18, 20, 25].map(percent => {
        const customTip = (bill * percent) / 100;
        return {
          tip: customTip,
          total: bill + customTip
        };
      });
      
      setCustomAmounts(customTips);
    } catch (error) {
      toast.error("Error calculating tip. Please check your inputs.");
    }
  };

  const handleSliderChange = (value: number[]) => {
    setTipPercent(value[0]);
    if (billAmount) {
      calculateTip();
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const resetCalculator = () => {
    setBillAmount("");
    setTipPercent(15);
    setNumPeople("1");
    setTipAmount(0);
    setTotalAmount(0);
    setPerPersonAmount(0);
    setCustomAmounts([]);
  };

  const quickTipPercentages = [10, 15, 18, 20, 25];

  return (
    <ToolLayout title="Tip Calculator">
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Calculate Your Tip</h2>
              <p className="text-muted-foreground mb-4">
                Calculate the right tip amount for your restaurant bill and split it among your party.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="bill-amount">Bill Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="bill-amount"
                    type="number"
                    placeholder="0.00"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="tip-percent">Tip Percentage</Label>
                  <span className="font-medium">{tipPercent}%</span>
                </div>
                <Slider 
                  value={[tipPercent]} 
                  onValueChange={handleSliderChange}
                  min={0}
                  max={30}
                  step={1}
                  className="my-4"
                />
                <div className="flex justify-between items-center pt-2">
                  {quickTipPercentages.map(percent => (
                    <Button
                      key={percent}
                      variant={tipPercent === percent ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setTipPercent(percent);
                        if (billAmount) {
                          calculateTip();
                        }
                      }}
                      className="h-8 px-2 sm:px-3"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="num-people">Number of People</Label>
                <Input
                  id="num-people"
                  type="number"
                  value={numPeople}
                  onChange={(e) => setNumPeople(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button onClick={calculateTip} className="flex-1">Calculate Tip</Button>
                <Button variant="outline" onClick={resetCalculator}>Reset</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {totalAmount > 0 ? (
              <div className="space-y-6">
                <div className="rounded-lg p-6 border bg-primary/10 border-primary/20 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h3 className="text-sm font-medium">Tip Amount</h3>
                      <div className="text-xl font-bold">{formatCurrency(tipAmount)}</div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Total Bill</h3>
                      <div className="text-xl font-bold">{formatCurrency(totalAmount)}</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h3 className="text-sm font-medium">Per Person</h3>
                    <div className="text-3xl font-bold pt-1">{formatCurrency(perPersonAmount)}</div>
                  </div>
                </div>
                
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="percentages">Quick Tips</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="mt-4 space-y-4">
                    <div className="rounded-lg border">
                      <div className="border-b p-3 bg-muted/50">
                        <h3 className="font-medium">Tip Calculation</h3>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Bill Amount:</div>
                          <div className="text-right">{formatCurrency(parseFloat(billAmount) || 0)}</div>
                          <div className="text-muted-foreground">Tip Percentage:</div>
                          <div className="text-right">{tipPercent}%</div>
                          <div className="text-muted-foreground">Tip Amount:</div>
                          <div className="text-right">{formatCurrency(tipAmount)}</div>
                          <div className="font-medium">Total Bill:</div>
                          <div className="text-right font-medium">{formatCurrency(totalAmount)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border">
                      <div className="border-b p-3 bg-muted/50">
                        <h3 className="font-medium">Bill Splitting</h3>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Number of People:</div>
                          <div className="text-right">{numPeople}</div>
                          <div className="text-muted-foreground">Bill per Person:</div>
                          <div className="text-right">{formatCurrency(parseFloat(billAmount) / parseInt(numPeople) || 0)}</div>
                          <div className="text-muted-foreground">Tip per Person:</div>
                          <div className="text-right">{formatCurrency(tipAmount / parseInt(numPeople))}</div>
                          <div className="font-medium">Total per Person:</div>
                          <div className="text-right font-medium">{formatCurrency(perPersonAmount)}</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="percentages" className="mt-4">
                    <div className="rounded-lg border">
                      <div className="border-b p-3 bg-muted/50">
                        <h3 className="font-medium">Quick Tip Options</h3>
                      </div>
                      <div className="divide-y">
                        {customAmounts.map((amount, index) => (
                          <div 
                            key={index} 
                            className={`p-3 flex justify-between items-center ${tipPercent === quickTipPercentages[index] ? 'bg-primary/10' : ''}`}
                            onClick={() => {
                              setTipPercent(quickTipPercentages[index]);
                              calculateTip();
                            }}
                          >
                            <div>
                              <div className="font-medium">{quickTipPercentages[index]}% Tip</div>
                              <div className="text-xs text-muted-foreground">
                                Tip: {formatCurrency(amount.tip)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatCurrency(amount.total)}</div>
                              <div className="text-xs text-muted-foreground">
                                Per person: {formatCurrency(amount.total / parseInt(numPeople))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Tip Guide</p>
                  <p>10-15%: Adequate service</p>
                  <p>15-20%: Good service</p>
                  <p>20-25%: Exceptional service</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Tip Results</h3>
                <p className="text-muted-foreground">
                  Enter your bill amount and calculate to see the recommended tip and per-person costs.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Tipping Etiquette</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Restaurants</h4>
              <p className="text-sm text-muted-foreground">
                Standard tipping at restaurants in the US ranges from 15-20% of the pre-tax bill. For exceptional service, consider 20-25%.
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Delivery Services</h4>
              <p className="text-sm text-muted-foreground">
                Food delivery drivers typically receive 10-15% of the bill, with a minimum of $2-5 depending on distance and weather conditions.
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Groups & Events</h4>
              <p className="text-sm text-muted-foreground">
                For large groups, restaurants often add an automatic gratuity of 18-20%. Check your bill before adding an additional tip.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default TipCalculator;
