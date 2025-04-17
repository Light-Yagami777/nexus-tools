import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const BinaryDecimalConverter = () => {
  const [binaryInput, setBinaryInput] = useState<string>("");
  const [decimalInput, setDecimalInput] = useState<string>("");
  const [hexInput, setHexInput] = useState<string>("");
  const [octalInput, setOctalInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("binary-to-decimal");
  const [conversionExplanation, setConversionExplanation] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const validateBinary = (value: string): boolean => {
    return /^[01]*$/.test(value);
  };

  const validateDecimal = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  const validateHex = (value: string): boolean => {
    return /^[0-9A-Fa-f]*$/.test(value);
  };

  const validateOctal = (value: string): boolean => {
    return /^[0-7]*$/.test(value);
  };

  const handleBinaryInput = (value: string) => {
    if (validateBinary(value) || value === "") {
      setBinaryInput(value);
    }
  };

  const handleDecimalInput = (value: string) => {
    if (validateDecimal(value) || value === "") {
      setDecimalInput(value);
    }
  };

  const handleHexInput = (value: string) => {
    if (validateHex(value) || value === "") {
      setHexInput(value.toUpperCase());
    }
  };

  const handleOctalInput = (value: string) => {
    if (validateOctal(value) || value === "") {
      setOctalInput(value);
    }
  };

  const convertBinaryToDecimal = () => {
    if (!binaryInput) {
      toast("Please enter a binary number");
      return;
    }

    setIsCalculating(true);
    try {
      const decimal = parseInt(binaryInput, 2);
      if (isNaN(decimal)) {
        toast("Invalid binary number");
        setIsCalculating(false);
        return;
      }
      
      setDecimalInput(decimal.toString());
      setHexInput(decimal.toString(16).toUpperCase());
      setOctalInput(decimal.toString(8));

      // Generate explanation
      let explanation = "Binary to decimal conversion:\n";
      const bits = binaryInput.split('').reverse();
      
      explanation += bits.map((bit, index) => {
        const value = bit === '1' ? Math.pow(2, index) : 0;
        return `${bit} × 2^${index} = ${value}`;
      }).reverse().join('\n');
      
      explanation += `\n\nSum = ${decimal}`;
      setConversionExplanation(explanation);
      toast("Conversion successful");
    } catch (error) {
      toast("Invalid binary number");
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  const convertDecimalToBinary = () => {
    if (!decimalInput) {
      toast("Please enter a decimal number");
      return;
    }

    setIsCalculating(true);
    try {
      const decimal = parseInt(decimalInput);
      if (isNaN(decimal)) {
        toast("Invalid decimal number");
        setIsCalculating(false);
        return;
      }
      
      setBinaryInput(decimal.toString(2));
      setHexInput(decimal.toString(16).toUpperCase());
      setOctalInput(decimal.toString(8));

      // Generate explanation
      let explanation = "Decimal to binary conversion:\n";
      explanation += `${decimalInput} (decimal) = `;
      
      let tempDecimal = decimal;
      let steps: string[] = [];
      
      while (tempDecimal > 0) {
        steps.push(`${tempDecimal} ÷ 2 = ${Math.floor(tempDecimal / 2)} remainder ${tempDecimal % 2}`);
        tempDecimal = Math.floor(tempDecimal / 2);
      }
      
      explanation += `\n${steps.join('\n')}\n\nReading remainders from bottom to top: ${decimal.toString(2)}`;
      setConversionExplanation(explanation);
      toast("Conversion successful");
    } catch (error) {
      toast("Invalid decimal number");
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  const convertHexToDecimal = () => {
    if (!hexInput) {
      toast("Please enter a hexadecimal number");
      return;
    }

    setIsCalculating(true);
    try {
      const decimal = parseInt(hexInput, 16);
      if (isNaN(decimal)) {
        toast("Invalid hexadecimal number");
        setIsCalculating(false);
        return;
      }
      
      setDecimalInput(decimal.toString());
      setBinaryInput(decimal.toString(2));
      setOctalInput(decimal.toString(8));

      // Generate explanation
      let explanation = "Hexadecimal to decimal conversion:\n";
      explanation += hexInput.split('').reverse().map((digit, index) => {
        const value = parseInt(digit, 16);
        return `${digit} × 16^${index} = ${value * Math.pow(16, index)}`;
      }).reverse().join('\n');
      
      explanation += `\n\nSum = ${decimal}`;
      setConversionExplanation(explanation);
      toast("Conversion successful");
    } catch (error) {
      toast("Invalid hexadecimal number");
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  const convertOctalToDecimal = () => {
    if (!octalInput) {
      toast("Please enter an octal number");
      return;
    }

    setIsCalculating(true);
    try {
      const decimal = parseInt(octalInput, 8);
      if (isNaN(decimal)) {
        toast("Invalid octal number");
        setIsCalculating(false);
        return;
      }
      
      setDecimalInput(decimal.toString());
      setBinaryInput(decimal.toString(2));
      setHexInput(decimal.toString(16).toUpperCase());

      // Generate explanation
      let explanation = "Octal to decimal conversion:\n";
      explanation += octalInput.split('').reverse().map((digit, index) => {
        return `${digit} × 8^${index} = ${parseInt(digit) * Math.pow(8, index)}`;
      }).reverse().join('\n');
      
      explanation += `\n\nSum = ${decimal}`;
      setConversionExplanation(explanation);
      toast("Conversion successful");
    } catch (error) {
      toast("Invalid octal number");
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  const resetFields = () => {
    setBinaryInput("");
    setDecimalInput("");
    setHexInput("");
    setOctalInput("");
    setConversionExplanation("");
    toast("All fields cleared");
  };

  return (
    <ToolLayout title="Binary-Decimal Converter" icon={<Calculator className="h-6 w-6" />}>
      <Card className="p-4 md:p-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Number System Converter</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Convert between binary, decimal, hexadecimal, and octal number systems.
              </p>
            </div>
            
            <ScrollArea className="w-full">
              <Tabs 
                defaultValue="binary-to-decimal" 
                onValueChange={setActiveTab} 
                className="w-full"
              >
                <TabsList className="inline-flex h-auto p-1">
                  <TabsTrigger value="binary-to-decimal">Binary</TabsTrigger>
                  <TabsTrigger value="decimal-to-binary">Decimal</TabsTrigger>
                  <TabsTrigger value="hex-to-decimal">Hex</TabsTrigger>
                  <TabsTrigger value="octal-to-decimal">Octal</TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />

                <TabsContent value="binary-to-decimal" className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="binary-input">Binary Input (Base-2)</Label>
                    <Input
                      id="binary-input"
                      type="text"
                      placeholder="Enter binary (e.g. 10101)"
                      value={binaryInput}
                      onChange={(e) => handleBinaryInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Binary numbers only use 0 and 1
                    </p>
                  </div>
                  
                  <Button onClick={convertBinaryToDecimal} disabled={isCalculating || !binaryInput} className="w-full">
                    {isCalculating ? "Converting..." : "Convert from Binary"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="decimal-to-binary" className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="decimal-input">Decimal Input (Base-10)</Label>
                    <Input
                      id="decimal-input"
                      type="text"
                      placeholder="Enter decimal (e.g. 42)"
                      value={decimalInput}
                      onChange={(e) => handleDecimalInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Decimal numbers use digits 0-9
                    </p>
                  </div>
                  
                  <Button onClick={convertDecimalToBinary} disabled={isCalculating || !decimalInput} className="w-full">
                    {isCalculating ? "Converting..." : "Convert from Decimal"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="hex-to-decimal" className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="hex-input">Hexadecimal Input (Base-16)</Label>
                    <Input
                      id="hex-input"
                      type="text"
                      placeholder="Enter hexadecimal (e.g. 1A3F)"
                      value={hexInput}
                      onChange={(e) => handleHexInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Hexadecimal numbers use digits 0-9 and letters A-F
                    </p>
                  </div>
                  
                  <Button onClick={convertHexToDecimal} disabled={isCalculating || !hexInput} className="w-full">
                    {isCalculating ? "Converting..." : "Convert from Hexadecimal"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="octal-to-decimal" className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="octal-input">Octal Input (Base-8)</Label>
                    <Input
                      id="octal-input"
                      type="text"
                      placeholder="Enter octal (e.g. 52)"
                      value={octalInput}
                      onChange={(e) => handleOctalInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Octal numbers use digits 0-7
                    </p>
                  </div>
                  
                  <Button onClick={convertOctalToDecimal} disabled={isCalculating || !octalInput} className="w-full">
                    {isCalculating ? "Converting..." : "Convert from Octal"}
                  </Button>
                </TabsContent>
              </Tabs>
            </ScrollArea>
            
            <div className="pt-4 grid grid-cols-1 gap-4">
              <div className="rounded-lg p-4 border">
                <h3 className="text-sm font-medium mb-2">Conversion Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Binary</Label>
                    <div className="p-2 bg-muted/30 rounded border text-sm font-mono break-all">
                      {binaryInput || "0"}
                    </div>
                  </div>
                  <div>
                    <Label>Decimal</Label>
                    <div className="p-2 bg-muted/30 rounded border text-sm font-mono break-all">
                      {decimalInput || "0"}
                    </div>
                  </div>
                  <div>
                    <Label>Hexadecimal</Label>
                    <div className="p-2 bg-muted/30 rounded border text-sm font-mono break-all">
                      {hexInput || "0"}
                    </div>
                  </div>
                  <div>
                    <Label>Octal</Label>
                    <div className="p-2 bg-muted/30 rounded border text-sm font-mono break-all">
                      {octalInput || "0"}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" onClick={resetFields} disabled={isCalculating}>
                Clear All Fields
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {conversionExplanation ? (
              <div className="space-y-4">
                <div className="rounded-lg border overflow-hidden">
                  <div className="p-3 border-b bg-muted/50">
                    <h3 className="font-medium">Conversion Explanation</h3>
                  </div>
                  <div className="p-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {conversionExplanation}
                    </pre>
                  </div>
                </div>
                
                <div className="rounded-lg border overflow-hidden">
                  <div className="p-3 border-b bg-muted/50">
                    <h3 className="font-medium">Number System Comparison</h3>
                  </div>
                  <div className="p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left">Decimal</th>
                          <th className="pb-2 text-left">Binary</th>
                          <th className="pb-2 text-left">Octal</th>
                          <th className="pb-2 text-left">Hex</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15].map((num) => (
                          <tr key={num} className="border-b">
                            <td className="py-1">{num}</td>
                            <td className="py-1">{num.toString(2)}</td>
                            <td className="py-1">{num.toString(8)}</td>
                            <td className="py-1">{num.toString(16).toUpperCase()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Conversion Details</h3>
                <p className="text-muted-foreground">
                  Enter a number and convert it to see the detailed explanation and comparison.
                </p>
              </div>
            )}
            
            <div className="rounded-lg border overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <h3 className="font-medium">About Number Systems</h3>
              </div>
              <div className="divide-y p-4 space-y-3">
                <div>
                  <h4 className="font-medium">Binary (Base-2)</h4>
                  <p className="text-sm text-muted-foreground">
                    Uses only 0 and 1. Each digit position represents a power of 2.
                  </p>
                </div>
                <div className="pt-3">
                  <h4 className="font-medium">Decimal (Base-10)</h4>
                  <p className="text-sm text-muted-foreground">
                    Uses digits 0-9. The standard number system we use in everyday life.
                  </p>
                </div>
                <div className="pt-3">
                  <h4 className="font-medium">Hexadecimal (Base-16)</h4>
                  <p className="text-sm text-muted-foreground">
                    Uses digits 0-9 and letters A-F. Often used in computing to represent binary data in a more human-readable form.
                  </p>
                </div>
                <div className="pt-3">
                  <h4 className="font-medium">Octal (Base-8)</h4>
                  <p className="text-sm text-muted-foreground">
                    Uses digits 0-7. Historically used in computing due to its simple relationship with binary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Applications of Number Systems</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Binary in Computing</h4>
              <p className="text-sm text-muted-foreground">
                Computers use binary internally as it maps perfectly to electronic states (on/off). All data in computers is ultimately stored and processed as binary.
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Hexadecimal in Programming</h4>
              <p className="text-sm text-muted-foreground">
                Used in programming for memory addresses, color codes (e.g., #FF0000 for red), and representing binary data in a more compact form.
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Octal in File Permissions</h4>
              <p className="text-sm text-muted-foreground">
                Unix/Linux systems use octal numbers to represent file permissions. For example, 755 means read/write/execute for owner, read/execute for group and others.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default BinaryDecimalConverter;
