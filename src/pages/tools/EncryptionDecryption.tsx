
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Copy, Check, RefreshCw, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const EncryptionDecryption = () => {
  const [text, setText] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const validateInputs = () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Text Required",
        description: `Please enter text to ${operation}.`
      });
      return false;
    }
    
    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "Password Required",
        description: "Please enter a password for the operation."
      });
      return false;
    }
    
    return true;
  };

  // Function to encrypt text using AES-GCM
  const encryptText = async () => {
    if (!validateInputs()) return;
    
    setIsProcessing(true);
    
    try {
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      
      // Generate a key from the password
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      // Use salt and iterations for PBKDF2
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
      
      // Generate an initialization vector
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the data
      const encoded = encoder.encode(text);
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded
      );
      
      // Combine salt + iv + ciphertext and convert to base64
      const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.byteLength);
      combined.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);
      
      const base64Encoded = btoa(String.fromCharCode(...combined));
      setResult(base64Encoded);
      
      toast({
        title: "Encryption Successful",
        description: "Your text has been encrypted."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Encryption Failed",
        description: `Error: ${(error as Error).message}`
      });
      console.error("Encryption error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to decrypt text using AES-GCM
  const decryptText = async () => {
    if (!validateInputs()) return;
    
    setIsProcessing(true);
    
    try {
      // Decode the base64 string
      let combined;
      try {
        const binaryString = atob(text);
        combined = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          combined[i] = binaryString.charCodeAt(i);
        }
      } catch (e) {
        throw new Error("Invalid encrypted data format. Please check your input.");
      }
      
      // Extract salt, iv and ciphertext
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const ciphertext = combined.slice(28);
      
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      
      // Generate a key from the password
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
      
      // Decrypt the ciphertext
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );
      
      const decoder = new TextDecoder();
      const plaintext = decoder.decode(decrypted);
      
      setResult(plaintext);
      
      toast({
        title: "Decryption Successful",
        description: "Your text has been decrypted."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Decryption Failed",
        description: `Error: ${(error as Error).message}`
      });
      console.error("Decryption error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOperation = () => {
    if (operation === 'encrypt') {
      encryptText();
    } else {
      decryptText();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: "The result has been copied to your clipboard."
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const clearAll = () => {
    setText('');
    setPassword('');
    setResult('');
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
            <h1 className="text-3xl font-bold mb-2">Encryption & Decryption</h1>
            <p className="text-muted-foreground">
              Securely encrypt and decrypt text with a password
            </p>
          </div>

          <Tabs defaultValue="encrypt" onValueChange={(value) => setOperation(value as 'encrypt' | 'decrypt')}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
              <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
            </TabsList>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="mb-4">
                  <Label htmlFor="input-text">
                    {operation === 'encrypt' ? 'Text to Encrypt' : 'Encrypted Text'}
                  </Label>
                  <Textarea
                    id="input-text"
                    placeholder={operation === 'encrypt' 
                      ? "Enter the text you want to encrypt..." 
                      : "Enter the encrypted text to decrypt..."}
                    className="min-h-[150px] mt-2"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your encryption/decryption password"
                    className="mt-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Remember this password! You'll need it to decrypt your text later.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleOperation} 
                    disabled={isProcessing}
                    className="flex-grow"
                  >
                    {operation === 'encrypt' ? (
                      <><Lock className="h-4 w-4 mr-2" /> Encrypt</>
                    ) : (
                      <><Unlock className="h-4 w-4 mr-2" /> Decrypt</>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearAll}
                    disabled={isProcessing}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex justify-between items-center">
                  <Label htmlFor="result">
                    {operation === 'encrypt' ? 'Encrypted Result' : 'Decrypted Result'}
                  </Label>
                  {result && (
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      {isCopied ? (
                        <><Check className="h-4 w-4 mr-1" /> Copied!</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" /> Copy</>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="bg-muted p-4 rounded-md min-h-[150px] break-all">
                  {result || (
                    <span className="text-muted-foreground">
                      {operation === 'encrypt' 
                        ? "Encrypted text will appear here" 
                        : "Decrypted text will appear here"}
                    </span>
                  )}
                </div>
                
                <div className="mt-6 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>AES-256 Encryption with PBKDF2 key derivation</span>
                  </div>
                </div>
              </Card>
            </div>
          </Tabs>

          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">About Encryption & Decryption</h2>
            <div className="space-y-4">
              <p>
                This tool uses AES-256-GCM encryption with PBKDF2 key derivation to secure your data with a password.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">How It Works:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Your password is used to generate a secure encryption key</li>
                    <li>A unique salt and initialization vector ensure security</li>
                    <li>PBKDF2 with 100,000 iterations protects against brute-force attacks</li>
                    <li>AES-GCM provides authenticated encryption</li>
                    <li>All processing happens in your browser, not on our servers</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Security Tips:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Use a strong, unique password you can remember</li>
                    <li>Store your encrypted text safely</li>
                    <li>If you lose your password, your data cannot be recovered</li>
                    <li>For maximum security, use this tool on a trusted device</li>
                    <li>Refresh the page after using for sensitive information</li>
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

export default EncryptionDecryption;
