import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Copy, Check, RefreshCw, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const CSRFTokenGenerator = () => {
  const [token, setToken] = useState<string>('');
  const [tokenLength, setTokenLength] = useState<number>(32);
  const [tokenType, setTokenType] = useState<'alphanumeric' | 'hex'>('hex');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [htmlExample, setHtmlExample] = useState<string>('');
  const [phpExample, setPhpExample] = useState<string>('');
  const [jsExample, setJsExample] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    generateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateToken = () => {
    let newToken = '';
    const length = Math.max(16, Math.min(128, tokenLength));

    if (tokenType === 'hex') {
      const array = new Uint8Array(Math.ceil(length / 2));
      crypto.getRandomValues(array);
      newToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      newToken = Array.from(array, num => chars[num % chars.length]).join('');
    }

    setToken(newToken);
    updateExamples(newToken);
  };

  const updateExamples = (newToken: string) => {
    // HTML form example
    const htmlCode = `<form action="/process" method="POST">
  <input type="hidden" name="csrf_token" value="${newToken}">
  <!-- other form fields -->
  <button type="submit">Submit</button>
</form>`;

    // PHP example
    const phpCode = `<?php
// Store the token in session
session_start();
$_SESSION['csrf_token'] = '${newToken}';

// Later, verify the token
if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    die('CSRF token validation failed');
}
?>`;

    // JavaScript example
    const jsCode = `// Add CSRF token to all AJAX requests
const csrfToken = '${newToken}';

// Using fetch
fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(data)
});

// Using Axios
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;`;

    setHtmlExample(htmlCode);
    setPhpExample(phpCode);
    setJsExample(jsCode);
  };

  const copyToClipboard = (text: string, type: string = 'token') => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: `The ${type} has been copied to your clipboard.`
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
            <h1 className="text-3xl font-bold mb-2">CSRF Token Generator</h1>
            <p className="text-muted-foreground">
              Generate secure CSRF tokens to protect your web forms and API endpoints
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="token-length">Token Length</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="token-length"
                      type="number"
                      min="16"
                      max="128"
                      value={tokenLength}
                      onChange={(e) => setTokenLength(parseInt(e.target.value) || 32)}
                    />
                    <Button variant="outline" onClick={() => setTokenLength(32)}>Reset</Button>
                  </div>
                </div>
                
                <div>
                  <Label>Token Type</Label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="hex"
                        name="tokenType"
                        value="hex"
                        checked={tokenType === 'hex'}
                        onChange={() => setTokenType('hex')}
                        className="mr-2"
                      />
                      <Label htmlFor="hex" className="cursor-pointer">Hexadecimal</Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="alphanumeric"
                        name="tokenType"
                        value="alphanumeric"
                        checked={tokenType === 'alphanumeric'}
                        onChange={() => setTokenType('alphanumeric')}
                        className="mr-2"
                      />
                      <Label htmlFor="alphanumeric" className="cursor-pointer">Alphanumeric</Label>
                    </div>
                  </div>
                </div>
                
                <Button onClick={generateToken} className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Generate CSRF Token
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <Label>Generated Token</Label>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(token)}>
                  {isCopied ? (
                    <><Check className="h-4 w-4 mr-1" /> Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-1" /> Copy</>
                  )}
                </Button>
              </div>
              
              <div className="bg-muted p-4 rounded-md font-mono break-all text-sm">
                {token || "Click 'Generate CSRF Token' to create a new token"}
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>This token is generated using cryptographically secure random values</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
            
            <Tabs defaultValue="html">
              <TabsList className="mb-4">
                <TabsTrigger value="html">HTML Form</TabsTrigger>
                <TabsTrigger value="php">PHP</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html">
                <div className="relative">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(htmlExample, 'HTML example')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {htmlExample || "Generate a token first"}
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="php">
                <div className="relative">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(phpExample, 'PHP example')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {phpExample || "Generate a token first"}
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="js">
                <div className="relative">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(jsExample, 'JavaScript example')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {jsExample || "Generate a token first"}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">About CSRF Protection</h2>
            <div className="space-y-4">
              <p>
                Cross-Site Request Forgery (CSRF) is a type of attack that tricks users into submitting requests to a website they're currently authenticated with.
                CSRF tokens help protect against these attacks by requiring a unique, unpredictable value with each request.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Implementation Tips:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Store the token in a server-side session</li>
                    <li>Include the token in all forms as a hidden field</li>
                    <li>Add the token to headers for AJAX requests</li>
                    <li>Validate the token on every state-changing request</li>
                    <li>Regenerate tokens periodically for better security</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Best Practices:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Use HTTPS to protect token transmission</li>
                    <li>Implement token verification on the server side</li>
                    <li>Make tokens unique per user and session</li>
                    <li>Use double-submit cookies for API protection</li>
                    <li>Combine with other security measures (SameSite cookies, etc.)</li>
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

export default CSRFTokenGenerator;
