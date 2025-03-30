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

  const generateHash = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to generate MD5 hash.');
      return;
    }

    try {
      // Convert the text to an array of UTF-8 code units
      const utf8Encode = new TextEncoder();
      const data = utf8Encode.encode(text);

      // Generate the MD5 hash
      const buffer = await crypto.subtle.digest('MD5', data);
      const hashArray = Array.from(new Uint8Array(buffer));
      const md5Hash = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');

      setHash(md5Hash);
      toast.success('MD5 hash generated successfully!');
    } catch (error) {
      toast.error('Error generating MD5 hash.');
      console.error(error);
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
            <Button onClick={generateHash}>Generate</Button>
            <Button variant="outline" onClick={clearText}>Clear</Button>
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
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default MD5HashGenerator;
