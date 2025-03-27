
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Calculator } from "lucide-react";

interface AmortizationData {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("300000");
  const [interestRate, setInterestRate] = useState<string>("5.5");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [downPayment, setDownPayment] = useState<string>("60000");
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationData[]>([]);
  const [propertyPrice, setPropertyPrice] = useState<number>(360000);
  const [chartData, setChartData] = useState<any[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<any[]>([]);

  useEffect(() => {
    calculateDownPaymentPercent();
  }, [loanAmount, downPayment]);

  const calculateDownPaymentPercent = () => {
    const loanAmountNum = parseFloat(loanAmount.replace(/,/g, "")) || 0;
    const downPaymentNum = parseFloat(downPayment.replace(/,/g, "")) || 0;
    const totalPrice = loanAmountNum + downPaymentNum;
    setPropertyPrice(totalPrice);
    
    const percentage = (downPaymentNum / totalPrice) * 100;
    setDownPaymentPercent(Math.round(percentage * 100) / 100);
  };

  const handleSliderChange = (value: number[]) => {
    const percent = value[0];
    setDownPaymentPercent(percent);
    
    const downPaymentValue = (propertyPrice * percent) / 100;
    setDownPayment(downPaymentValue.toFixed(0));
    
    const newLoanAmount = propertyPrice - downPaymentValue;
    setLoanAmount(newLoanAmount.toFixed(0));
  };

  const handleDownPaymentChange = (value: string) => {
    // Remove commas and non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, '');
    setDownPayment(numericValue);
    
    const downPaymentNum = parseFloat(numericValue) || 0;
    const newLoanAmount = propertyPrice - downPaymentNum;
    
    if (newLoanAmount >= 0) {
      setLoanAmount(newLoanAmount.toFixed(0));
    }
  };

  const handleLoanAmountChange = (value: string) => {
    // Remove commas and non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, '');
    setLoanAmount(numericValue);
    
    const loanAmountNum = parseFloat(numericValue) || 0;
    const newTotalPrice = loanAmountNum + parseFloat(downPayment.replace(/,/g, "")) || 0;
    setPropertyPrice(newTotalPrice);
  };

  const calculateMortgage = () => {
    const P = parseFloat(loanAmount.replace(/,/g, "")) || 0; // Principal
    const r = (parseFloat(interestRate) || 0) / 100 / 12; // Monthly interest rate
    const n = (parseFloat(loanTerm) || 0) * 12; // Total number of payments
    
    if (P <= 0 || r <= 0 || n <= 0) {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
      setAmortizationSchedule([]);
      setChartData([]);
      setPaymentBreakdown([]);
      return;
    }
    
    // Calculate monthly payment: M = P[r(1+r)^n]/[(1+r)^n-1]
    const monthlyPaymentValue = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(monthlyPaymentValue);
    
    const totalPaymentValue = monthlyPaymentValue * n;
    setTotalPayment(totalPaymentValue);
    
    const totalInterestValue = totalPaymentValue - P;
    setTotalInterest(totalInterestValue);
    
    // Calculate amortization schedule
    let balance = P;
    const schedule: AmortizationData[] = [];
    const yearlyData: any[] = [];
    let currentYearPrincipal = 0;
    let currentYearInterest = 0;
    let currentYear = 1;
    
    for (let month = 1; month <= n; month++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPaymentValue - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month,
        payment: monthlyPaymentValue,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: balance
      });
      
      currentYearPrincipal += principalPayment;
      currentYearInterest += interestPayment;
      
      if (month % 12 === 0 || month === n) {
        yearlyData.push({
          year: currentYear,
          principal: currentYearPrincipal,
          interest: currentYearInterest,
          balance: balance > 0 ? balance : 0
        });
        
        currentYear++;
        currentYearPrincipal = 0;
        currentYearInterest = 0;
      }
    }
    
    setAmortizationSchedule(schedule);
    setChartData(yearlyData);
    
    // Calculate payment breakdown
    const principalPercentage = (P / totalPaymentValue) * 100;
    const interestPercentage = (totalInterestValue / totalPaymentValue) * 100;
    
    setPaymentBreakdown([
      { name: "Principal", value: P, percentage: principalPercentage },
      { name: "Interest", value: totalInterestValue, percentage: interestPercentage }
    ]);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <ToolLayout title="Mortgage Calculator">
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Calculate Your Mortgage</h2>
              <p className="text-muted-foreground mb-4">
                Use this calculator to estimate your monthly mortgage payments and see a detailed amortization schedule.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="property-price">Property Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="property-price"
                    type="text"
                    value={propertyPrice.toLocaleString()}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const numValue = parseInt(value) || 0;
                      setPropertyPrice(numValue);
                      const newLoanAmount = numValue - parseFloat(downPayment.replace(/,/g, "")) || 0;
                      if (newLoanAmount >= 0) {
                        setLoanAmount(newLoanAmount.toFixed(0));
                      }
                    }}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="down-payment">Down Payment ({downPaymentPercent}%)</Label>
                  <span className="text-sm text-muted-foreground">
                    ${parseInt(downPayment).toLocaleString()}
                  </span>
                </div>
                <Slider 
                  value={[downPaymentPercent]} 
                  onValueChange={handleSliderChange}
                  min={0}
                  max={50}
                  step={1}
                  className="my-4"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="down-payment"
                    type="text"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="loan-amount">Loan Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="loan-amount"
                    type="text"
                    value={loanAmount}
                    onChange={(e) => handleLoanAmountChange(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="text"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </div>
              
              <div>
                <Label htmlFor="loan-term">Loan Term (years)</Label>
                <Select 
                  value={loanTerm} 
                  onValueChange={(value) => setLoanTerm(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 years</SelectItem>
                    <SelectItem value="25">25 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={calculateMortgage} className="w-full">Calculate Mortgage</Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {monthlyPayment !== null && monthlyPayment > 0 ? (
              <div className="space-y-6">
                <div className="rounded-lg p-6 border bg-muted/50 text-center">
                  <h3 className="text-lg font-medium mb-2">Monthly Payment</h3>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {formatCurrency(monthlyPayment)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg p-4 border">
                    <h4 className="text-sm font-medium mb-1">Total Principal</h4>
                    <div className="text-xl font-bold">
                      {formatCurrency(parseFloat(loanAmount.replace(/,/g, "")) || 0)}
                    </div>
                  </div>
                  <div className="rounded-lg p-4 border">
                    <h4 className="text-sm font-medium mb-1">Total Interest</h4>
                    <div className="text-xl font-bold">
                      {formatCurrency(totalInterest || 0)}
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Payment Breakdown</h3>
                  </div>
                  <div className="p-4 grid grid-cols-2">
                    <div className="aspect-square flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={paymentBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {paymentBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 flex flex-col justify-center">
                      {paymentBreakdown.map((item, index) => (
                        <div key={item.name} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ background: COLORS[index % COLORS.length] }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Payment Over Time</h3>
                  </div>
                  <div className="p-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="balance" 
                          name="Remaining Balance" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="principal" 
                          name="Principal" 
                          stroke="#0088FE" 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="interest" 
                          name="Interest" 
                          stroke="#FF8042" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Mortgage Results</h3>
                <p className="text-muted-foreground">
                  Enter your mortgage details and calculate to see your monthly payment and amortization schedule.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {amortizationSchedule.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Amortization Schedule</h3>
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Year</th>
                      <th className="p-2 text-left">Payment</th>
                      <th className="p-2 text-left">Principal</th>
                      <th className="p-2 text-left">Interest</th>
                      <th className="p-2 text-left">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule
                      .filter((_, index) => index % 12 === 0) // Show yearly data only
                      .map((data, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{formatCurrency(data.payment * 12)}</td>
                          <td className="p-2">{formatCurrency(
                            amortizationSchedule
                              .slice(index * 12, (index + 1) * 12)
                              .reduce((sum, item) => sum + item.principal, 0)
                          )}</td>
                          <td className="p-2">{formatCurrency(
                            amortizationSchedule
                              .slice(index * 12, (index + 1) * 12)
                              .reduce((sum, item) => sum + item.interest, 0)
                          )}</td>
                          <td className="p-2">{formatCurrency(data.remainingBalance)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-2">About Mortgage Calculations</h3>
          <p className="text-sm text-muted-foreground">
            This mortgage calculator uses the standard amortization formula to calculate monthly payments. It assumes a fixed interest rate for the entire loan term. The actual loan terms, interest rates, and payments may vary based on your credit score, lender policies, and other factors.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This calculator does not include property taxes, insurance, or HOA fees, which would increase your total monthly payments.
          </p>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default MortgageCalculator;
