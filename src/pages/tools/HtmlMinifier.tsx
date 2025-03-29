
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FileHtml } from "lucide-react";

const HtmlMinifier = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [removeWhitespace, setRemoveWhitespace] = useState<boolean>(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState<boolean>(true);
  const [minifyCSS, setMinifyCSS] = useState<boolean>(true);
  const [minifyJS, setMinifyJS] = useState<boolean>(true);
  const [removeEmptyAttributes, setRemoveEmptyAttributes] = useState<boolean>(true);

  const handleMinify = () => {
    if (!input.trim()) {
      toast.error("Please enter some HTML to minify");
      return;
    }

    try {
      let result = input;

      // Remove comments
      if (removeComments) {
        result = result.replace(/<!--[\s\S]*?-->/g, "");
      }

      // Remove whitespace
      if (removeWhitespace) {
        result = result.replace(/^\s+|\s+$/gm, "");
      }

      // Collapse whitespace
      if (collapseWhitespace) {
        result = result.replace(/\s{2,}/g, " ");
        result = result.replace(/\n/g, "");
      }

      // Simple CSS minification (just removes whitespace and comments)
      if (minifyCSS) {
        result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, function(match, p1) {
          let css = p1;
          css = css.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove comments
          css = css.replace(/\s+/g, " "); // Replace multiple spaces with a single space
          css = css.replace(/\s*([:;,{}])\s*/g, "$1"); // Remove space before and after :, ;, {, and }
          return "<style>" + css + "</style>";
        });
      }

      // Simple JS minification (just removes whitespace and comments)
      if (minifyJS) {
        result = result.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(match, p1) {
          let js = p1;
          js = js.replace(/\/\/.*?(\n|$)/g, "$1"); // Remove single-line comments
          js = js.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove multi-line comments
          js = js.replace(/\s+/g, " "); // Replace multiple spaces with a single space
          return "<script>" + js + "</script>";
        });
      }

      // Remove empty attributes
      if (removeEmptyAttributes) {
        result = result.replace(/\s+([a-zA-Z-]+)=""/g, "");
      }

      setOutput(result);
      const compressionRatio = ((1 - (result.length / input.length)) * 100).toFixed(2);
      toast.success(`HTML minified! Compression: ${compressionRatio}%`);
    } catch (error) {
      toast.error("Error minifying HTML");
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
    <ToolLayout title="HTML Minifier" extraPadding={true} icon={<FileHtml size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="html-input">Original HTML</Label>
            <Textarea 
              id="html-input"
              placeholder="Paste your HTML code here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono h-64"
            />
          </div>

          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
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
                id="collapse-whitespace" 
                checked={collapseWhitespace}
                onCheckedChange={(checked) => setCollapseWhitespace(checked as boolean)}
              />
              <Label htmlFor="collapse-whitespace">Collapse whitespace</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="minify-css" 
                checked={minifyCSS}
                onCheckedChange={(checked) => setMinifyCSS(checked as boolean)}
              />
              <Label htmlFor="minify-css">Minify inline CSS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="minify-js" 
                checked={minifyJS}
                onCheckedChange={(checked) => setMinifyJS(checked as boolean)}
              />
              <Label htmlFor="minify-js">Minify inline JS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remove-empty-attributes" 
                checked={removeEmptyAttributes}
                onCheckedChange={(checked) => setRemoveEmptyAttributes(checked as boolean)}
              />
              <Label htmlFor="remove-empty-attributes">Remove empty attributes</Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleMinify}>
              Minify HTML
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="html-output">Minified HTML</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                Copy to clipboard
              </Button>
            </div>
            <Textarea 
              id="html-output"
              value={output}
              readOnly
              className="font-mono h-64"
            />
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default HtmlMinifier;
