
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw, CornerDownLeft } from 'lucide-react';
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const StringUtilities = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeTab, setActiveTab] = useState('replace');
  
  // Search and replace state
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  
  // Case conversion type
  const [caseType, setCaseType] = useState('uppercase');
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProcess = () => {
    setIsProcessing(true);
    
    try {
      switch(activeTab) {
        case 'replace':
          handleReplace();
          break;
        case 'case':
          handleCaseChange();
          break;
        case 'trim':
          handleTrim();
          break;
        case 'extract':
          handleExtract();
          break;
        case 'reverse':
          handleReverse();
          break;
        case 'count':
          handleWordCount();
          break;
        case 'random':
          handleRandomCase();
          break;
      }
      
      toast.success('Text processed successfully');
    } catch (error) {
      console.error('Error processing text:', error);
      toast.error('Failed to process text');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReplace = () => {
    if (!searchText) {
      toast.error('Please enter search text');
      return;
    }
    
    const result = inputText.replace(new RegExp(searchText, 'g'), replaceText);
    setOutputText(result);
  };
  
  const handleCaseChange = () => {
    switch(caseType) {
      case 'uppercase':
        setOutputText(inputText.toUpperCase());
        break;
      case 'lowercase':
        setOutputText(inputText.toLowerCase());
        break;
      case 'capitalize':
        setOutputText(
          inputText.replace(/\b\w/g, c => c.toUpperCase())
        );
        break;
      case 'sentence':
        setOutputText(
          inputText.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
        );
        break;
      case 'alternating':
        setOutputText(
          inputText.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('')
        );
        break;
    }
  };
  
  const handleTrim = () => {
    setOutputText(inputText.trim());
  };
  
  const handleExtract = () => {
    // Extract numbers
    const numbers = inputText.match(/\d+/g);
    if (numbers) {
      setOutputText(numbers.join(', '));
    } else {
      setOutputText('No numbers found');
    }
  };
  
  const handleReverse = () => {
    setOutputText(inputText.split('').reverse().join(''));
  };
  
  const handleWordCount = () => {
    const words = inputText.trim().split(/\s+/).filter(Boolean).length;
    const chars = inputText.length;
    const charsNoSpaces = inputText.replace(/\s+/g, '').length;
    const lines = inputText.split('\n').length;
    
    setOutputText(`Words: ${words}\nCharacters: ${chars}\nCharacters (no spaces): ${charsNoSpaces}\nLines: ${lines}`);
  };
  
  const handleRandomCase = () => {
    setOutputText(
      inputText.split('').map(c => 
        Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()
      ).join('')
    );
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };
  
  const swapTexts = () => {
    setInputText(outputText);
  };

  return (
    <ToolLayout
      title="String Utilities"
      description="Transform, manipulate and analyze text with various string operations"
    >
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium">Input Text</label>
              <Textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="min-h-[150px] resize-none"
                placeholder="Enter text to process..."
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="w-full">
          <Tabs defaultValue="replace" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-2">
              <ScrollArea className="w-full" orientation="horizontal">
                <div className="inline-flex min-w-max">
                  <TabsList>
                    <TabsTrigger value="replace">Replace</TabsTrigger>
                    <TabsTrigger value="trim">Trim</TabsTrigger>
                    <TabsTrigger value="extract">Extract</TabsTrigger>
                    <TabsTrigger value="reverse">Reverse</TabsTrigger>
                    <TabsTrigger value="random">Random Case</TabsTrigger>
                    <TabsTrigger value="count">Word Count</TabsTrigger>
                    <TabsTrigger value="case">Case Change</TabsTrigger>
                  </TabsList>
                </div>
              </ScrollArea>
            </div>
            
            <Card className="mt-4">
              <CardContent className="p-6">
                <TabsContent value="replace" className="space-y-4 mt-0">
                  <div>
                    <label className="block text-sm font-medium mb-2">Find</label>
                    <Input
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      placeholder="Text to find"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Replace with</label>
                    <Input
                      value={replaceText}
                      onChange={e => setReplaceText(e.target.value)}
                      placeholder="Replacement text"
                    />
                  </div>
                  
                  <Button onClick={handleProcess} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : 'Replace Text'}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Finds all occurrences of the specified text and replaces them with the replacement text.
                  </p>
                </TabsContent>
                
                <TabsContent value="case" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button 
                      variant={caseType === 'uppercase' ? 'default' : 'outline'}
                      onClick={() => setCaseType('uppercase')}
                      className="w-full"
                    >
                      UPPERCASE
                    </Button>
                    <Button 
                      variant={caseType === 'lowercase' ? 'default' : 'outline'}
                      onClick={() => setCaseType('lowercase')}
                      className="w-full"
                    >
                      lowercase
                    </Button>
                    <Button 
                      variant={caseType === 'capitalize' ? 'default' : 'outline'}
                      onClick={() => setCaseType('capitalize')}
                      className="w-full"
                    >
                      Title Case
                    </Button>
                    <Button 
                      variant={caseType === 'sentence' ? 'default' : 'outline'}
                      onClick={() => setCaseType('sentence')}
                      className="w-full"
                    >
                      Sentence case
                    </Button>
                    <Button 
                      variant={caseType === 'alternating' ? 'default' : 'outline'}
                      onClick={() => setCaseType('alternating')}
                      className="w-full sm:col-span-2"
                    >
                      aLtErNaTiNg
                    </Button>
                  </div>
                  
                  <Button onClick={handleProcess} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : 'Change Case'}
                  </Button>
                </TabsContent>
                
                <TabsContent value="trim" className="space-y-4 mt-0">
                  <Button onClick={handleProcess} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : 'Trim Whitespace'}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Removes whitespace from the beginning and end of the text.
                  </p>
                </TabsContent>
                
                <TabsContent value="extract" className="space-y-4 mt-0">
                  <Button onClick={handleProcess} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : 'Extract Numbers'}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Extracts all numbers from the text.
                  </p>
                </TabsContent>
                
                <TabsContent value="reverse" className="space-y-4 mt-0">
                  <Button onClick={handleProcess} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : 'Reverse Text'}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Reverses all characters in the text.
                  </p>
                </TabsContent>
                
                <TabsContent value="count" className="space-y-4 mt-0">
                  <Button onClick={handleProcess} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : 'Count Words & Characters'}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Counts words, characters, and lines in the text.
                  </p>
                </TabsContent>
                
                <TabsContent value="random" className="space-y-4 mt-0">
                  <Button onClick={handleProcess} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : 'Randomize Case'}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Creates text with randomly mixed uppercase and lowercase letters.
                  </p>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">Output</label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={swapTexts}
                    title="Use as input"
                  >
                    <CornerDownLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[150px] resize-none"
                placeholder="Results will appear here..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default StringUtilities;
