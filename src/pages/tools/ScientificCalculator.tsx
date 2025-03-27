
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";

interface HistoryItem {
  expression: string;
  result: string;
}

const ScientificCalculator = () => {
  const [display, setDisplay] = useState<string>("0");
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expression, setExpression] = useState<string>("");
  const [isNewOperation, setIsNewOperation] = useState<boolean>(true);
  const [degreeMode, setDegreeMode] = useState<boolean>(true);
  const [showExpressionDisplay, setShowExpressionDisplay] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("standard");

  const appendToDisplay = (value: string) => {
    if (isNewOperation) {
      setDisplay(value);
      setExpression(value);
      setIsNewOperation(false);
    } else {
      setDisplay(display === "0" ? value : display + value);
      setExpression(expression === "0" ? value : expression + value);
    }
  };

  const appendOperator = (operator: string) => {
    let op = operator;
    
    // Convert special operators for calculation
    if (operator === '×') op = '*';
    if (operator === '÷') op = '/';
    
    if (isNewOperation) {
      setExpression(display + op);
      setIsNewOperation(false);
    } else {
      // If the last character is an operator, replace it
      if (['+', '-', '*', '/', '×', '÷'].includes(expression.slice(-1))) {
        setExpression(expression.slice(0, -1) + op);
      } else {
        setExpression(expression + op);
      }
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setExpression("");
    setIsNewOperation(true);
  };

  const clearEntry = () => {
    setDisplay("0");
    setIsNewOperation(true);
  };

  const toggleSign = () => {
    if (display === "0") return;
    
    if (display.startsWith("-")) {
      setDisplay(display.slice(1));
    } else {
      setDisplay("-" + display);
    }
    
    if (isNewOperation) {
      setExpression("-" + display);
    } else {
      // Find the last number in the expression and toggle its sign
      const lastNumberRegex = /(-?\d*\.?\d+)$/;
      const match = expression.match(lastNumberRegex);
      
      if (match) {
        const lastNumber = match[0];
        const lastNumberIndex = expression.lastIndexOf(lastNumber);
        
        if (lastNumber.startsWith("-")) {
          setExpression(
            expression.substring(0, lastNumberIndex) + 
            lastNumber.slice(1)
          );
        } else {
          setExpression(
            expression.substring(0, lastNumberIndex) + 
            "-" + lastNumber
          );
        }
      }
    }
  };

  const addDecimal = () => {
    if (isNewOperation) {
      setDisplay("0.");
      setExpression("0.");
      setIsNewOperation(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
      setExpression(expression + ".");
    }
  };

  const calculateResult = () => {
    try {
      let exp = expression.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Replace special functions in the expression
      exp = exp.replace(/sin\(/g, `Math.${degreeMode ? 'sin(' : 'sin(Math.PI / 180 * '}`);
      exp = exp.replace(/cos\(/g, `Math.${degreeMode ? 'cos(' : 'cos(Math.PI / 180 * '}`);
      exp = exp.replace(/tan\(/g, `Math.${degreeMode ? 'tan(' : 'tan(Math.PI / 180 * '}`);
      exp = exp.replace(/log\(/g, 'Math.log10(');
      exp = exp.replace(/ln\(/g, 'Math.log(');
      exp = exp.replace(/sqrt\(/g, 'Math.sqrt(');
      exp = exp.replace(/π/g, 'Math.PI');
      exp = exp.replace(/e/g, 'Math.E');
      
      // Calculate power
      exp = exp.replace(/\^/g, '**');
      
      // eslint-disable-next-line no-eval
      const result = eval(exp);
      const formattedResult = Number.isInteger(result) 
        ? result.toString() 
        : result.toFixed(8).replace(/\.?0+$/, "");
      
      setDisplay(formattedResult);
      setHistory([...history, { expression: expression, result: formattedResult }]);
      setIsNewOperation(true);
      
      return formattedResult;
    } catch (error) {
      setDisplay("Error");
      setIsNewOperation(true);
      return "Error";
    }
  };

  const calculatePercentage = () => {
    try {
      // If we're in the middle of an operation (e.g., 100 + 5%), calculate 5% of 100
      const lastNumberRegex = /(-?\d*\.?\d+)$/;
      const match = expression.match(lastNumberRegex);
      
      if (match && expression.includes('+') || expression.includes('-') || 
          expression.includes('*') || expression.includes('/') || 
          expression.includes('×') || expression.includes('÷')) {
        
        const lastNumber = parseFloat(match[0]);
        const restOfExpression = expression.substring(0, expression.lastIndexOf(match[0]));
        
        // Calculate the value before the operator
        const prevValue = eval(restOfExpression.replace(/×/g, '*').replace(/÷/g, '/').slice(0, -1));
        
        // Calculate percentage based on the operator
        let percentValue;
        const lastOperator = restOfExpression.slice(-1);
        
        if (lastOperator === '+' || lastOperator === '-') {
          // For + and -, calculate percent of the previous value
          percentValue = (prevValue * lastNumber) / 100;
        } else {
          // For * and /, just convert to decimal
          percentValue = lastNumber / 100;
        }
        
        const newExpression = restOfExpression + percentValue;
        setExpression(newExpression);
        
        // Calculate the final result
        const result = eval(newExpression.replace(/×/g, '*').replace(/÷/g, '/'));
        const formattedResult = Number.isInteger(result) 
          ? result.toString() 
          : result.toFixed(8).replace(/\.?0+$/, "");
        
        setDisplay(formattedResult);
        setHistory([...history, { expression: expression + '%', result: formattedResult }]);
        setIsNewOperation(true);
      } else {
        // Simple percentage calculation (divide by 100)
        const value = parseFloat(display) / 100;
        const formattedValue = Number.isInteger(value)
          ? value.toString()
          : value.toFixed(8).replace(/\.?0+$/, "");
        
        setDisplay(formattedValue);
        setExpression(formattedValue);
        setHistory([...history, { expression: display + '%', result: formattedValue }]);
        setIsNewOperation(true);
      }
    } catch (error) {
      setDisplay("Error");
      setIsNewOperation(true);
    }
  };

  const memoryStore = () => {
    setMemory(parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setIsNewOperation(true);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addScientificFunction = (func: string) => {
    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
      case 'sqrt':
        setExpression(expression + func + '(');
        break;
      case 'square':
        if (isNewOperation) {
          setExpression(display + '^2');
          const result = Math.pow(parseFloat(display), 2);
          setDisplay(result.toString());
        } else {
          setExpression(expression + '^2');
        }
        break;
      case 'cube':
        if (isNewOperation) {
          setExpression(display + '^3');
          const result = Math.pow(parseFloat(display), 3);
          setDisplay(result.toString());
        } else {
          setExpression(expression + '^3');
        }
        break;
      case 'pow':
        appendOperator('^');
        break;
      case 'exp':
        appendOperator('e');
        break;
      case 'pi':
        appendToDisplay('π');
        break;
      case 'e':
        appendToDisplay('e');
        break;
      case 'factorial':
        if (isNewOperation) {
          const n = parseInt(display);
          if (n >= 0 && Number.isInteger(n)) {
            let result = 1;
            for (let i = 2; i <= n; i++) {
              result *= i;
            }
            setDisplay(result.toString());
            setExpression(display + '!');
            setHistory([...history, { expression: display + '!', result: result.toString() }]);
          } else {
            setDisplay("Error");
          }
        }
        break;
      case 'reciprocal':
        if (isNewOperation) {
          const value = parseFloat(display);
          if (value !== 0) {
            const result = 1 / value;
            setDisplay(result.toString());
            setExpression('1/' + display);
            setHistory([...history, { expression: '1/' + display, result: result.toString() }]);
          } else {
            setDisplay("Error");
          }
        }
        break;
    }
  };

  const handleKeyboardInput = (e: KeyboardEvent) => {
    const key = e.key;
    
    if (/[0-9]/.test(key)) {
      appendToDisplay(key);
    } else if (key === '.') {
      addDecimal();
    } else if (key === '+' || key === '-') {
      appendOperator(key);
    } else if (key === '*') {
      appendOperator('×');
    } else if (key === '/') {
      appendOperator('÷');
    } else if (key === 'Enter' || key === '=') {
      calculateResult();
    } else if (key === 'Escape') {
      clearDisplay();
    } else if (key === 'Backspace') {
      if (!isNewOperation && display !== "0") {
        setDisplay(display.slice(0, -1) || "0");
        setExpression(expression.slice(0, -1) || "");
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardInput);
    return () => {
      window.removeEventListener('keydown', handleKeyboardInput);
    };
  }, [display, expression, isNewOperation]);

  const buttonClass = `h-12 md:h-14 transition-all active:scale-95 border bg-background hover:bg-muted`;

  return (
    <ToolLayout title="Scientific Calculator">
      <Card className="p-4 md:p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-28 p-3 border rounded-lg flex flex-col items-end justify-end bg-muted/20">
              {showExpressionDisplay && (
                <div className="w-full h-6 text-right text-sm text-muted-foreground overflow-auto whitespace-nowrap">
                  {expression}
                </div>
              )}
              <div className="w-full text-right text-3xl font-medium overflow-auto whitespace-nowrap">
                {display}
              </div>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="scientific">Scientific</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="mt-2">
                <div className="grid grid-cols-4 gap-2">
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={memoryClear}
                  >
                    MC
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={memoryRecall}
                  >
                    MR
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={memoryAdd}
                  >
                    M+
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={memorySubtract}
                  >
                    M-
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={clearEntry}
                  >
                    CE
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={clearDisplay}
                  >
                    C
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => {
                      if (!isNewOperation && display !== "0") {
                        setDisplay(display.slice(0, -1) || "0");
                        setExpression(expression.slice(0, -1) || "");
                      }
                    }}
                  >
                    ⌫
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendOperator('÷')}
                  >
                    ÷
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('7')}
                  >
                    7
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('8')}
                  >
                    8
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('9')}
                  >
                    9
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendOperator('×')}
                  >
                    ×
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('4')}
                  >
                    4
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('5')}
                  >
                    5
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('6')}
                  >
                    6
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendOperator('-')}
                  >
                    -
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('1')}
                  >
                    1
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('2')}
                  >
                    2
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('3')}
                  >
                    3
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendOperator('+')}
                  >
                    +
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={toggleSign}
                  >
                    ±
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('0')}
                  >
                    0
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={addDecimal}
                  >
                    .
                  </Button>
                  <Button 
                    variant="default" 
                    className={buttonClass} 
                    onClick={calculateResult}
                  >
                    =
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={calculatePercentage}
                  >
                    %
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('square')}
                  >
                    x²
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('sqrt')}
                  >
                    √
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('reciprocal')}
                  >
                    1/x
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="scientific" className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm">
                    <Button
                      variant={degreeMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDegreeMode(true)}
                      className="mr-2"
                    >
                      DEG
                    </Button>
                    <Button
                      variant={!degreeMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDegreeMode(false)}
                    >
                      RAD
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowExpressionDisplay(!showExpressionDisplay)}
                    >
                      {showExpressionDisplay ? "Hide Expression" : "Show Expression"}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('square')}
                  >
                    x²
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('cube')}
                  >
                    x³
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('pow')}
                  >
                    x^y
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('exp')}
                  >
                    e^x
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('reciprocal')}
                  >
                    1/x
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('sqrt')}
                  >
                    √
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => {
                      setExpression(expression + '(');
                    }}
                  >
                    (
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => {
                      setExpression(expression + ')');
                    }}
                  >
                    )
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('factorial')}
                  >
                    n!
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={calculatePercentage}
                  >
                    %
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('sin')}
                  >
                    sin
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('cos')}
                  >
                    cos
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('tan')}
                  >
                    tan
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('pi')}
                  >
                    π
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('e')}
                  >
                    e
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('log')}
                  >
                    log
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => addScientificFunction('ln')}
                  >
                    ln
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={clearDisplay}
                  >
                    C
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => {
                      if (!isNewOperation && display !== "0") {
                        setDisplay(display.slice(0, -1) || "0");
                        setExpression(expression.slice(0, -1) || "");
                      }
                    }}
                  >
                    ⌫
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendOperator('÷')}
                  >
                    ÷
                  </Button>
                  
                  {/* Standard number pad */}
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={memoryClear}
                  >
                    MC
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('7')}
                  >
                    7
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('8')}
                  >
                    8
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('9')}
                  >
                    9
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendOperator('×')}
                  >
                    ×
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={memoryRecall}
                  >
                    MR
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('4')}
                  >
                    4
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('5')}
                  >
                    5
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('6')}
                  >
                    6
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendOperator('-')}
                  >
                    -
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={memoryAdd}
                  >
                    M+
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('1')}
                  >
                    1
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('2')}
                  >
                    2
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('3')}
                  >
                    3
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendOperator('+')}
                  >
                    +
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={memorySubtract}
                  >
                    M-
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={toggleSign}
                  >
                    ±
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={() => appendToDisplay('0')}
                  >
                    0
                  </Button>
                  <Button 
                    variant="outline" 
                    className={buttonClass} 
                    onClick={addDecimal}
                  >
                    .
                  </Button>
                  <Button 
                    variant="default" 
                    className={buttonClass} 
                    onClick={calculateResult}
                  >
                    =
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4 h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">History</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearHistory}
                >
                  Clear
                </Button>
              </div>
              
              <div className="space-y-2 h-[calc(100%-40px)] overflow-y-auto pr-2">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                    <Calculator size={32} className="mb-2 text-muted-foreground/70" />
                    <p>No calculations yet</p>
                    <p className="text-xs mt-1">Your calculation history will appear here</p>
                  </div>
                ) : (
                  history.map((item, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setDisplay(item.result);
                        setExpression(item.expression);
                        setIsNewOperation(true);
                      }}
                    >
                      <div className="text-sm text-muted-foreground">{item.expression}</div>
                      <div className="text-lg font-medium">{item.result}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default ScientificCalculator;
