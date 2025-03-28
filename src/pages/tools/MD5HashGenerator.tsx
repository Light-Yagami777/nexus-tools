
import React, { useState, useRef } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Hash, Copy, Check, Upload, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const MD5HashGenerator = () => {
  const [inputText, setInputText] = useState<string>('');
  const [md5Hash, setMd5Hash] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateMD5 = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter text to generate MD5 hash."
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Convert string to ArrayBuffer
      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);
      
      // Generate MD5 hash using SubtleCrypto API
      const hashBuffer = await crypto.subtle.digest('MD5', data);
      
      // Convert ArrayBuffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setMd5Hash(hashHex);
      
      toast({
        title: "MD5 Hash Generated",
        description: "Your MD5 hash has been successfully generated."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Generating Hash",
        description: "An error occurred while generating the MD5 hash."
      });
      console.error("MD5 generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(md5Hash);
    setIsCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: "The MD5 hash has been copied to your clipboard."
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const clearInputs = () => {
    setInputText('');
    setMd5Hash('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            <h1 className="text-3xl font-bold mb-2">MD5 Hash Generator</h1>
            <p className="text-muted-foreground">
              Generate MD5 hash values from text or file input
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4">
                <Label htmlFor="input-text">Input Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter text to generate MD5 hash..."
                  className="min-h-[200px] mt-2"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button onClick={generateMD5} disabled={isGenerating}>
                  <Hash className="h-4 w-4 mr-2" />
                  Generate MD5 Hash
                </Button>
                
                <Button variant="outline" onClick={clearInputs}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                
                <div className="relative">
                  <Button variant="outline" className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <Label htmlFor="md5-output">MD5 Hash</Label>
                {md5Hash && (
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    {isCopied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                )}
              </div>
              
              <div className="bg-muted p-4 rounded-md font-mono break-all min-h-[80px] flex items-center">
                {md5Hash || "MD5 hash will appear here"}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Hash Details:</h3>
                <ul className="text-sm space-y-2">
                  <li><span className="font-medium">Algorithm:</span> MD5 (Message Digest 5)</li>
                  <li><span className="font-medium">Hash Length:</span> 128 bits (32 hexadecimal characters)</li>
                  <li><span className="font-medium">Character Set:</span> Hexadecimal (0-9, a-f)</li>
                </ul>
              </div>
            </Card>
          </div>

          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">About MD5 Hash</h2>
            <div className="space-y-4">
              <p>
                MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value, typically expressed as a 32-digit hexadecimal number.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Common Uses:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>File integrity verification</li>
                    <li>Digital signatures</li>
                    <li>Password storage (historically)</li>
                    <li>Data identification</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Security Considerations:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>MD5 is considered cryptographically broken</li>
                    <li>Vulnerable to collision attacks</li>
                    <li>Not recommended for security-critical applications</li>
                    <li>Use SHA-256 or SHA-3 for security purposes</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default MD5HashGenerator;
