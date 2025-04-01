
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Lock, Unlock, Copy, Check, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const EncryptionDecryption = () => {
  const [text, setText] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentOperation, setCurrentOperation] = useState<string>('encrypt');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { toast } = useToast();

  // Function to convert string to ArrayBuffer
  const str2ab = (str: string) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  // Function to convert ArrayBuffer to string
  const ab2str = (buf: ArrayBuffer) => {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
  };

  // Function to generate encryption key from password
  const getKeyFromPassword = async (password: string, salt: Uint8Array) => {
    const passwordBuffer = str2ab(password);
    
    // Import the password as a key
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Derive a key from the password
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  // Encrypt function
  const encrypt = async () => {
    if (!text || !password) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both text and password."
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Generate a random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Get encryption key
      const key = await getKeyFromPassword(password, salt);
      
      // Encrypt the text
      const textBuffer = new TextEncoder().encode(text);
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        textBuffer
      );
      
      // Combine salt, IV, and encrypted data
      const encryptedArray = new Uint8Array(salt.byteLength + iv.byteLength + encryptedBuffer.byteLength);
      encryptedArray.set(salt, 0);
      encryptedArray.set(iv, salt.byteLength);
      encryptedArray.set(new Uint8Array(encryptedBuffer), salt.byteLength + iv.byteLength);
      
      // Convert to Base64 for storage/display
      const encryptedBase64 = btoa(String.fromCharCode.apply(null, Array.from(encryptedArray)));
      
      setResult(encryptedBase64);
      
      toast({
        title: "Encryption Complete",
        description: "Your text has been successfully encrypted."
      });
    } catch (error) {
      console.error('Encryption error:', error);
      
      toast({
        variant: "destructive",
        title: "Encryption Failed",
        description: "An error occurred during encryption."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Decrypt function
  const decrypt = async () => {
    if (!text || !password) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both encrypted text and password."
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Decode Base64 to get the combined array
      let encryptedArray;
      try {
        const binaryString = atob(text);
        encryptedArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          encryptedArray[i] = binaryString.charCodeAt(i);
        }
      } catch (e) {
        throw new Error('Invalid Base64 input');
      }
      
      // Extract salt, IV, and encrypted data
      const salt = encryptedArray.slice(0, 16);
      const iv = encryptedArray.slice(16, 16 + 12);
      const encryptedData = encryptedArray.slice(16 + 12);
      
      // Get decryption key
      const key = await getKeyFromPassword(password, salt);
      
      // Decrypt the data
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encryptedData
      );
      
      // Convert decrypted data to text
      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      
      setResult(decryptedText);
      
      toast({
        title: "Decryption Complete",
        description: "Your text has been successfully decrypted."
      });
    } catch (error) {
      console.error('Decryption error:', error);
      
      let errorMessage = "An error occurred during decryption.";
      if (error instanceof Error && error.message === 'Invalid Base64 input') {
        errorMessage = "Invalid encrypted format. Please check your input.";
      } else {
        errorMessage = "Failed to decrypt. The password may be incorrect.";
      }
      
      toast({
        variant: "destructive",
        title: "Decryption Failed",
        description: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcess = () => {
    if (currentOperation === 'encrypt') {
      encrypt();
    } else {
      decrypt();
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

  return (
    <ToolLayout 
      title="Encryption/Decryption" 
      description="Encrypt and decrypt text with AES-256"
      icon={<Lock className="h-6 w-6" />}
      extraPadding={true}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-6"
      >
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Text Encryption & Decryption</h1>
          <p className="text-muted-foreground">Secure your messages with AES-256 encryption</p>
        </div>
        
        <Tabs defaultValue="encrypt" onValueChange={setCurrentOperation}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          
          <Card className="p-6 mb-6">
            <div className="mb-4">
              <Label htmlFor="input-text">
                {currentOperation === 'encrypt' ? 'Text to Encrypt' : 'Text to Decrypt'}
              </Label>
              <Textarea
                id="input-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  currentOperation === 'encrypt'
                    ? 'Enter the text you want to encrypt...'
                    : 'Enter the encrypted text to decrypt...'
                }
                className="mt-2 min-h-32 font-mono"
              />
            </div>
            
            <div className="mb-6">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your encryption/decryption password"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {currentOperation === 'encrypt'
                  ? 'This password will be required to decrypt your text. Don\'t forget it!'
                  : 'Enter the password that was used to encrypt this text.'
                }
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleProcess} 
                disabled={isProcessing || !text || !password}
              >
                {isProcessing 
                  ? 'Processing...' 
                  : currentOperation === 'encrypt' 
                    ? <><Unlock className="h-4 w-4 mr-2" /> Encrypt</> 
                    : <><Unlock className="h-4 w-4 mr-2" /> Decrypt</>
                }
              </Button>
              
              <Button variant="outline" onClick={() => setText('')}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Input
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <Label htmlFor="result">
                {currentOperation === 'encrypt' ? 'Encrypted Result' : 'Decrypted Result'}
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
            
            <div className="bg-muted rounded-md p-4 min-h-32 font-mono text-sm break-all">
              {result || (
                <span className="text-muted-foreground">
                  {currentOperation === 'encrypt' 
                    ? 'Your encrypted text will appear here...' 
                    : 'Your decrypted text will appear here...'
                  }
                </span>
              )}
            </div>
            
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Shield className="h-4 w-4 mr-2" />
              <span>Encryption is performed in your browser. Your data never leaves your device.</span>
            </div>
          </Card>
        </Tabs>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">About This Tool</h2>
          <div className="space-y-4">
            <p>
              This tool uses the Web Cryptography API to perform AES-256-GCM encryption, a highly secure 
              encryption algorithm. The encryption process uses:
            </p>
            
            <ul className="list-disc list-inside space-y-1">
              <li>AES-256-GCM encryption algorithm</li>
              <li>PBKDF2 for key derivation with 100,000 iterations</li>
              <li>Unique salt and initialization vector (IV) for each encryption</li>
              <li>Base64 encoding for the encrypted output</li>
            </ul>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Security Notes:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Always use strong, unique passwords for important data</li>
                <li>This encryption is secure, but no encryption is unbreakable with a weak password</li>
                <li>The security of your encrypted data depends on keeping your password secret</li>
                <li>If you lose your password, there is no way to recover the encrypted data</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </ToolLayout>
  );
};

export default EncryptionDecryption;
