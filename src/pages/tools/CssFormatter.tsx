
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const CssFormatter = () => {
  const [css, setCss] = useState("");
  const [formattedCss, setFormattedCss] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const formatCss = () => {
    if (!css.trim()) {
      toast.error("Please enter some CSS to format");
      return;
    }

    try {
      // Basic CSS formatting, a real implementation would use a proper CSS parser
      let result = css
        // Remove extra whitespace
        .replace(/\s+/g, " ")
        // Remove spaces after colons and commas
        .replace(/:\s+/g, ": ")
        .replace(/,\s+/g, ", ")
        // Insert line break after closing brace and trim
        .replace(/}/g, "}\n")
        .trim();

      // Format each rule on its own line with proper indentation
      result = result.replace(/{/g, " {\n  ");
      result = result.replace(/;/g, ";\n  ");
      
      // Clean up: remove extra empty lines inside rules
      result = result.replace(/\n\s*\n/g, "\n");
      
      // Fix the last rule's closing brace indentation
      result = result.replace(/\n  }/g, "\n}");

      setFormattedCss(result);
      toast.success("CSS formatted successfully");
    } catch (error) {
      console.error("Error formatting CSS:", error);
      toast.error("Failed to format CSS. Please check your input.");
    }
  };

  const copyToClipboard = () => {
    if (!formattedCss) {
      toast.error("No formatted CSS to copy");
      return;
    }

    navigator.clipboard.writeText(formattedCss)
      .then(() => {
        setIsCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <ToolLayout title="CSS Formatter" icon={<Code size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-6">
              Format and beautify your CSS code with proper indentation and structure.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="css-input" className="block text-sm font-medium">
                    CSS Input
                  </label>
                  <div className="text-xs text-muted-foreground">
                    {css.length} characters
                  </div>
                </div>
                <Textarea
                  id="css-input"
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  placeholder="body {margin: 0; padding: 0;} .container {width: 100%;}"
                  className="font-mono h-[400px] resize-none"
                />
                <div className="flex justify-start">
                  <Button onClick={formatCss} className="mt-2">
                    Format CSS
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="formatted-output" className="block text-sm font-medium">
                    Formatted CSS
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!formattedCss}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="formatted-output"
                  value={formattedCss}
                  readOnly
                  placeholder="Formatted CSS will appear here"
                  className="font-mono bg-muted h-[400px] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">CSS Formatting Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use consistent indentation (2 or 4 spaces)</li>
              <li>Put each selector on its own line</li>
              <li>Include a space after the selector before the opening brace</li>
              <li>Put each declaration on its own line</li>
              <li>Use a space after property colon</li>
              <li>End each declaration with a semicolon</li>
              <li>Group related properties together</li>
              <li>Use comments to organize your CSS into sections</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default CssFormatter;
