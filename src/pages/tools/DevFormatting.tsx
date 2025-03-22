import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Trash, Upload, Code, FileType, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';

type FileType = 'json' | 'html' | 'css' | 'javascript' | 'sql' | 'xml' | 'markdown' | 'text';

const DevFormatting = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileType, setFileType] = useState<FileType>('json');
  const [isFormatted, setIsFormatted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatCode = () => {
    try {
      if (!input.trim()) {
        setError(`Please enter ${fileType.toUpperCase()} data`);
        setOutput('');
        setIsFormatted(false);
        return;
      }

      let formatted = '';
      
      switch (fileType) {
        case 'json':
          const parsed = JSON.parse(input);
          formatted = JSON.stringify(parsed, null, 2);
          break;
        case 'html':
          formatted = input
            .replace(/>\s*</g, '>\n<')
            .replace(/(<[^>]+>)/g, (match) => {
              return match.replace(/\s+/g, ' ');
            })
            .split('\n')
            .map(line => line.trim())
            .join('\n');
          break;
        case 'css':
          formatted = input
            .replace(/\s*{\s*/g, ' {\n  ')
            .replace(/\s*;\s*/g, ';\n  ')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/\n\s*\n/g, '\n');
          break;
        case 'javascript':
          try {
            const obj = eval('(' + input + ')');
            formatted = JSON.stringify(obj, null, 2);
          } catch (e) {
            formatted = input
              .replace(/\s*{\s*/g, ' {\n  ')
              .replace(/\s*;\s*/g, ';\n  ')
              .replace(/\s*}\s*/g, '\n}\n')
              .replace(/\n\s*\n/g, '\n');
          }
          break;
        case 'sql':
          formatted = input
            .replace(/\s+/g, ' ')
            .replace(/\s*,\s*/g, ', ')
            .replace(/\s*=\s*/g, ' = ')
            .replace(/\s*(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|ON|AND|OR)\s*/gi, '\n$1 ')
            .trim();
          break;
        case 'xml':
          formatted = input
            .replace(/>\s*</g, '>\n<')
            .replace(/(<[^>]+>)/g, (match) => {
              return match.replace(/\s+/g, ' ');
            })
            .split('\n')
            .map(line => line.trim())
            .join('\n');
          break;
        case 'markdown':
          formatted = input
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\s+\n/g, '\n')
            .trim();
          break;
        default:
          formatted = input
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\s+\n/g, '\n')
            .trim();
      }

      setOutput(formatted);
      setIsFormatted(true);
      setError(null);
      
      toast({
        title: `${fileType.toUpperCase()} Formatted Successfully`,
        description: `Your ${fileType.toUpperCase()} has been formatted.`,
      });
    } catch (err) {
      setError(`Invalid ${fileType.toUpperCase()}: ${(err as Error).message}`);
      setOutput('');
      setIsFormatted(false);
      
      toast({
        variant: "destructive",
        title: `Invalid ${fileType.toUpperCase()}`,
        description: (err as Error).message,
      });
    }
  };

  const minifyCode = () => {
    try {
      if (!input.trim()) {
        setError(`Please enter ${fileType.toUpperCase()} data`);
        setOutput('');
        setIsFormatted(false);
        return;
      }

      let minified = '';
      
      switch (fileType) {
        case 'json':
          const parsed = JSON.parse(input);
          minified = JSON.stringify(parsed);
          break;
        case 'html':
          minified = input
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/\s+>/g, '>')
            .replace(/<\s+/g, '<')
            .trim();
          break;
        case 'css':
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*,\s*/g, ',')
            .trim();
          break;
        case 'javascript':
          minified = input
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*,\s*/g, ',')
            .trim();
          break;
        case 'sql':
          minified = input
            .replace(/--.*$/gm, '')
            .replace(/\s+/g, ' ')
            .trim();
          break;
        case 'xml':
          minified = input
            .replace(/>\s+</g, '><')
            .replace(/\s+>/g, '>')
            .replace(/<\s+/g, '<')
            .replace(/<!--[\s\S]*?-->/g, '')
            .trim();
          break;
        default:
          minified = input
            .replace(/\s+/g, ' ')
            .trim();
      }

      setOutput(minified);
      setIsFormatted(true);
      setError(null);
      
      toast({
        title: `${fileType.toUpperCase()} Minified Successfully`,
        description: `Your ${fileType.toUpperCase()} has been minified.`,
      });
    } catch (err) {
      setError(`Invalid ${fileType.toUpperCase()}: ${(err as Error).message}`);
      setOutput('');
      setIsFormatted(false);
      
      toast({
        variant: "destructive",
        title: `Invalid ${fileType.toUpperCase()}`,
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
        description: "The formatted code has been copied to your clipboard.",
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

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (fileExtension === 'json') setFileType('json');
    else if (fileExtension === 'html' || fileExtension === 'htm') setFileType('html');
    else if (fileExtension === 'css') setFileType('css');
    else if (fileExtension === 'js') setFileType('javascript');
    else if (fileExtension === 'sql') setFileType('sql');
    else if (fileExtension === 'xml') setFileType('xml');
    else if (fileExtension === 'md' || fileExtension === 'markdown') setFileType('markdown');
    else setFileType('text');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const relatedFormatters = [
    { id: 'json-formatter', name: 'JSON Formatter', path: '/tools/json-formatter' },
    { id: 'html-minifier', name: 'HTML Minifier', path: '/tools/html-minifier' },
    { id: 'css-minifier', name: 'CSS Minifier', path: '/tools/css-minifier' },
    { id: 'js-minifier', name: 'JavaScript Minifier', path: '/tools/js-minifier' },
    { id: 'sql-formatter', name: 'SQL Formatter', path: '/tools/sql-formatter' },
    { id: 'markdown-to-html', name: 'Markdown to HTML', path: '/tools/markdown-to-html' },
  ];

  const recommendedFormatters = relatedFormatters.filter(formatter => {
    if (fileType === 'json' && formatter.id === 'json-formatter') return false;
    if (fileType === 'html' && formatter.id === 'html-minifier') return false;
    if (fileType === 'css' && formatter.id === 'css-minifier') return false;
    if (fileType === 'javascript' && formatter.id === 'js-minifier') return false;
    if (fileType === 'sql' && formatter.id === 'sql-formatter') return false;
    if (fileType === 'markdown' && formatter.id === 'markdown-to-html') return false;
    return true;
  }).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="mr-2"
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="text-center flex-grow">
              <h1 className="text-3xl font-bold mb-2">Dev Formatter</h1>
              <p className="text-muted-foreground">
                One tool for formatting ALL types of files - JSON, HTML, CSS, JavaScript, SQL, XML, Markdown and more
              </p>
            </div>
          </div>

          <Tabs defaultValue="json" onValueChange={(value) => setFileType(value as FileType)} className="mb-6">
            <TabsList className="grid grid-cols-4 md:grid-cols-8">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="sql">SQL</TabsTrigger>
              <TabsTrigger value="xml">XML</TabsTrigger>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Input {fileType.toUpperCase()}</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleClear}>
                    <Trash className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button size="sm" variant="outline" className="relative">
                    <input
                      type="file"
                      accept=".json,.html,.htm,.css,.js,.sql,.xml,.md,.markdown,.txt"
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
                placeholder={`Paste your ${fileType.toUpperCase()} here...`}
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="mt-4 space-x-2">
                <Button onClick={formatCode} variant="default">
                  <Code className="h-4 w-4 mr-1" />
                  Format
                </Button>
                <Button onClick={minifyCode} variant="outline">
                  Minify
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Formatted {fileType.toUpperCase()}</h2>
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
                  Formatted code will appear here
                </div>
              )}
              
              {isFormatted && !error && (
                <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                  ✓ Valid {fileType.toUpperCase()}
                </div>
              )}
            </Card>
          </div>

          <div className="mt-8 mb-6">
            <h2 className="text-xl font-semibold mb-4">Recommended Formatters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommendedFormatters.map((formatter) => (
                <Link key={formatter.id} to={formatter.path}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{formatter.name}</h3>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About Dev Formatter</h2>
            <Card className="p-6">
              <p className="mb-4">
                Dev Formatting is an all-in-one tool for developers to format and beautify various types of code and markup languages.
              </p>
              <h3 className="font-semibold mt-4 mb-2">Supported File Types:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <li>JSON</li>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>SQL</li>
                <li>XML</li>
                <li>Markdown</li>
                <li>Plain Text</li>
              </ul>
              <h3 className="font-semibold mt-4 mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Format and beautify code for improved readability</li>
                <li>Minify code to reduce file size</li>
                <li>Validate syntax for supported formats</li>
                <li>Upload files directly</li>
                <li>Copy formatted code to clipboard</li>
              </ul>
              <h3 className="font-semibold mt-4 mb-2">How to use:</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Select the file type from the tabs above</li>
                <li>Paste your code in the input field or upload a file</li>
                <li>Click "Format" to beautify or "Minify" to compress your code</li>
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

export default DevFormatting;
