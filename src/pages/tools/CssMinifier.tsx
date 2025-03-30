import React from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Code } from 'lucide-react';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const CssMinifier = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [removeWhitespace, setRemoveWhitespace] = useState<boolean>(true);
  const [removeSemicolonNewlines, setRemoveSemicolonNewlines] = useState<boolean>(true);

  const handleMinify = () => {
    if (!input.trim()) {
      toast.error("Please enter some CSS to minify");
      return;
    }

    try {
      let result = input;

      // Remove comments
      if (removeComments) {
        result = result.replace(/\/\*[\s\S]*?\*\//g, "");
      }

      // Remove whitespace
      if (removeWhitespace) {
        result = result.replace(/\s+/g, " "); // Replace multiple spaces with single space
        result = result.replace(/\s*([{}:;,])\s*/g, "$1"); // Remove space before and after special chars
        result = result.replace(/;}/g, "}"); // Remove unnecessary semicolons
        result = result.replace(/\s+(!important)/g, "$1"); // Remove space before !important
      }

      // Remove newlines and unnecessary semicolons
      if (removeSemicolonNewlines) {
        result = result.replace(/[\r\n]/g, ""); // Remove newlines
        result = result.replace(/^\s+|\s+$/g, ""); // Trim leading/trailing whitespace
      }

      setOutput(result);
      const compressionRatio = ((1 - (result.length / input.length)) * 100).toFixed(2);
      toast.success(`CSS minified! Compression: ${compressionRatio}%`);
    } catch (error) {
      toast.error("Error minifying CSS");
      console.error(error);
    }
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
    <ToolLayout 
      title="CSS Minifier" 
      description="Minify CSS code to reduce file size"
      icon={<Code className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="css-input">Original CSS</Label>
            <Textarea 
              id="css-input"
              placeholder="Paste your CSS code here..."
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
                id="remove-semicolon-newlines" 
                checked={removeSemicolonNewlines}
                onCheckedChange={(checked) => setRemoveSemicolonNewlines(checked as boolean)}
              />
              <Label htmlFor="remove-semicolon-newlines">Remove newlines</Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleMinify}>
              Minify CSS
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="css-output">Minified CSS</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                Copy to clipboard
              </Button>
            </div>
            <Textarea 
              id="css-output"
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

export default CssMinifier;
