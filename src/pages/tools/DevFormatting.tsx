
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, Copy, Check, FileCode } from "lucide-react";

const DevFormatting = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fileType, setFileType] = useState("json");
  const [isFormatting, setIsFormatting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const fileTypes = [
    { value: "json", label: "JSON" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "markdown", label: "Markdown" },
    { value: "sql", label: "SQL" },
    { value: "xml", label: "XML" },
    { value: "yaml", label: "YAML" },
  ];

  const formatCode = () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter code to format",
        variant: "destructive",
      });
      return;
    }

    setIsFormatting(true);

    try {
      let formattedOutput = input;

      // Basic formatting for different file types
      switch (fileType) {
        case "json":
          formattedOutput = JSON.stringify(JSON.parse(input), null, 2);
          break;
        case "html":
        case "xml":
          // Simple HTML/XML formatting (just indent properly)
          formattedOutput = formatHTML(input);
          break;
        case "css":
          formattedOutput = formatCSS(input);
          break;
        case "javascript":
        case "typescript":
          // Very basic JS formatting (just for demo)
          formattedOutput = formatJS(input);
          break;
        case "sql":
          formattedOutput = formatSQL(input);
          break;
        // Other formats would go here
        default:
          // For unsupported formats, just clean up whitespace
          formattedOutput = input.trim();
      }

      setOutput(formattedOutput);
      toast({
        title: "Formatting complete",
        description: `Your ${fileType.toUpperCase()} code has been formatted successfully!`,
      });
    } catch (error) {
      console.error("Error formatting code:", error);
      toast({
        title: "Formatting failed",
        description: `Failed to format ${fileType.toUpperCase()} code. Check if your input is valid.`,
        variant: "destructive",
      });
      setOutput("");
    } finally {
      setIsFormatting(false);
    }
  };

  // Very simple HTML/XML formatter (could be improved)
  const formatHTML = (code: string) => {
    let formatted = '';
    let indent = 0;
    
    // Split code by < and iterate
    const parts = code.split('<');
    
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].trim()) continue;
      
      const chunk = '<' + parts[i];
      
      // Check if closing tag
      if (chunk.match(/^<\//)) {
        indent -= 2;
      }
      
      // Add indentation
      formatted += ' '.repeat(Math.max(0, indent)) + chunk.trim() + '\n';
      
      // Check if opening tag (not self-closing)
      if (chunk.match(/^<[^/]/) && !chunk.match(/\/>/)) {
        indent += 2;
      }
    }
    
    return formatted.trim();
  };

  // Simple CSS formatter
  const formatCSS = (code: string) => {
    return code
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/\s*\}\s*/g, '\n}\n')
      .replace(/\s*;\s*/g, ';\n  ')
      .replace(/\s*:\s*/g, ': ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  };

  // Simple JS formatter
  const formatJS = (code: string) => {
    return code
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/\s*\}\s*/g, '\n}\n')
      .replace(/\s*;\s*/g, ';\n  ')
      .replace(/\s*=>\s*/g, ' => ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  };

  // Simple SQL formatter
  const formatSQL = (code: string) => {
    return code
      .replace(/\s*(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|UNION|INSERT INTO|UPDATE|DELETE FROM)\s*/gi, '\n$1 ')
      .replace(/\s*(AND|OR)\s*/gi, '\n  $1 ')
      .replace(/\s*,\s*/g, ',\n  ')
      .trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(
      () => {
        setIsCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Formatted code has been copied to clipboard",
        });
        
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <header className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Dev Formatting</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                One tool for formatting all types of files. Clean up and beautify your code regardless of the language.
              </p>
            </header>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Input Code</h2>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-xl border bg-card">
                <Textarea
                  placeholder={`Paste your ${fileType.toUpperCase()} code here...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>

              <Button 
                onClick={formatCode} 
                className="w-full"
                disabled={isFormatting || !input.trim()}
              >
                <Code className="mr-2 h-4 w-4" />
                Format Code
              </Button>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Formatted Output</h2>
                {output && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {isCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="p-4 rounded-xl border bg-card">
                {output ? (
                  <pre className="min-h-[400px] font-mono text-sm overflow-auto whitespace-pre-wrap">
                    {output}
                  </pre>
                ) : (
                  <div className="min-h-[400px] flex items-center justify-center text-muted-foreground text-center p-4">
                    <div>
                      <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Formatted code will appear here</p>
                      <p className="text-sm mt-2">Enter code and click "Format Code" to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Features section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="p-6 rounded-xl border bg-card">
              <Code className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Multiple Languages</h3>
              <p className="text-muted-foreground">
                Format code in JSON, HTML, CSS, JavaScript, TypeScript, Markdown, SQL, and more.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border bg-card">
              <FileCode className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Clean & Readable</h3>
              <p className="text-muted-foreground">
                Transforms messy code into properly indented, well-formatted output.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border bg-card">
              <Copy className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Quick Copy</h3>
              <p className="text-muted-foreground">
                Copy the formatted output to your clipboard with one click.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DevFormatting;
