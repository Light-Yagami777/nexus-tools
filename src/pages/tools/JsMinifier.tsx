
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FileCode } from "lucide-react";

const JsMinifier = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [removeWhitespace, setRemoveWhitespace] = useState<boolean>(true);
  const [shortenVariables, setShortenVariables] = useState<boolean>(false);

  const handleMinify = () => {
    if (!input.trim()) {
      toast.error("Please enter some JavaScript to minify");
      return;
    }

    try {
      let result = input;

      // Remove single-line comments
      if (removeComments) {
        result = result.replace(/\/\/.*?(\r\n|\n|$)/g, "$1");
        // Remove multi-line comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, "");
      }

      // Remove whitespace
      if (removeWhitespace) {
        result = result.replace(/^\s+|\s+$/gm, ""); // Trim each line
        result = result.replace(/\s+/g, " "); // Replace multiple spaces with single space
        result = result.replace(/\s*([=:+\-*/%&|^!?<>{}[\];(),.~])\s*/g, "$1"); // Remove space around operators
        result = result.replace(/\s*\n\s*/g, "\n"); // Remove space around newlines
        result = result.replace(/\n+/g, "\n"); // Replace multiple newlines with a single one
        result = result.replace(/\n/g, ""); // Remove all newlines
      }

      // Note: Proper variable shortening would require a JavaScript parser
      // This is just a simplified demonstration
      if (shortenVariables) {
        toast.warning("Variable shortening is a complex operation and might not work perfectly!");
        // This is a very simplistic approach that doesn't handle scope, etc.
        const varList: string[] = [];
        result.replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (_, varName) => {
          if (!varList.includes(varName)) {
            varList.push(varName);
          }
          return "";
        });

        // Replace variables with shorter names (a, b, c, etc.)
        for (let i = 0; i < varList.length; i++) {
          const shortName = getShortVariableName(i);
          const regex = new RegExp(`\\b${varList[i]}\\b`, "g");
          result = result.replace(regex, shortName);
        }
      }

      setOutput(result);
      const compressionRatio = ((1 - (result.length / input.length)) * 100).toFixed(2);
      toast.success(`JavaScript minified! Compression: ${compressionRatio}%`);
    } catch (error) {
      toast.error("Error minifying JavaScript");
      console.error(error);
    }
  };

  // Generate short variable names (a, b, ..., z, aa, ab, ...)
  const getShortVariableName = (index: number): string => {
    const baseChars = "abcdefghijklmnopqrstuvwxyz";
    if (index < baseChars.length) {
      return baseChars[index];
    }
    const quotient = Math.floor(index / baseChars.length);
    const remainder = index % baseChars.length;
    return getShortVariableName(quotient - 1) + baseChars[remainder];
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCopy = () => {
    if (!output) {
      toast.error("Nothing to copy");
      return;
    }
    
    navigator.clipboard.writeText(output).then(() => {
      toast.success("Copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  return (
    <ToolLayout title="JavaScript Minifier" extraPadding={true} icon={<FileCode size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="js-input">Original JavaScript</Label>
            <Textarea 
              id="js-input"
              placeholder="Paste your JavaScript code here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono h-64"
            />
          </div>

          <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remove-comments" 
                checked={removeComments}
                onCheckedChange={(checked) => setRemoveComments(checked as boolean)}
              />
              <Label htmlFor="remove-comments">Remove comments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remove-whitespace" 
                checked={removeWhitespace}
                onCheckedChange={(checked) => setRemoveWhitespace(checked as boolean)}
              />
              <Label htmlFor="remove-whitespace">Remove whitespace</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="shorten-variables" 
                checked={shortenVariables}
                onCheckedChange={(checked) => setShortenVariables(checked as boolean)}
              />
              <Label htmlFor="shorten-variables">Shorten variables (experimental)</Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleMinify}>
              Minify JavaScript
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="js-output">Minified JavaScript</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                Copy to clipboard
              </Button>
            </div>
            <Textarea 
              id="js-output"
              value={output}
              readOnly
              className="font-mono h-64"
            />
          </div>

          {output && (
            <div className="text-sm text-muted-foreground">
              <p>Original size: {input.length} characters</p>
              <p>Minified size: {output.length} characters</p>
              <p>Saved: {input.length - output.length} characters ({((1 - (output.length / input.length)) * 100).toFixed(2)}%)</p>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default JsMinifier;
