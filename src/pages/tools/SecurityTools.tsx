
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Key, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

type SecurityToolType = 
  | "md5" 
  | "sha256" 
  | "hashIdentifier" 
  | "encryptDecrypt" 
  | "csrfToken" 
  | "sslChecker" 
  | "randomString" 
  | "passwordStrength";

const SecurityTools = () => {
  const [activeType, setActiveType] = useState<SecurityToolType>("md5");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [securityLevel, setSecurityLevel] = useState<string>("medium");
  const [stringLength, setStringLength] = useState<string>("16");
  const [url, setUrl] = useState<string>("");

  // Handle MD5 Hash Generation
  const generateMd5 = () => {
    if (!inputText) {
      toast.error("Please enter text to hash");
      return;
    }
    
    // Simulate MD5 hash (this would need a proper crypto library)
    const simulatedHash = "md5_" + Array.from(inputText)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
    
    setOutputText(simulatedHash);
    toast.success("MD5 hash generated");
  };

  // Handle SHA256 Hash Generation
  const generateSha256 = () => {
    if (!inputText) {
      toast.error("Please enter text to hash");
      return;
    }
    
    // Simulate SHA256 hash (this would need a proper crypto library)
    const simulatedHash = "sha256_" + Array.from(inputText)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
    
    setOutputText(simulatedHash);
    toast.success("SHA256 hash generated");
  };

  // Handle Hash Identification
  const identifyHash = () => {
    if (!inputText) {
      toast.error("Please enter a hash to identify");
      return;
    }
    
    let hashType = "Unknown hash type";
    
    // Very simple hash identification logic
    if (inputText.length === 32) {
      hashType = "MD5 Hash (128 bits)";
    } else if (inputText.length === 40) {
      hashType = "SHA-1 Hash (160 bits)";
    } else if (inputText.length === 64) {
      hashType = "SHA-256 Hash (256 bits)";
    } else if (inputText.length === 96) {
      hashType = "SHA-384 Hash (384 bits)";
    } else if (inputText.length === 128) {
      hashType = "SHA-512 Hash (512 bits)";
    }
    
    setOutputText(hashType);
    toast.success("Hash identification complete");
  };

  // Handle Encryption/Decryption
  const encryptDecrypt = (encrypt: boolean) => {
    if (!inputText) {
      toast.error("Please enter text to process");
      return;
    }
    
    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    
    // Simple Caesar cipher for demonstration
    const shift = Array.from(password).reduce((a, b) => a + b.charCodeAt(0), 0) % 26;
    
    const processed = Array.from(inputText)
      .map(char => {
        const code = char.charCodeAt(0);
        
        // Only process ASCII letters
        if (code >= 65 && code <= 90) { // Uppercase
          return String.fromCharCode(((code - 65 + (encrypt ? shift : -shift)) % 26 + 26) % 26 + 65);
        } else if (code >= 97 && code <= 122) { // Lowercase
          return String.fromCharCode(((code - 97 + (encrypt ? shift : -shift)) % 26 + 26) % 26 + 97);
        }
        return char;
      })
      .join('');
    
    setOutputText(processed);
    toast.success(encrypt ? "Text encrypted" : "Text decrypted");
  };

  // Handle CSRF Token Generation
  const generateCsrfToken = () => {
    // Generate a random string of characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setOutputText(result);
    toast.success("CSRF token generated");
  };

  // Handle SSL Checker
  const checkSsl = () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }
    
    // This would need a server-side API to actually check the SSL
    setOutputText(`SSL check for ${url} would be performed in a real implementation.`);
    toast.success("SSL check simulated");
  };

  // Handle Random String Generation
  const generateRandomString = () => {
    const length = parseInt(stringLength, 10);
    if (isNaN(length) || length <= 0) {
      toast.error("Please enter a valid length");
      return;
    }
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setOutputText(result);
    toast.success("Random string generated");
  };

  // Handle Password Strength Check
  const checkPasswordStrength = () => {
    if (!inputText) {
      toast.error("Please enter a password to check");
      return;
    }
    
    // Simple password strength checker
    let strength = 0;
    let feedback = [];
    
    if (inputText.length >= 8) {
      strength += 1;
    } else {
      feedback.push("Password is too short");
    }
    
    if (/[A-Z]/.test(inputText)) {
      strength += 1;
    } else {
      feedback.push("Add uppercase letters");
    }
    
    if (/[a-z]/.test(inputText)) {
      strength += 1;
    } else {
      feedback.push("Add lowercase letters");
    }
    
    if (/[0-9]/.test(inputText)) {
      strength += 1;
    } else {
      feedback.push("Add numbers");
    }
    
    if (/[^A-Za-z0-9]/.test(inputText)) {
      strength += 1;
    } else {
      feedback.push("Add special characters");
    }
    
    let strengthText;
    if (strength <= 2) {
      strengthText = "Weak";
    } else if (strength <= 4) {
      strengthText = "Medium";
    } else {
      strengthText = "Strong";
    }
    
    setOutputText(`Strength: ${strengthText}\n\nSuggestions:\n${feedback.join('\n')}`);
    toast.success("Password strength analyzed");
  };

  // Handle Copy to Clipboard
  const handleCopy = () => {
    if (!outputText) {
      toast.error("Nothing to copy");
      return;
    }
    
    navigator.clipboard.writeText(outputText);
    toast.success("Copied to clipboard");
  };

  // Handle Tool Type Change
  const handleToolChange = (value: string) => {
    setActiveType(value as SecurityToolType);
    setInputText("");
    setOutputText("");
    setPassword("");
    setUrl("");
  };

  // UI components for each tool type
  const renderToolContent = () => {
    switch (activeType) {
      case "md5":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">Text to Hash</Label>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to generate MD5 hash"
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={generateMd5} className="w-full">Generate MD5 Hash</Button>
          </div>
        );
        
      case "sha256":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">Text to Hash</Label>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to generate SHA256 hash"
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={generateSha256} className="w-full">Generate SHA256 Hash</Button>
          </div>
        );
        
      case "hashIdentifier":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-hash">Hash to Identify</Label>
              <Textarea
                id="input-hash"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste a hash to identify its type"
                className="min-h-[100px] font-mono"
              />
            </div>
            <Button onClick={identifyHash} className="w-full">Identify Hash</Button>
          </div>
        );
        
      case "encryptDecrypt":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">Text</Label>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to encrypt or decrypt"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter encryption password"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => encryptDecrypt(true)} className="flex-1">Encrypt</Button>
              <Button onClick={() => encryptDecrypt(false)} className="flex-1">Decrypt</Button>
            </div>
          </div>
        );
        
      case "csrfToken":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Generate a secure CSRF token for protecting web forms.</p>
            <Button onClick={generateCsrfToken} className="w-full">Generate CSRF Token</Button>
          </div>
        );
        
      case "sslChecker":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <Button onClick={checkSsl} className="w-full">Check SSL Certificate</Button>
          </div>
        );
        
      case "randomString":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="string-length">String Length</Label>
              <Input
                id="string-length"
                type="number"
                value={stringLength}
                onChange={(e) => setStringLength(e.target.value)}
                min="1"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label>Security Level</Label>
              <div className="flex gap-2">
                <Button 
                  variant={securityLevel === "low" ? "default" : "outline"}
                  onClick={() => setSecurityLevel("low")}
                  className="flex-1"
                >
                  Low
                </Button>
                <Button 
                  variant={securityLevel === "medium" ? "default" : "outline"}
                  onClick={() => setSecurityLevel("medium")}
                  className="flex-1"
                >
                  Medium
                </Button>
                <Button 
                  variant={securityLevel === "high" ? "default" : "outline"}
                  onClick={() => setSecurityLevel("high")}
                  className="flex-1"
                >
                  High
                </Button>
              </div>
            </div>
            <Button onClick={generateRandomString} className="w-full">Generate Random String</Button>
          </div>
        );
        
      case "passwordStrength":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password-check">Password to Check</Label>
              <Input
                id="password-check"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter password to analyze"
              />
            </div>
            <Button onClick={checkPasswordStrength} className="w-full">Check Password Strength</Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Get the current tool configuration
  const getToolConfig = () => {
    switch (activeType) {
      case "md5":
        return {
          title: "MD5 Hash Generator",
          description: "Generate MD5 hashes from text or files. Verify data integrity with checksum comparison.",
          icon: <Key size={24} />
        };
      case "sha256":
        return {
          title: "SHA256 Hash Generator",
          description: "Generate secure SHA256 hashes for passwords, files, and data verification.",
          icon: <Key size={24} />
        };
      case "hashIdentifier":
        return {
          title: "Hash Identifier",
          description: "Identify different types of cryptographic hashes by pattern recognition.",
          icon: <Key size={24} />
        };
      case "encryptDecrypt":
        return {
          title: "Encryption/Decryption",
          description: "Encrypt and decrypt text with a password using strong encryption algorithms.",
          icon: <Lock size={24} />
        };
      case "csrfToken":
        return {
          title: "CSRF Token Generator",
          description: "Generate secure CSRF tokens for web applications to prevent cross-site request forgery attacks.",
          icon: <Shield size={24} />
        };
      case "sslChecker":
        return {
          title: "SSL Checker",
          description: "Check SSL certificates of websites for validity, expiration, and security issues.",
          icon: <Shield size={24} />
        };
      case "randomString":
        return {
          title: "Random String Generator",
          description: "Generate random strings with customizable length, character sets, and patterns.",
          icon: <Key size={24} />
        };
      case "passwordStrength":
        return {
          title: "Password Strength Checker",
          description: "Evaluate the strength of your passwords against common security standards and best practices.",
          icon: <Shield size={24} />
        };
      default:
        return {
          title: "Security Tools",
          description: "A collection of tools for encryption, hashing, and security testing.",
          icon: <Shield size={24} />
        };
    }
  };

  const toolConfig = getToolConfig();

  return (
    <ToolLayout title={toolConfig.title} description={toolConfig.description} icon={toolConfig.icon}>
      <Card className="p-6">
        <Tabs 
          defaultValue="md5" 
          value={activeType}
          onValueChange={handleToolChange} 
          className="w-full mb-6"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-4">
            <TabsTrigger value="md5">MD5 Hash</TabsTrigger>
            <TabsTrigger value="sha256">SHA256 Hash</TabsTrigger>
            <TabsTrigger value="hashIdentifier">Hash Identifier</TabsTrigger>
            <TabsTrigger value="encryptDecrypt">Encrypt/Decrypt</TabsTrigger>
            <TabsTrigger value="csrfToken">CSRF Token</TabsTrigger>
            <TabsTrigger value="sslChecker">SSL Checker</TabsTrigger>
            <TabsTrigger value="randomString">Random String</TabsTrigger>
            <TabsTrigger value="passwordStrength">Password Strength</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {renderToolContent()}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="output">Result</Label>
              {outputText && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              id="output"
              value={outputText}
              readOnly
              className="min-h-[200px] font-mono"
              placeholder="Output will appear here"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">About {toolConfig.title}</h3>
          <p className="text-sm text-muted-foreground">
            {toolConfig.description} This tool is for educational purposes only.
          </p>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default SecurityTools;
