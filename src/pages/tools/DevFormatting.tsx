
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { FileType, Dices } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormatterInput from './formatter/FormatterInput';
import FormatterOutput from './formatter/FormatterOutput';
import FormatterRecommendations from './formatter/FormatterRecommendations';
import FormatterAbout from './formatter/FormatterAbout';
import { formatCodeByType, minifyCodeByType, detectFileType } from './formatter/FormatterUtils';

type FileType = 'json' | 'html' | 'css' | 'javascript' | 'sql' | 'xml' | 'markdown' | 'text';

const DevFormatting = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileType, setFileType] = useState<FileType>('json');
  const [isFormatted, setIsFormatted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatCode = () => {
    try {
      const formatted = formatCodeByType(input, fileType);
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
      const minified = minifyCodeByType(input, fileType);
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
    
    const detectedFileType = detectFileType(file.name);
    setFileType(detectedFileType);

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
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Formatter</h1>
            <p className="text-muted-foreground">
              One tool for formatting ALL types of files - JSON, HTML, CSS, JavaScript, SQL, XML, Markdown and more
            </p>
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
            <FormatterInput 
              input={input}
              setInput={setInput}
              fileType={fileType}
              handleClear={handleClear}
              handleFileUpload={handleFileUpload}
              formatCode={formatCode}
              minifyCode={minifyCode}
            />

            <FormatterOutput 
              output={output}
              error={error}
              fileType={fileType}
              isFormatted={isFormatted}
              isCopied={isCopied}
              handleCopy={handleCopy}
            />
          </div>

          <FormatterRecommendations fileType={fileType} />
          <FormatterAbout />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default DevFormatting;
