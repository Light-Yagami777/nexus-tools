
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator } from "lucide-react";

interface BMICategory {
  name: string;
  range: string;
  color: string;
  description: string;
}

const BmiCalculator = () => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("30");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [system, setSystem] = useState<"metric" | "imperial">("metric");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<BMICategory | null>(null);
  const [calculationDone, setCalculationDone] = useState<boolean>(false);

  const bmiCategories: BMICategory[] = [
    { 
      name: "Underweight", 
      range: "Below 18.5", 
      color: "text-blue-500",
      description: "You may be at risk for certain health issues. Consider consulting a healthcare provider."
    },
    { 
      name: "Normal weight", 
      range: "18.5 to 24.9", 
      color: "text-green-500",
      description: "Your weight is within the healthy range for your height."
    },
    { 
      name: "Overweight", 
      range: "25.0 to 29.9", 
      color: "text-yellow-500",
      description: "You may be at increased risk for health issues. Consider healthy lifestyle changes."
    },
    { 
      name: "Obesity Class I", 
      range: "30.0 to 34.9", 
      color: "text-orange-500",
      description: "You're at higher risk for health issues. Consider consulting a healthcare provider."
    },
    { 
      name: "Obesity Class II", 
      range: "35.0 to 39.9", 
      color: "text-red-500", 
      description: "You're at significantly increased risk for health issues. Medical consultation recommended."
    },
    { 
      name: "Obesity Class III", 
      range: "40.0 and above", 
      color: "text-red-700",
      description: "You're at high risk for serious health issues. Medical consultation strongly recommended."
    }
  ];

  const determineBMICategory = (bmi: number): BMICategory => {
    if (bmi < 18.5) return bmiCategories[0];
    if (bmi < 25) return bmiCategories[1];
    if (bmi < 30) return bmiCategories[2];
    if (bmi < 35) return bmiCategories[3];
    if (bmi < 40) return bmiCategories[4];
    return bmiCategories[5];
  };

  const calculateBMI = () => {
    if (!height || !weight) {
      return;
    }

    let bmiValue: number;
    
    if (system === "metric") {
      // Height in cm, weight in kg
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      bmiValue = weightInKg / (heightInMeters * heightInMeters);
    } else {
      // Height in feet and inches, weight in pounds
      const heightParts = height.split("'");
      const feet = parseFloat(heightParts[0] || "0");
      const inches = parseFloat(heightParts[1] || "0");
      const heightInInches = (feet * 12) + inches;
      const weightInPounds = parseFloat(weight);
      
      // BMI formula for imperial: (weight in pounds * 703) / (height in inches)²
      bmiValue = (weightInPounds * 703) / (heightInInches * heightInInches);
    }

    setBmi(Math.round(bmiValue * 10) / 10);
    setCategory(determineBMICategory(bmiValue));
    setCalculationDone(true);
  };

  const handleHeightChange = (value: string) => {
    if (system === "imperial") {
      // Allow format like 5'11 for imperial
      setHeight(value);
    } else {
      // Only allow numbers for metric
      const numericValue = value.replace(/[^0-9]/g, '');
      setHeight(numericValue);
    }
  };

  const handleWeightChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setWeight(numericValue);
  };

  const handleAgeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAge(numericValue);
  };

  const handleSystemChange = (value: "metric" | "imperial") => {
    setSystem(value);
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory(null);
    setCalculationDone(false);
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setAge("30");
    setGender("male");
    setBmi(null);
    setCategory(null);
    setCalculationDone(false);
  };

  const getHealthyWeightRange = (): string => {
    if (!height) return "N/A";
    
    let heightInMeters: number;
    if (system === "metric") {
      heightInMeters = parseFloat(height) / 100;
    } else {
      const heightParts = height.split("'");
      const feet = parseFloat(heightParts[0] || "0");
      const inches = parseFloat(heightParts[1] || "0");
      const heightInInches = (feet * 12) + inches;
      heightInMeters = heightInInches * 0.0254; // Convert inches to meters
    }
    
    // Calculate healthy weight range (BMI 18.5 - 24.9)
    const minWeight = 18.5 * heightInMeters * heightInMeters;
    const maxWeight = 24.9 * heightInMeters * heightInMeters;
    
    if (system === "metric") {
      return `${Math.round(minWeight)} - ${Math.round(maxWeight)} kg`;
    } else {
      return `${Math.round(minWeight * 2.20462)} - ${Math.round(maxWeight * 2.20462)} lbs`;
    }
  };

  return (
    <ToolLayout title="BMI Calculator">
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Calculate Your BMI</h2>
              <p className="text-muted-foreground mb-4">
                BMI (Body Mass Index) is a measure of body fat based on your weight relative to your height.
              </p>
            </div>
            
            <div className="space-y-4">
              <Tabs 
                defaultValue={system} 
                onValueChange={(value) => handleSystemChange(value as "metric" | "imperial")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metric">Metric</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metric" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="height-metric">Height (cm)</Label>
                    <Input
                      id="height-metric"
                      type="text"
                      placeholder="e.g. 175"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight-metric">Weight (kg)</Label>
                    <Input
                      id="weight-metric"
                      type="text"
                      placeholder="e.g. 70"
                      value={weight}
                      onChange={(e) => handleWeightChange(e.target.value)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="imperial" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="height-imperial">Height (ft'in)</Label>
                    <Input
                      id="height-imperial"
                      type="text"
                      placeholder="e.g. 5'11"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Format as feet'inches (e.g. 5'11)</p>
                  </div>
                  <div>
                    <Label htmlFor="weight-imperial">Weight (lbs)</Label>
                    <Input
                      id="weight-imperial"
                      type="text"
                      placeholder="e.g. 160"
                      value={weight}
                      onChange={(e) => handleWeightChange(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="text"
                    placeholder="e.g. 30"
                    value={age}
                    onChange={(e) => handleAgeChange(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <RadioGroup 
                    defaultValue="male" 
                    value={gender}
                    onValueChange={(value) => setGender(value as "male" | "female")}
                    className="flex items-center space-x-4 h-10"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={calculateBMI} className="flex-1">Calculate BMI</Button>
                <Button variant="outline" onClick={resetCalculator}>Reset</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {calculationDone && bmi !== null && category !== null ? (
              <div className="space-y-6">
                <div className="rounded-lg p-6 border bg-muted/50 text-center">
                  <h3 className="text-lg font-medium mb-2">Your BMI</h3>
                  <div className="text-4xl font-bold mb-2">{bmi}</div>
                  <div className={`text-lg font-medium ${category.color}`}>
                    {category.name}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    BMI Range: {category.range}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">What Your Result Means</h3>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Healthy Weight Range</h3>
                    <p className="text-muted-foreground">
                      For your height, a healthy weight range would be approximately:
                      <span className="block font-medium text-foreground mt-1">
                        {getHealthyWeightRange()}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="rounded-lg p-4 bg-primary/10 border border-primary/20">
                  <h3 className="text-sm font-medium mb-2">Important Note</h3>
                  <p className="text-xs text-muted-foreground">
                    BMI is a general guideline and doesn't account for factors like muscle mass, body composition, age, and ethnicity. It's best to consult with a healthcare professional for a complete health assessment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">BMI Results</h3>
                <p className="text-muted-foreground">
                  Enter your details and calculate your BMI to see your results.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Understanding BMI Categories</h3>
          <div className="grid gap-2">
            {bmiCategories.map((cat) => (
              <div 
                key={cat.name} 
                className={`p-3 rounded-lg border flex items-center ${category && category.name === cat.name ? 'bg-muted/80 border-primary' : 'bg-background'}`}
              >
                <div className={`w-4 h-4 rounded-full mr-3 ${cat.color.replace('text-', 'bg-')}`}></div>
                <div className="mr-auto">
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">BMI: {cat.range}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default BmiCalculator;
