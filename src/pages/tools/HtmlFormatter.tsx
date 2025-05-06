
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const HtmlFormatter = () => {
  const [html, setHtml] = useState("");
  const [formattedHtml, setFormattedHtml] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const formatHtml = () => {
    if (!html.trim()) {
      toast.error("Please enter some HTML to format");
      return;
    }

    try {
      // Create a temporary div to use the browser's HTML parser
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Get the formatted HTML with proper indentation
      // This is a very basic formatter - a real implementation would use a proper HTML formatter
      const formatted = formatElement(tempDiv);
      setFormattedHtml(formatted);
      
      toast.success("HTML formatted successfully");
    } catch (error) {
      console.error("Error formatting HTML:", error);
      toast.error("Failed to format HTML. Please check your input.");
    }
  };

  // Simple HTML formatting function
  const formatElement = (elem: Element, level = 0): string => {
    const indent = '  '.repeat(level);
    let html = '';
    
    Array.from(elem.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          html += `${indent}${text}\n`;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const attributes = Array.from(element.attributes)
          .map(attr => `${attr.name}="${attr.value}"`)
          .join(' ');
        
        if (element.children.length === 0 && !element.textContent?.trim()) {
          html += `${indent}<${tagName}${attributes ? ' ' + attributes : ''} />\n`;
        } else if (element.children.length === 0 && element.textContent?.trim()) {
          html += `${indent}<${tagName}${attributes ? ' ' + attributes : ''}>${element.textContent?.trim()}</${tagName}>\n`;
        } else {
          html += `${indent}<${tagName}${attributes ? ' ' + attributes : ''}>\n${formatElement(element, level + 1)}${indent}</${tagName}>\n`;
        }
      }
    });
    
    return html;
  };

  const copyToClipboard = () => {
    if (!formattedHtml) {
      toast.error("No formatted HTML to copy");
      return;
    }

    navigator.clipboard.writeText(formattedHtml)
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
    <ToolLayout title="HTML Formatter" icon={<Code size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-6">
              Format and beautify your HTML code with proper indentation and structure.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="html-input" className="block text-sm font-medium">
                    HTML Input
                  </label>
                  <div className="text-xs text-muted-foreground">
                    {html.length} characters
                  </div>
                </div>
                <Textarea
                  id="html-input"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  placeholder="<div><p>Paste your HTML here</p></div>"
                  className="font-mono h-[400px] resize-none"
                />
                <div className="flex justify-start">
                  <Button onClick={formatHtml} className="mt-2">
                    Format HTML
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="formatted-output" className="block text-sm font-medium">
                    Formatted HTML
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!formattedHtml}
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
                  value={formattedHtml}
                  readOnly
                  placeholder="Formatted HTML will appear here"
                  className="font-mono bg-muted h-[400px] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">HTML Formatting Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use consistent indentation for nested elements</li>
              <li>Place each attribute on the same line for better readability</li>
              <li>Use lower case for tag names and attributes</li>
              <li>Quote attribute values with double quotes</li>
              <li>Close all HTML tags properly</li>
              <li>Use comments to document your HTML structure</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default HtmlFormatter;
