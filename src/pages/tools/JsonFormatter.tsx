
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Trash, Code, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isFormatted, setIsFormatted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormat = () => {
    try {
      if (!input.trim()) {
        setError('Please enter JSON data');
        setOutput('');
        setIsFormatted(false);
        return;
      }

      // Parse and stringify with indentation
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsFormatted(true);
      setError(null);
      
      toast({
        title: "JSON Formatted Successfully",
        description: "Your JSON has been formatted and validated.",
      });
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
      setOutput('');
      setIsFormatted(false);
      
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: (err as Error).message,
      });
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) {
        setError('Please enter JSON data');
        setOutput('');
        setIsFormatted(false);
        return;
      }

      // Parse and stringify without indentation
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsFormatted(true);
      setError(null);
      
      toast({
        title: "JSON Minified Successfully",
        description: "Your JSON has been minified and validated.",
      });
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
      setOutput('');
      setIsFormatted(false);
      
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: (err as Error).message,
      });
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setIsCopied(true);
      
      toast({
        title: "Copied to Clipboard",
        description: "The formatted JSON has been copied to your clipboard.",
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setIsFormatted(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">JSON Formatter</h1>
            <p className="text-muted-foreground">
              Format, validate, and beautify your JSON data with syntax highlighting
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Input JSON</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleClear}>
                    <Trash className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button size="sm" variant="outline" className="relative">
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Paste your JSON here, e.g., {"name": "John", "age": 30}'
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="mt-4 space-x-2">
                <Button onClick={handleFormat} variant="default">
                  <Code className="h-4 w-4 mr-1" />
                  Format & Validate
                </Button>
                <Button onClick={handleMinify} variant="outline">
                  Minify
                </Button>
              </div>
            </Card>

            {/* Output Section */}
            <Card className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Formatted JSON</h2>
                {isFormatted && (
                  <Button size="sm" variant="outline" onClick={handleCopy}>
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
                )}
              </div>
              
              {error ? (
                <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                  {error}
                </div>
              ) : output ? (
                <pre className="bg-muted p-4 rounded-md overflow-auto min-h-[300px] text-sm font-mono">
                  {output}
                </pre>
              ) : (
                <div className="bg-muted min-h-[300px] flex items-center justify-center rounded-md text-muted-foreground">
                  Formatted JSON will appear here
                </div>
              )}
              
              {isFormatted && !error && (
                <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                  ✓ Valid JSON
                </div>
              )}
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About JSON Formatter</h2>
            <Card className="p-6">
              <p className="mb-4">
                JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write and easy for machines to parse and generate.
              </p>
              <h3 className="font-semibold mt-4 mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Format and indent JSON for improved readability</li>
                <li>Validate JSON syntax and structure</li>
                <li>Minify JSON to reduce file size</li>
                <li>Copy formatted JSON to clipboard</li>
                <li>Upload JSON files directly</li>
              </ul>
              <h3 className="font-semibold mt-4 mb-2">How to use:</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Paste your JSON data in the input field or upload a JSON file</li>
                <li>Click "Format & Validate" to beautify and check your JSON</li>
                <li>Click "Minify" to compress your JSON by removing whitespace</li>
                <li>Use the "Copy" button to copy the result to your clipboard</li>
              </ol>
            </Card>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default JsonFormatter;
