import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UrlEncoderDecoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('encode');

  const handleEncode = () => {
    try {
      if (!input.trim()) {
        toast.error('Please enter text to encode');
        return;
      }
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast.success('Text encoded successfully');
    } catch (error) {
      console.error('Encoding error:', error);
      toast.error('Failed to encode text');
    }
  };

  const handleDecode = () => {
    try {
      if (!input.trim()) {
        toast.error('Please enter text to decode');
        return;
      }
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast.success('Text decoded successfully');
    } catch (error) {
      console.error('Decoding error:', error);
      toast.error('Failed to decode text. Make sure the input is properly URL encoded');
    }
  };

  const copyToClipboard = () => {
    if (!output) {
      toast.error('No text to copy');
      return;
    }

    navigator.clipboard.writeText(output)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  const clearText = () => {
    setInput('');
    setOutput('');
  };

  return (
    <ToolLayout title="URL Encoder/Decoder" icon={<Link size={24} />}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>URL Encoder/Decoder</CardTitle>
            <CardDescription>
              Convert text to URL-safe format or decode URL-encoded strings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input</label>
                  <Textarea
                    placeholder={activeTab === 'encode' 
                      ? "Enter text to encode..." 
                      : "Enter URL-encoded text to decode..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-32 font-mono"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={activeTab === 'encode' ? handleEncode : handleDecode}
                  >
                    {activeTab === 'encode' ? 'Encode' : 'Decode'}
                  </Button>
                  <Button variant="outline" onClick={clearText}>
                    Clear
                  </Button>
                </div>

                {output && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Output</label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      readOnly
                      value={output}
                      className="h-32 font-mono bg-muted"
                    />
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About URL Encoding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                URL encoding converts characters that are either unsafe or reserved in URLs into a format that can be securely transmitted. It replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits.
              </p>
              <p>Common examples:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Space becomes %20</li>
                <li>? becomes %3F</li>
                <li>& becomes %26</li>
                <li>= becomes %3D</li>
                <li>/ becomes %2F</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default UrlEncoderDecoder;
