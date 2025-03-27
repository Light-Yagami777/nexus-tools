
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Copy, Download, FileText, ArrowDownToLine } from "lucide-react";
import { motion } from "framer-motion";
import { showRewardedAd } from "@/utils/adUtils";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [htmlOutput, setHtmlOutput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("editor");
  const { toast } = useToast();

  useEffect(() => {
    // Simple markdown to HTML conversion
    // In a real application, you would use a proper markdown parser like marked or remark
    let html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')
      // Lists
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr>')
      // Blockquote
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Wrap list items in ul
    const listRegex = /<li>[\s\S]*?<\/li>/g;
    const matches = html.match(listRegex);
    if (matches) {
      for (const match of matches) {
        html = html.replace(match, `<ul>${match}</ul>`);
      }
    }
    
    // Fix nested lists
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    // Fix consecutive paragraphs
    html = html.replace(/([^>])\n\n([^<])/g, '$1<br><br>$2');
    
    setHtmlOutput(html);
  }, [markdown]);

  const copyToClipboard = async (text: string, type: 'markdown' | 'html') => {
    await showRewardedAd();
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type === 'markdown' ? 'Markdown' : 'HTML'} has been copied to your clipboard.`,
    });
  };

  const downloadFile = async (content: string, fileType: 'md' | 'html') => {
    await showRewardedAd();
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `Your ${fileType === 'md' ? 'Markdown' : 'HTML'} file is being downloaded.`,
    });
  };

  const insertTemplate = async (template: string) => {
    await showRewardedAd();
    
    setMarkdown(markdown + template);
    toast({
      title: "Template inserted",
      description: "Template has been added to your document.",
    });
  };

  // Templates for common markdown structures
  const templates = {
    table: `
### Sample Table

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
| Row 3    | Data     | Data     |

`,
    link: `[Link text](https://example.com)`,
    image: `![Alt text](https://example.com/image.jpg)`,
    codeBlock: `
\`\`\`javascript
// Your code here
function greet() {
  console.log("Hello world!");
}
\`\`\`
`,
    headings: `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
`
  };

  return (
    <ToolLayout
      title="Markdown Editor"
      description="Write and preview markdown in real-time. Export to HTML or formatted text for documentation."
      icon={<Edit size={24} />}
      extraPadding
    >
      <div className="space-y-6">
        <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              {activeTab === "editor" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(markdown, 'markdown')}
                  disabled={!markdown}
                  title="Copy Markdown"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Copy Markdown</span>
                </Button>
              )}
              {activeTab === "html" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(htmlOutput, 'html')}
                  disabled={!htmlOutput}
                  title="Copy HTML"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Copy HTML</span>
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadFile(markdown, 'md')}
                disabled={!markdown}
                title="Download Markdown"
              >
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Download MD</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadFile(htmlOutput, 'html')}
                disabled={!htmlOutput}
                title="Download HTML"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Download HTML</span>
              </Button>
            </div>
          </div>

          <TabsContent value="editor">
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => insertTemplate(templates.headings)}
                  >
                    Headings
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => insertTemplate(templates.link)}
                  >
                    Link
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => insertTemplate(templates.image)}
                  >
                    Image
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => insertTemplate(templates.table)}
                  >
                    Table
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => insertTemplate(templates.codeBlock)}
                  >
                    Code Block
                  </Button>
                </div>
                
                <Textarea
                  placeholder="Type your markdown here..."
                  className="min-h-[400px] font-mono text-base"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                />
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card className="p-6">
              <div className="prose dark:prose-invert max-w-none min-h-[400px] overflow-auto">
                {htmlOutput ? (
                  <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
                ) : (
                  <div className="text-muted-foreground italic">
                    Your preview will appear here...
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="html">
            <Card className="p-6">
              <pre className="bg-muted/30 p-4 rounded-md overflow-auto min-h-[400px] text-sm font-mono">
                {htmlOutput || <span className="text-muted-foreground">HTML output will appear here...</span>}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="p-6 bg-muted/30">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Markdown Cheat Sheet</h2>
              <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Basic Syntax</h3>
                  <ul className="space-y-1">
                    <li><code># Heading 1</code></li>
                    <li><code>## Heading 2</code></li>
                    <li><code>**Bold**</code></li>
                    <li><code>*Italic*</code></li>
                    <li><code>[Link](URL)</code></li>
                    <li><code>![Image](URL)</code></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Lists</h3>
                  <ul className="space-y-1">
                    <li><code>* Unordered item</code></li>
                    <li><code>- Unordered item</code></li>
                    <li><code>1. Ordered item</code></li>
                    <li><code>- [ ] Task</code></li>
                    <li><code>- [x] Completed task</code></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Other Elements</h3>
                  <ul className="space-y-1">
                    <li><code>---</code> (Horizontal rule)</li>
                    <li><code>`Code`</code></li>
                    <li><code>```code block```</code></li>
                    <li><code>> Blockquote</code></li>
                    <li><code>| Table | Header |</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default MarkdownEditor;
