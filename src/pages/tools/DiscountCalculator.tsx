
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

const DiscountCalculator = () => {
  // Discount calculation
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<string>("");
  const [savedAmount, setSavedAmount] = useState<string>("");
  
  // Reverse calculation (find original price)
  const [finalPriceReverse, setFinalPriceReverse] = useState<string>("");
  const [discountPercentReverse, setDiscountPercentReverse] = useState<string>("");
  const [originalPriceResult, setOriginalPriceResult] = useState<string>("");
  
  // Discount amount calculation
  const [originalPriceAmount, setOriginalPriceAmount] = useState<string>("");
  const [discountAmountDirect, setDiscountAmountDirect] = useState<string>("");
  const [finalPriceAmount, setFinalPriceAmount] = useState<string>("");
  const [discountPercentResult, setDiscountPercentResult] = useState<string>("");

  // Calculate discount and final price
  const calculateDiscount = () => {
    if (!originalPrice) {
      toast.error("Please enter the original price");
      return;
    }

    if (!discountPercent) {
      toast.error("Please enter the discount percentage");
      return;
    }

    try {
      const original = parseFloat(originalPrice);
      const discount = parseFloat(discountPercent);
      
      if (original <= 0) {
        toast.error("Original price must be greater than zero");
        return;
      }
      
      if (discount < 0 || discount > 100) {
        toast.error("Discount percentage must be between 0 and 100");
        return;
      }
      
      const discountValue = (original * discount) / 100;
      const final = original - discountValue;
      
      setDiscountAmount(discountValue.toFixed(2));
      setFinalPrice(final.toFixed(2));
      setSavedAmount(discountValue.toFixed(2));
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  // Calculate original price from final price and discount percentage
  const calculateOriginalPrice = () => {
    if (!finalPriceReverse) {
      toast.error("Please enter the final price");
      return;
    }

    if (!discountPercentReverse) {
      toast.error("Please enter the discount percentage");
      return;
    }

    try {
      const final = parseFloat(finalPriceReverse);
      const discount = parseFloat(discountPercentReverse);
      
      if (final <= 0) {
        toast.error("Final price must be greater than zero");
        return;
      }
      
      if (discount < 0 || discount > 100) {
        toast.error("Discount percentage must be between 0 and 100");
        return;
      }
      
      if (discount === 100) {
        toast.error("Discount cannot be 100% for this calculation");
        return;
      }
      
      const original = final / (1 - discount / 100);
      setOriginalPriceResult(original.toFixed(2));
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  // Calculate discount percentage from original price and discount amount
  const calculateDiscountPercent = () => {
    if (!originalPriceAmount) {
      toast.error("Please enter the original price");
      return;
    }

    if (!discountAmountDirect) {
      toast.error("Please enter the discount amount");
      return;
    }

    try {
      const original = parseFloat(originalPriceAmount);
      const discountValue = parseFloat(discountAmountDirect);
      
      if (original <= 0) {
        toast.error("Original price must be greater than zero");
        return;
      }
      
      if (discountValue < 0) {
        toast.error("Discount amount cannot be negative");
        return;
      }
      
      if (discountValue > original) {
        toast.error("Discount amount cannot be greater than original price");
        return;
      }
      
      const final = original - discountValue;
      const discountPercent = (discountValue / original) * 100;
      
      setFinalPriceAmount(final.toFixed(2));
      setDiscountPercentResult(discountPercent.toFixed(2));
    } catch (error) {
      toast.error("Invalid input. Please enter valid numbers.");
    }
  };

  const resetFields = (calcType: string) => {
    switch (calcType) {
      case "discount":
        setOriginalPrice("");
        setDiscountPercent("");
        setDiscountAmount("");
        setFinalPrice("");
        setSavedAmount("");
        break;
      case "original":
        setFinalPriceReverse("");
        setDiscountPercentReverse("");
        setOriginalPriceResult("");
        break;
      case "percent":
        setOriginalPriceAmount("");
        setDiscountAmountDirect("");
        setFinalPriceAmount("");
        setDiscountPercentResult("");
        break;
    }
  };

  return (
    <ToolLayout title="Discount Calculator">
      <Card className="p-6">
        <div className="space-y-6">
          <Tabs defaultValue="discount" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discount">Calculate Discount</TabsTrigger>
              <TabsTrigger value="original">Find Original Price</TabsTrigger>
              <TabsTrigger value="percent">Find Discount %</TabsTrigger>
            </TabsList>
            
            <TabsContent value="discount" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original-price">Original Price ($)</Label>
                    <Input
                      id="original-price"
                      type="number"
                      placeholder="e.g. 100"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount-percent">Discount (%)</Label>
                    <Input
                      id="discount-percent"
                      type="number"
                      placeholder="e.g. 20"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button onClick={calculateDiscount}>
                  Calculate Discount
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="rounded-lg p-4 border text-center">
                    <h4 className="text-sm font-medium mb-1">You Save</h4>
                    <div className="text-xl font-bold text-primary">
                      ${savedAmount || "0.00"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {discountPercent && `${discountPercent}% off`}
                    </div>
                  </div>
                  <div className="rounded-lg p-4 border text-center">
                    <h4 className="text-sm font-medium mb-1">Final Price</h4>
                    <div className="text-xl font-bold">
                      ${finalPrice || "0.00"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      After discount
                    </div>
                  </div>
                  <div className="rounded-lg p-4 border text-center">
                    <h4 className="text-sm font-medium mb-1">Discount Amount</h4>
                    <div className="text-xl font-bold">
                      ${discountAmount || "0.00"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Price reduction
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("discount")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">How to use</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    1. Enter the original price of the item
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2. Enter the discount percentage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    3. Click "Calculate Discount" to see the results
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="original" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="final-price-reverse">Final Price ($)</Label>
                    <Input
                      id="final-price-reverse"
                      type="number"
                      placeholder="e.g. 80"
                      value={finalPriceReverse}
                      onChange={(e) => setFinalPriceReverse(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount-percent-reverse">Discount (%)</Label>
                    <Input
                      id="discount-percent-reverse"
                      type="number"
                      placeholder="e.g. 20"
                      value={discountPercentReverse}
                      onChange={(e) => setDiscountPercentReverse(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button onClick={calculateOriginalPrice}>
                  Calculate Original Price
                </Button>
                
                <div className="rounded-lg p-6 border text-center">
                  <h4 className="text-sm font-medium mb-1">Original Price</h4>
                  <div className="text-3xl font-bold">
                    ${originalPriceResult || "0.00"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Before discount was applied
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("original")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">How to use</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    1. Enter the final price (after discount)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2. Enter the discount percentage that was applied
                  </p>
                  <p className="text-sm text-muted-foreground">
                    3. Click "Calculate Original Price" to find what the price was before the discount
                  </p>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-medium">Formula: </span>
                  <span className="text-muted-foreground">Original Price = Final Price / (1 - Discount% / 100)</span>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="percent" className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original-price-amount">Original Price ($)</Label>
                    <Input
                      id="original-price-amount"
                      type="number"
                      placeholder="e.g. 100"
                      value={originalPriceAmount}
                      onChange={(e) => setOriginalPriceAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount-amount-direct">Discount Amount ($)</Label>
                    <Input
                      id="discount-amount-direct"
                      type="number"
                      placeholder="e.g. 20"
                      value={discountAmountDirect}
                      onChange={(e) => setDiscountAmountDirect(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button onClick={calculateDiscountPercent}>
                  Calculate Discount Percent
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-lg p-4 border text-center">
                    <h4 className="text-sm font-medium mb-1">Discount Percentage</h4>
                    <div className="text-xl font-bold text-primary">
                      {discountPercentResult || "0"}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Percent off
                    </div>
                  </div>
                  <div className="rounded-lg p-4 border text-center">
                    <h4 className="text-sm font-medium mb-1">Final Price</h4>
                    <div className="text-xl font-bold">
                      ${finalPriceAmount || "0.00"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      After discount
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => resetFields("percent")}
                >
                  Reset
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">How to use</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    1. Enter the original price of the item
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2. Enter the discount amount (in dollars)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    3. Click "Calculate Discount Percent" to find the percentage discount
                  </p>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-medium">Formula: </span>
                  <span className="text-muted-foreground">Discount% = (Discount Amount / Original Price) × 100</span>
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Common Discount Calculations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col"
                onClick={() => {
                  setDiscountPercent("10");
                  if (originalPrice) {
                    calculateDiscount();
                  }
                }}
              >
                <span className="text-2xl font-bold text-primary mb-1">10%</span>
                <span className="text-sm text-muted-foreground">Quick Discount</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col"
                onClick={() => {
                  setDiscountPercent("20");
                  if (originalPrice) {
                    calculateDiscount();
                  }
                }}
              >
                <span className="text-2xl font-bold text-primary mb-1">20%</span>
                <span className="text-sm text-muted-foreground">Popular Sale</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col"
                onClick={() => {
                  setDiscountPercent("25");
                  if (originalPrice) {
                    calculateDiscount();
                  }
                }}
              >
                <span className="text-2xl font-bold text-primary mb-1">25%</span>
                <span className="text-sm text-muted-foreground">Quarter Off</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col"
                onClick={() => {
                  setDiscountPercent("50");
                  if (originalPrice) {
                    calculateDiscount();
                  }
                }}
              >
                <span className="text-2xl font-bold text-primary mb-1">50%</span>
                <span className="text-sm text-muted-foreground">Half Off</span>
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Discount Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Stacked Discounts</h4>
                <p className="text-sm text-muted-foreground">
                  When multiple discounts are applied one after another, they don't simply add up. For example, a 20% discount followed by an additional 10% discount is equivalent to a total discount of 28%, not 30%.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Sales Tax Consideration</h4>
                <p className="text-sm text-muted-foreground">
                  Remember that sales tax is typically calculated after discounts are applied. So the tax is only on the final (discounted) price, not the original price.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default DiscountCalculator;
