
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const JavascriptFormatter = () => {
  const [javascript, setJavascript] = useState("");
  const [formattedJavascript, setFormattedJavascript] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const formatJavascript = () => {
    if (!javascript.trim()) {
      toast.error("Please enter some JavaScript to format");
      return;
    }

    try {
      // Use the built-in JSON.stringify with spacing for basic formatting
      // This works for objects but not for actual JavaScript code
      // For a real implementation, use a proper JavaScript formatter library
      
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(javascript);
        const formatted = JSON.stringify(parsed, null, 2);
        setFormattedJavascript(formatted);
        toast.success("JavaScript formatted successfully");
        return;
      } catch (e) {
        // Not valid JSON, try to format as JS
      }
      
      // Very basic JS formatting - this is NOT a proper formatter
      // For production, use a library like prettier or js-beautify
      let formatted = javascript
        // Remove extra whitespace
        .replace(/\s+/g, " ")
        // Add newline after semicolons and braces
        .replace(/;/g, ";\n")
        .replace(/{/g, " {\n")
        .replace(/}/g, "}\n")
        // Indent after braces
        .split("\n")
        .map((line, i, arr) => {
          let indent = 0;
          for (let j = 0; j < i; j++) {
            if (arr[j].includes("{")) indent++;
            if (arr[j].includes("}")) indent--;
          }
          return "  ".repeat(indent) + line;
        })
        .join("\n");
      
      setFormattedJavascript(formatted);
      toast.success("JavaScript formatting attempted (basic)");
      toast.info("For better results, use a dedicated JavaScript formatter");
    } catch (error) {
      console.error("Error formatting JavaScript:", error);
      toast.error("Failed to format JavaScript. Please check your input.");
    }
  };

  const copyToClipboard = () => {
    if (!formattedJavascript) {
      toast.error("No formatted JavaScript to copy");
      return;
    }

    navigator.clipboard.writeText(formattedJavascript)
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
    <ToolLayout title="JavaScript Formatter" icon={<Code size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-6">
              Format and beautify your JavaScript code with proper indentation and structure.
              <br />
              <span className="text-sm text-amber-500">
                Note: This is a basic formatter. For complex JavaScript, consider using a dedicated tool like Prettier.
              </span>
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="js-input" className="block text-sm font-medium">
                    JavaScript Input
                  </label>
                  <div className="text-xs text-muted-foreground">
                    {javascript.length} characters
                  </div>
                </div>
                <Textarea
                  id="js-input"
                  value={javascript}
                  onChange={(e) => setJavascript(e.target.value)}
                  placeholder="function example() { return { foo: 'bar', baz: 42 }; }"
                  className="font-mono h-[400px] resize-none"
                />
                <div className="flex justify-start">
                  <Button onClick={formatJavascript} className="mt-2">
                    Format JavaScript
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="formatted-output" className="block text-sm font-medium">
                    Formatted JavaScript
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!formattedJavascript}
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
                  value={formattedJavascript}
                  readOnly
                  placeholder="Formatted JavaScript will appear here"
                  className="font-mono bg-muted h-[400px] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">JavaScript Formatting Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use consistent indentation (2 or 4 spaces)</li>
              <li>Always terminate statements with semicolons</li>
              <li>Use meaningful and descriptive variable names</li>
              <li>Keep functions short and focused on a single task</li>
              <li>Add comments to explain complex logic</li>
              <li>Use consistent spacing around operators</li>
              <li>Place opening braces on the same line as the statement</li>
              <li>Consider using a linter like ESLint to enforce code style</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default JavascriptFormatter;
