import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileCode } from "lucide-react";

const MarkdownToHtml = () => {
  const [markdownInput, setMarkdownInput] = useState<string>("");
  const [htmlOutput, setHtmlOutput] = useState<string>("");
  const [addLineBreaks, setAddLineBreaks] = useState<boolean>(true);
  const [githubFlavored, setGithubFlavored] = useState<boolean>(true);
  const [wrapWithDocument, setWrapWithDocument] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<string>("source");

  const handleMarkdownToHtml = () => {
    if (!markdownInput.trim()) {
      toast.error("Please enter some Markdown to convert");
      return;
    }

    try {
      let markdown = markdownInput;
      let html = "";

      // Headers
      markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');
      markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
      markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');
      markdown = markdown.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
      markdown = markdown.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
      markdown = markdown.replace(/^###### (.*$)/gm, '<h6>$1</h6>');

      // Handle line breaks
      if (addLineBreaks) {
        markdown = markdown.replace(/\n/g, "\n<br />");
      }

      // Block quotes
      markdown = markdown.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

      // Emphasis (bold, italic)
      markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
      markdown = markdown.replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>');
      markdown = markdown.replace(/\_(.*?)\_/g, '<em>$1</em>');

      // Strikethrough (GitHub-flavored)
      if (githubFlavored) {
        markdown = markdown.replace(/~~(.*?)~~/g, '<del>$1</del>');
      }

      // Code blocks
      markdown = markdown.replace(/```([^`]*?)```/g, '<pre><code>$1</code></pre>');
      
      // Inline code
      markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');

      // Links
      markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

      // Images
      markdown = markdown.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

      // Unordered lists
      let ulMatch = markdown.match(/^[\*\-] (.*)$/gm);
      if (ulMatch) {
        ulMatch.forEach((item) => {
          const listItem = item.replace(/^[\*\-] (.*)$/, '<li>$1</li>');
          markdown = markdown.replace(item, listItem);
        });
        markdown = markdown.replace(/(<li>.*?<\/li>)\n(<li>)/g, '$1$2');
        markdown = markdown.replace(/^<li>(.*)$/gm, '<ul>\n<li>$1</li>\n</ul>');
        markdown = markdown.replace(/<\/ul>\n<ul>/g, '');
      }

      // Ordered lists
      let olMatch = markdown.match(/^\d+\. (.*)$/gm);
      if (olMatch) {
        olMatch.forEach((item) => {
          const listItem = item.replace(/^\d+\. (.*)$/, '<li>$1</li>');
          markdown = markdown.replace(item, listItem);
        });
        markdown = markdown.replace(/(<li>.*?<\/li>)\n(<li>)/g, '$1$2');
        markdown = markdown.replace(/^<li>(.*)$/gm, '<ol>\n<li>$1</li>\n</ol>');
        markdown = markdown.replace(/<\/ol>\n<ol>/g, '');
      }

      // Horizontal rule
      markdown = markdown.replace(/^---$/gm, '<hr />');

      // Tables (GitHub-flavored)
      if (githubFlavored) {
        // Find table sections
        const tableRegex = /^\|(.+)\|\r?\n\|(?:[-:]+\|)+\r?\n(?:\|.+\|\r?\n)+/gm;
        const tables = markdown.match(tableRegex);
        
        if (tables) {
          tables.forEach(table => {
            const rows = table.split('\n').filter(row => row.trim() !== '');
            
            // Get header row
            const headerRow = rows[0];
            // Get alignment row
            const alignmentRow = rows[1];
            // Get content rows
            const contentRows = rows.slice(2);
            
            let headerCells = headerRow.split('|')
              .filter(cell => cell.trim() !== '')
              .map(cell => cell.trim());
              
            let alignments = alignmentRow.split('|')
              .filter(cell => cell.trim() !== '')
              .map(cell => {
                const trimmed = cell.trim();
                if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
                if (trimmed.endsWith(':')) return 'right';
                return 'left';
              });
              
            // Create HTML table
            let htmlTable = '<table>\n<thead>\n<tr>\n';
            
            // Add header cells
            headerCells.forEach((cell, index) => {
              const align = alignments[index] || 'left';
              htmlTable += `<th align="${align}">${cell}</th>\n`;
            });
            
            htmlTable += '</tr>\n</thead>\n<tbody>\n';
            
            // Add content rows
            contentRows.forEach(row => {
              htmlTable += '<tr>\n';
              
              const cells = row.split('|')
                .filter(cell => cell.trim() !== '')
                .map(cell => cell.trim());
                
              cells.forEach((cell, index) => {
                const align = alignments[index] || 'left';
                htmlTable += `<td align="${align}">${cell}</td>\n`;
              });
              
              htmlTable += '</tr>\n';
            });
            
            htmlTable += '</tbody>\n</table>';
            
            // Replace the original table with the HTML table
            markdown = markdown.replace(table, htmlTable);
          });
        }
      }

      // Fix any remaining markdown patterns
      markdown = markdown.replace(/  \n/g, '<br />');
      
      // Fix paragraphs - wrap text blocks that aren't already wrapped in HTML tags
      const paragraphRegex = /^(?!<[a-z]|<\/[a-z])(.+)$/gm;
      markdown = markdown.replace(paragraphRegex, '<p>$1</p>');
      
      // Clean up: remove any extra line breaks before or after HTML tags
      markdown = markdown.replace(/\n*(<\/?[^>]+>)\n*/g, '$1');
      
      // Cleanup any extra paragraph tags around lists
      markdown = markdown.replace(/<p><(ul|ol)>/g, '<$1>');
      markdown = markdown.replace(/<\/(ul|ol)><\/p>/g, '</$1>');
      
      // Remove any <br> inside list items
      markdown = markdown.replace(/<li>(.*?)<br \/>(.*?)<\/li>/g, '<li>$1 $2</li>');
      
      html = markdown;

      // Wrap with full HTML document if requested
      if (wrapWithDocument) {
        html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Markdown</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    pre { background-color: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto; }
    code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 4px; font-family: Consolas, Monaco, 'Andale Mono', monospace; }
    blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 16px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    img { max-width: 100%; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
      }

      setHtmlOutput(html);
      toast.success("Markdown converted to HTML!");
    } catch (error) {
      toast.error("Error converting Markdown to HTML");
      console.error(error);
    }
  };

  const handleClear = () => {
    setMarkdownInput("");
    setHtmlOutput("");
  };

  const handleCopy = () => {
    if (!htmlOutput) {
      toast.error("Nothing to copy");
      return;
    }
    
    navigator.clipboard.writeText(htmlOutput).then(() => {
      toast.success("Copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  return (
    <ToolLayout title="Markdown to HTML Converter">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="markdown-input">Markdown Input</Label>
            <Textarea 
              id="markdown-input"
              placeholder="Enter your Markdown text here..."
              value={markdownInput}
              onChange={(e) => setMarkdownInput(e.target.value)}
              className="font-mono h-64"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="add-line-breaks" 
                checked={addLineBreaks}
                onCheckedChange={(checked) => setAddLineBreaks(checked as boolean)}
              />
              <Label htmlFor="add-line-breaks">Add Line Breaks</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="github-flavored" 
                checked={githubFlavored}
                onCheckedChange={(checked) => setGithubFlavored(checked as boolean)}
              />
              <Label htmlFor="github-flavored">GitHub Flavored</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="wrap-with-document" 
                checked={wrapWithDocument}
                onCheckedChange={(checked) => setWrapWithDocument(checked as boolean)}
              />
              <Label htmlFor="wrap-with-document">Full HTML Document</Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleMarkdownToHtml}>
              Convert to HTML
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {htmlOutput && (
            <Tabs defaultValue={previewMode} onValueChange={setPreviewMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="source">HTML Source</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="source" className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="html-output">HTML Output</Label>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    Copy to clipboard
                  </Button>
                </div>
                <Textarea 
                  id="html-output"
                  value={htmlOutput}
                  readOnly
                  className="font-mono h-64"
                />
              </TabsContent>
              
              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-lg p-6 min-h-64 max-h-96 overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">About Markdown to HTML Conversion</h3>
            <p className="text-sm text-muted-foreground">
              This tool converts Markdown text to HTML. It supports basic Markdown syntax including headers, emphasis (bold, italic), links, images, code blocks, lists, blockquotes, horizontal rules, and tables (with GitHub Flavored Markdown option). You can also generate a complete HTML document with proper styling.
            </p>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default MarkdownToHtml;
