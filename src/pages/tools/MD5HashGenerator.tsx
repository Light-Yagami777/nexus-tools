
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Key, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const MD5HashGenerator = () => {
  const [text, setText] = useState('');
  const [hash, setHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHash = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to generate MD5 hash.');
      return;
    }

    setIsGenerating(true);

    try {
      // Convert the text to an array of UTF-8 code units
      const utf8Encode = new TextEncoder();
      const data = utf8Encode.encode(text);

      // Generate the MD5 hash
      const buffer = await crypto.subtle.digest('MD5', data);
      
      // Convert the ArrayBuffer to a hex string
      const hashArray = Array.from(new Uint8Array(buffer));
      const md5Hash = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');

      setHash(md5Hash);
      toast.success('MD5 hash generated successfully!');
    } catch (error) {
      console.error('Error generating MD5 hash:', error);
      toast.error('Error generating MD5 hash. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!hash) {
      toast.error('No hash to copy.');
      return;
    }

    navigator.clipboard.writeText(hash)
      .then(() => toast.success('MD5 hash copied to clipboard'))
      .catch(() => toast.error('Failed to copy MD5 hash to clipboard'));
  };

  const clearText = () => {
    setText('');
    setHash('');
  };

  return (
    <ToolLayout 
      title="MD5 Hash Generator" 
      description="Generate MD5 hashes from text"
      icon={<Key className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card>
        <CardHeader>
          <CardTitle>MD5 Hash Generator</CardTitle>
          <CardDescription>
            Enter text to generate its MD5 hash.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="resize-none font-mono"
          />
          <div className="flex space-x-2">
            <Button onClick={generateHash} disabled={isGenerating || !text.trim()}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
            <Button variant="outline" onClick={clearText} disabled={isGenerating}>Clear</Button>
          </div>
          {hash && (
            <div className="border p-4 rounded-md bg-secondary">
              <div className="flex justify-between items-center">
                <p className="text-sm font-mono break-words">{hash}</p>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          )}
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2 text-sm">About MD5 Hash</h3>
            <p className="text-sm text-muted-foreground">
              MD5 is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value, 
              typically expressed as a 32-character hexadecimal number. While MD5 is no longer considered secure 
              for cryptographic purposes, it remains useful for checksums and non-security applications.
            </p>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default MD5HashGenerator;
