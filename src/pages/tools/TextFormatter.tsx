
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  Text as TextIcon, 
  Download, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { showRewardedAd } from "@/utils/adUtils";

const TextFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [alignment, setAlignment] = useState<"left" | "center" | "right" | "justify">("left");
  const [lineSpacing, setLineSpacing] = useState<"single" | "1.5" | "double">("single");
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [fixPunctuation, setFixPunctuation] = useState(true);
  const [isFormatting, setIsFormatting] = useState(false);
  const { toast } = useToast();

  const handleIndentChange = (value: string) => {
    setIndentSize(parseInt(value));
  };

  const formatText = async () => {
    if (!input.trim()) {
      toast({
        variant: "destructive",
        title: "Empty input",
        description: "Please enter some text to format.",
      });
      return;
    }

    setIsFormatting(true);
    
    // Show rewarded ad before formatting
    await showRewardedAd();
    
    try {
      let formattedText = input;
      
      // Remove extra whitespace if enabled
      if (removeExtraSpaces) {
        formattedText = formattedText
          .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
          .replace(/^\s+|\s+$/gm, ''); // Trim each line
      }
      
      // Fix punctuation if enabled
      if (fixPunctuation) {
        formattedText = formattedText
          .replace(/\s+([.,;:!?])/g, '$1')  // Remove spaces before punctuation
          .replace(/([.,;:!?])(?=[a-zA-Z])/g, '$1 '); // Add space after punctuation if followed by a letter
      }
      
      // Apply alignment
      const lines = formattedText.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length));
      
      formattedText = lines.map(line => {
        if (alignment === "center") {
          const padding = Math.max(0, Math.floor((maxLineLength - line.length) / 2));
          return ' '.repeat(padding) + line;
        } else if (alignment === "right") {
          const padding = Math.max(0, maxLineLength - line.length);
          return ' '.repeat(padding) + line;
        } else if (alignment === "justify" && line.trim() !== '') {
          const words = line.trim().split(/\s+/);
          if (words.length <= 1) return line; // Can't justify single words
          
          const totalSpacesNeeded = maxLineLength - line.replace(/\s+/g, '').length;
          const gapsBetweenWords = words.length - 1;
          const spacePerGap = Math.floor(totalSpacesNeeded / gapsBetweenWords);
          const extraSpaces = totalSpacesNeeded % gapsBetweenWords;
          
          return words.map((word, index) => {
            if (index === words.length - 1) return word; // Last word doesn't need spaces after
            const extraSpace = index < extraSpaces ? 1 : 0;
            return word + ' '.repeat(spacePerGap + extraSpace);
          }).join('');
        } else {
          // Left alignment (default)
          return line;
        }
      }).join('\n');
      
      // Apply indentation
      if (indentSize > 0) {
        formattedText = formattedText
          .split('\n')
          .map(line => ' '.repeat(indentSize) + line)
          .join('\n');
      }
      
      // Apply line spacing
      if (lineSpacing === "1.5") {
        formattedText = formattedText.split('\n').join('\n\n');
      } else if (lineSpacing === "double") {
        formattedText = formattedText.split('\n').join('\n\n\n');
      }
      
      setOutput(formattedText);
      
      toast({
        title: "Formatting complete",
        description: "Your text has been formatted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Formatting failed",
        description: "An error occurred while formatting the text.",
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "Formatted text has been copied to your clipboard.",
    });
  };

  const downloadText = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your formatted text file is being downloaded.",
    });
  };

  const sortLines = async (direction: 'asc' | 'desc') => {
    if (!input.trim()) return;
    
    // Show rewarded ad before sorting
    await showRewardedAd();
    
    const lines = input.split('\n');
    const sortedLines = direction === 'asc' 
      ? lines.sort((a, b) => a.localeCompare(b))
      : lines.sort((a, b) => b.localeCompare(a));
    
    setInput(sortedLines.join('\n'));
    
    toast({
      title: "Text sorted",
      description: `Lines sorted in ${direction === 'asc' ? 'ascending' : 'descending'} order.`,
    });
  };

  return (
    <ToolLayout
      title="Text Formatter"
      description="Format and beautify your text with options for indentation, line breaks, and spacing."
      icon={<TextIcon size={24} />}
      extraPadding
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Input Text</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => sortLines('asc')}
                  title="Sort A-Z"
                >
                  <ArrowDownWideNarrow className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => sortLines('desc')}
                  title="Sort Z-A"
                >
                  <ArrowUpWideNarrow className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInput('')}
                  title="Clear text"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Enter or paste your text here..."
              className="min-h-[300px] text-base font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Formatted Text</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  disabled={!output}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadText}
                  disabled={!output}
                  title="Download as text file"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="min-h-[300px] p-4 bg-muted/30 rounded-md overflow-auto whitespace-pre-wrap font-mono text-base">
              {output || <span className="text-muted-foreground">Formatted text will appear here...</span>}
            </div>
          </Card>
        </div>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Formatting Options</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="indent-size" className="block mb-2">Indentation</Label>
                <Select value={indentSize.toString()} onValueChange={handleIndentChange}>
                  <SelectTrigger id="indent-size">
                    <SelectValue placeholder="Select indent size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No indentation</SelectItem>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="6">6 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="alignment" className="block mb-2">Text Alignment</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={alignment === "left" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAlignment("left")}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={alignment === "center" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAlignment("center")}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={alignment === "right" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAlignment("right")}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={alignment === "justify" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAlignment("justify")}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="line-spacing" className="block mb-2">Line Spacing</Label>
                <Select value={lineSpacing} onValueChange={(value: "single" | "1.5" | "double") => setLineSpacing(value)}>
                  <SelectTrigger id="line-spacing">
                    <SelectValue placeholder="Select line spacing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="1.5">1.5 lines</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="remove-spaces"
                  checked={removeExtraSpaces}
                  onCheckedChange={setRemoveExtraSpaces}
                />
                <Label htmlFor="remove-spaces">Remove extra spaces</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="fix-punctuation"
                  checked={fixPunctuation}
                  onCheckedChange={setFixPunctuation}
                />
                <Label htmlFor="fix-punctuation">Fix punctuation spacing</Label>
              </div>
            </div>
            
            <div className="flex flex-col justify-end space-y-4">
              <p className="text-sm text-muted-foreground">
                Apply formatting to clean up your text and make it more readable.
              </p>
              
              <Button
                onClick={formatText}
                disabled={isFormatting || !input.trim()}
                className="mt-4"
              >
                {isFormatting ? "Formatting..." : "Format Text"}
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-muted/30">
          <h2 className="text-lg font-semibold mb-2">About Text Formatting</h2>
          <div className="text-sm text-muted-foreground space-y-3">
            <p>Text formatting helps improve readability and presentation of your content. Common formatting techniques include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Consistent indentation to show structure</li>
              <li>Proper spacing around punctuation for readability</li>
              <li>Strategic line breaks to separate content</li>
              <li>Text alignment for visual appeal</li>
            </ul>
            <p>Well-formatted text is easier to read, understand, and share, whether you're working on documentation, emails, or creative writing.</p>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TextFormatter;
