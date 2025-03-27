
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Markdown } from "lucide-react";

const HtmlToMarkdown = () => {
  const [htmlInput, setHtmlInput] = useState<string>("");
  const [markdownOutput, setMarkdownOutput] = useState<string>("");
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [includeLinks, setIncludeLinks] = useState<boolean>(true);
  const [includeLists, setIncludeLists] = useState<boolean>(true);
  const [preserveHeadings, setPreserveHeadings] = useState<boolean>(true);

  const handleHtmlToMarkdown = () => {
    if (!htmlInput.trim()) {
      toast.error("Please enter some HTML to convert");
      return;
    }

    try {
      let html = htmlInput;
      let markdown = html;

      // Replace newlines
      markdown = markdown.replace(/\r\n|\n|\r/g, "\n");

      // Replace multiple spaces
      markdown = markdown.replace(/\s+/g, " ");

      // Remove <!DOCTYPE> and comments
      markdown = markdown.replace(/<!DOCTYPE[^>]*>/i, "");
      markdown = markdown.replace(/<!--[\s\S]*?-->/g, "");

      // Headings
      if (preserveHeadings) {
        markdown = markdown.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n");
        markdown = markdown.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n");
        markdown = markdown.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n");
        markdown = markdown.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "#### $1\n\n");
        markdown = markdown.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "##### $1\n\n");
        markdown = markdown.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "###### $1\n\n");
      }

      // Paragraphs
      markdown = markdown.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n");

      // Bold
      markdown = markdown.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
      markdown = markdown.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");

      // Italic
      markdown = markdown.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
      markdown = markdown.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");

      // Links
      if (includeLinks) {
        markdown = markdown.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
      }

      // Images
      if (includeImages) {
        markdown = markdown.replace(/<img\s+(?:[^>]*?\s+)?src="([^"]*)"(?:\s+(?:[^>]*?\s+)?alt="([^"]*)")?[^>]*>/gi, 
          (match, src, alt) => {
            alt = alt || "";
            return `![${alt}](${src})`;
          }
        );
      }

      // Code blocks
      markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n");
      
      // Inline code
      markdown = markdown.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

      // Blockquotes
      markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n\n");

      // Horizontal rule
      markdown = markdown.replace(/<hr\s*\/?>/gi, "---\n\n");

      // Lists
      if (includeLists) {
        // Ordered lists
        const olRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
        markdown = markdown.replace(olRegex, (match, content) => {
          let listItems = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "1. $1\n");
          return listItems + "\n";
        });

        // Unordered lists
        const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
        markdown = markdown.replace(ulRegex, (match, content) => {
          let listItems = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "* $1\n");
          return listItems + "\n";
        });
      }

      // Tables (simplified)
      const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
      markdown = markdown.replace(tableRegex, (match, tableContent) => {
        let mdTable = "";
        
        // Find table header
        const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
        let headerRow = "";
        let separatorRow = "";
        let hasHeader = false;
        
        // Extract content from first tr to use as header
        const trMatch = /<tr[^>]*>([\s\S]*?)<\/tr>/i.exec(tableContent);
        if (trMatch) {
          let headerContent = trMatch[1];
          let headerCells: string[] = [];
          let headerMatch;
          
          while ((headerMatch = thRegex.exec(headerContent)) !== null) {
            headerCells.push(headerMatch[1].trim());
            hasHeader = true;
          }
          
          // If no th tags, try td tags in first row
          if (!hasHeader) {
            const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
            while ((headerMatch = tdRegex.exec(headerContent)) !== null) {
              headerCells.push(headerMatch[1].trim());
            }
          }
          
          if (headerCells.length > 0) {
            headerRow = "| " + headerCells.join(" | ") + " |\n";
            separatorRow = "|" + headerCells.map(() => " --- ").join("|") + "|\n";
          }
        }
        
        // Process table rows
        const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let trMatch2;
        let rowCount = 0;
        
        while ((trMatch2 = trRegex.exec(tableContent)) !== null) {
          rowCount++;
          // Skip first row if it was used as header
          if (rowCount === 1 && hasHeader) continue;
          
          const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
          let rowCells = [];
          let tdMatch;
          
          while ((tdMatch = tdRegex.exec(trMatch2[1])) !== null) {
            rowCells.push(tdMatch[1].trim());
          }
          
          if (rowCells.length > 0) {
            mdTable += "| " + rowCells.join(" | ") + " |\n";
          }
        }
        
        return headerRow + separatorRow + mdTable + "\n";
      });

      // Clean up remaining HTML tags
      markdown = markdown.replace(/<[^>]*>/g, "");

      // Decode HTML entities
      markdown = markdown.replace(/&nbsp;/g, " ");
      markdown = markdown.replace(/&lt;/g, "<");
      markdown = markdown.replace(/&gt;/g, ">");
      markdown = markdown.replace(/&amp;/g, "&");
      markdown = markdown.replace(/&quot;/g, '"');
      markdown = markdown.replace(/&#39;/g, "'");

      // Fix multiple newlines
      markdown = markdown.replace(/\n\s*\n\s*\n/g, "\n\n");

      setMarkdownOutput(markdown);
      toast.success("HTML converted to Markdown!");
    } catch (error) {
      toast.error("Error converting HTML to Markdown");
      console.error(error);
    }
  };

  const handleClear = () => {
    setHtmlInput("");
    setMarkdownOutput("");
  };

  const handleCopy = () => {
    if (!markdownOutput) {
      toast.error("Nothing to copy");
      return;
    }
    
    navigator.clipboard.writeText(markdownOutput).then(() => {
      toast.success("Copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  return (
    <ToolLayout title="HTML to Markdown Converter">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="html-input">HTML Input</Label>
            <Textarea 
              id="html-input"
              placeholder="Paste your HTML code here..."
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className="font-mono h-64"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-images" 
                checked={includeImages}
                onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
              />
              <Label htmlFor="include-images">Include Images</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-links" 
                checked={includeLinks}
                onCheckedChange={(checked) => setIncludeLinks(checked as boolean)}
              />
              <Label htmlFor="include-links">Include Links</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-lists" 
                checked={includeLists}
                onCheckedChange={(checked) => setIncludeLists(checked as boolean)}
              />
              <Label htmlFor="include-lists">Include Lists</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="preserve-headings" 
                checked={preserveHeadings}
                onCheckedChange={(checked) => setPreserveHeadings(checked as boolean)}
              />
              <Label htmlFor="preserve-headings">Preserve Headings</Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleHtmlToMarkdown}>
              Convert to Markdown
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="markdown-output">Markdown Output</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                Copy to clipboard
              </Button>
            </div>
            <Textarea 
              id="markdown-output"
              value={markdownOutput}
              readOnly
              className="font-mono h-64"
            />
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">About HTML to Markdown Conversion</h3>
            <p className="text-sm text-muted-foreground">
              This tool converts HTML code to Markdown format, which is a lightweight markup language commonly used for documentation and README files. The converter handles headings, paragraphs, formatting (bold, italic), lists, links, images, code blocks, blockquotes, and simple tables. HTML entities are also decoded during conversion.
            </p>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default HtmlToMarkdown;
