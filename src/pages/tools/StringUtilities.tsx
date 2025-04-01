import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Text, Search, RefreshCw, ArrowRightLeft, Scissors } from "lucide-react";

const StringUtilities = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [extractPattern, setExtractPattern] = useState("");
  const [trimOption, setTrimOption] = useState<"both" | "start" | "end" | "all">("both");

  const copyToClipboard = () => {
    if (!output) {
      toast("No output to copy", {
        description: "Process some text first."
      });
      return;
    }
    
    navigator.clipboard.writeText(output)
      .then(() => {
        toast("Copied to clipboard", {
          description: "Output has been copied to your clipboard."
        });
      })
      .catch(err => {
        toast("Failed to copy", {
          description: "Could not copy text to clipboard.",
          variant: "destructive"
        });
      });
  };

  const handleReplace = () => {
    if (!input) {
      toast("Empty input", {
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }

    if (!findText) {
      toast("Find text is empty", {
        description: "Please enter text to find.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a regex with global flag for multiple replacements
      const regex = new RegExp(findText, 'g');
      const result = input.replace(regex, replaceText);
      
      setOutput(result);
      
      const count = (input.match(regex) || []).length;
      toast("Replacement complete", {
        description: `Replaced ${count} occurrence${count !== 1 ? 's' : ''}.`
      });
    } catch (error) {
      toast("Replacement failed", {
        description: "An error occurred. Check if your find text is valid.",
        variant: "destructive"
      });
    }
  };

  const handleTrim = () => {
    if (!input) {
      toast("Empty input", {
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }
    
    let result = input;
    
    switch (trimOption) {
      case "start":
        result = input.replace(/^\s+/, '');
        break;
      case "end":
        result = input.replace(/\s+$/, '');
        break;
      case "both":
        result = input.trim();
        break;
      case "all":
        result = input.replace(/\s+/g, '');
        break;
    }
    
    setOutput(result);
    
    toast("Trim complete", {
      description: "Text has been trimmed according to your selection."
    });
  };

  const handleExtract = () => {
    if (!input) {
      toast("Empty input", {
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }

    if (!extractPattern) {
      toast("Pattern is empty", {
        description: "Please enter a pattern to extract.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Try to create and use the regex pattern
      const regex = new RegExp(extractPattern, 'g');
      const matches = input.match(regex);
      
      if (matches && matches.length > 0) {
        setOutput(matches.join('\n'));
        toast("Extraction complete", {
          description: `Extracted ${matches.length} match${matches.length !== 1 ? 'es' : ''}.`
        });
      } else {
        setOutput('');
        toast("No matches found", {
          description: "The pattern did not match any text.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast("Extraction failed", {
        description: "Invalid regular expression or an error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleReverse = () => {
    if (!input) {
      toast("Empty input", {
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }
    
    // Reverse the string
    const result = input.split('').reverse().join('');
    setOutput(result);
    
    toast("Reverse complete", {
      description: "Text has been reversed."
    });
  };

  const handleRandomCase = () => {
    if (!input) {
      toast("Empty input", {
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }
    
    // Convert text to random case
    const result = input.split('').map(char => {
      return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
    }).join('');
    
    setOutput(result);
    
    toast("Random case applied", {
      description: "Text has been converted to random case."
    });
  };

  const handleWordCount = () => {
    if (!input) {
      toast("Empty input", {
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }
    
    // Count words, characters, lines
    const words = input.split(/\s+/).filter(word => word.length > 0).length;
    const chars = input.length;
    const lines = input.split('\n').length;
    
    setOutput(`Words: ${words}\nCharacters: ${chars}\nLines: ${lines}`);
    
    toast("Count complete", {
      description: `Found ${words} words in your text.`
    });
  };

  return (
    <ToolLayout
      title="String Utilities"
      description="Various string manipulation utilities"
      icon={<Text size={24} />}
      extraPadding
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Input Text</h2>
            <Textarea
              placeholder="Enter or paste your text here..."
              className="min-h-[200px] text-base font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Output</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                disabled={!output}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </Button>
            </div>
            <div className="min-h-[200px] p-4 bg-muted/30 rounded-md overflow-auto whitespace-pre-wrap font-mono border">
              {output || <span className="text-muted-foreground">Processed text will appear here...</span>}
            </div>
          </Card>
        </div>
        
        <Card className="p-6">
          <Tabs defaultValue="replace" className="w-full">
            <TabsList className="mb-4 grid grid-cols-2 lg:grid-cols-6 w-full">
              <TabsTrigger value="replace" className="flex items-center gap-1">
                <ArrowRightLeft className="h-4 w-4" />
                <span>Replace</span>
              </TabsTrigger>
              <TabsTrigger value="trim" className="flex items-center gap-1">
                <Scissors className="h-4 w-4" />
                <span>Trim</span>
              </TabsTrigger>
              <TabsTrigger value="extract" className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                <span>Extract</span>
              </TabsTrigger>
              <TabsTrigger value="reverse" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>Reverse</span>
              </TabsTrigger>
              <TabsTrigger value="randomCase" className="flex items-center gap-1">
                <Text className="h-4 w-4" />
                <span>Random Case</span>
              </TabsTrigger>
              <TabsTrigger value="wordCount" className="flex items-center gap-1">
                <Text className="h-4 w-4" />
                <span>Word Count</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="replace">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="find-text">Find</Label>
                    <Input
                      id="find-text"
                      placeholder="Text to find"
                      value={findText}
                      onChange={(e) => setFindText(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="replace-text">Replace with</Label>
                    <Input
                      id="replace-text"
                      placeholder="Replacement text"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button onClick={handleReplace} disabled={!input || !findText}>
                  Replace Text
                </Button>
                
                <div className="text-sm text-muted-foreground mt-2">
                  <p>Finds all occurrences of the specified text and replaces them with the replacement text.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trim">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button 
                    variant={trimOption === "both" ? "default" : "outline"} 
                    onClick={() => setTrimOption("both")}
                    className="h-auto py-4 flex flex-col gap-1"
                  >
                    <span>Both Ends</span>
                    <span className="text-xs opacity-80">Remove spaces from start and end</span>
                  </Button>
                  
                  <Button 
                    variant={trimOption === "start" ? "default" : "outline"} 
                    onClick={() => setTrimOption("start")}
                    className="h-auto py-4 flex flex-col gap-1"
                  >
                    <span>Start Only</span>
                    <span className="text-xs opacity-80">Remove spaces from start</span>
                  </Button>
                  
                  <Button 
                    variant={trimOption === "end" ? "default" : "outline"} 
                    onClick={() => setTrimOption("end")}
                    className="h-auto py-4 flex flex-col gap-1"
                  >
                    <span>End Only</span>
                    <span className="text-xs opacity-80">Remove spaces from end</span>
                  </Button>
                  
                  <Button 
                    variant={trimOption === "all" ? "default" : "outline"} 
                    onClick={() => setTrimOption("all")}
                    className="h-auto py-4 flex flex-col gap-1"
                  >
                    <span>All Spaces</span>
                    <span className="text-xs opacity-80">Remove all whitespace</span>
                  </Button>
                </div>
                
                <Button onClick={handleTrim} disabled={!input}>
                  Trim Text
                </Button>
                
                <div className="text-sm text-muted-foreground mt-2">
                  <p>Removes whitespace from the text according to the selected option.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="extract">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="extract-pattern">Regular Expression Pattern</Label>
                  <Input
                    id="extract-pattern"
                    placeholder="e.g., \d+ for numbers, [A-Za-z]+ for words"
                    value={extractPattern}
                    onChange={(e) => setExtractPattern(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleExtract} disabled={!input || !extractPattern}>
                  Extract Matches
                </Button>
                
                <div className="text-sm text-muted-foreground mt-2">
                  <p>Extracts all text that matches the specified regular expression pattern.</p>
                  <p className="mt-1">Common patterns:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><code>\d+</code> - Find all numbers</li>
                    <li><code>[A-Za-z]+</code> - Find all words</li>
                    <li><code>\b\w+@\w+\.\w+\b</code> - Find email addresses</li>
                    <li><code>https?://\S+</code> - Find URLs</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reverse">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Reverses the input text, character by character. For example, "Hello World" becomes "dlroW olleH".
                </p>
                
                <Button onClick={handleReverse} disabled={!input}>
                  Reverse Text
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="randomCase">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Randomly changes the case of each character in the text, creating a mixed-case result.
                </p>
                
                <Button onClick={handleRandomCase} disabled={!input}>
                  Apply Random Case
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="wordCount">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Counts the number of words, characters, and lines in the input text.
                </p>
                
                <Button onClick={handleWordCount} disabled={!input}>
                  Count Words & Characters
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        
        <Card className="p-6 bg-muted/30">
          <h2 className="text-lg font-semibold mb-2">About String Utilities</h2>
          <div className="text-sm text-muted-foreground space-y-3">
            <p>String utilities are essential tools for text manipulation tasks. Common use cases include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Data cleaning and preparation</li>
              <li>Text formatting for various platforms</li>
              <li>Content extraction from large documents</li>
              <li>Quick analysis of text content</li>
              <li>Generating modified text for creative or technical purposes</li>
            </ul>
            <p>These utilities save time and reduce errors when working with text data, whether for programming, content creation, or data analysis.</p>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default StringUtilities;
