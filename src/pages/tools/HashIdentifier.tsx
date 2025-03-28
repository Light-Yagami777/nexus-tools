
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

type HashType = {
  name: string;
  description: string;
  regex: RegExp;
  length: number;
  confidence: 'high' | 'medium' | 'low';
};

const HashIdentifier = () => {
  const [hashInput, setHashInput] = useState<string>('');
  const [identifiedHashes, setIdentifiedHashes] = useState<HashType[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const { toast } = useToast();

  const hashTypes: HashType[] = [
    { name: 'MD5', description: 'Message Digest 5', regex: /^[a-f0-9]{32}$/i, length: 32, confidence: 'high' },
    { name: 'SHA-1', description: 'Secure Hash Algorithm 1', regex: /^[a-f0-9]{40}$/i, length: 40, confidence: 'high' },
    { name: 'SHA-256', description: 'Secure Hash Algorithm 256', regex: /^[a-f0-9]{64}$/i, length: 64, confidence: 'high' },
    { name: 'SHA-384', description: 'Secure Hash Algorithm 384', regex: /^[a-f0-9]{96}$/i, length: 96, confidence: 'high' },
    { name: 'SHA-512', description: 'Secure Hash Algorithm 512', regex: /^[a-f0-9]{128}$/i, length: 128, confidence: 'high' },
    { name: 'RIPEMD-160', description: 'RACE Integrity Primitives Evaluation Message Digest', regex: /^[a-f0-9]{40}$/i, length: 40, confidence: 'medium' },
    { name: 'Whirlpool', description: 'Whirlpool Hash', regex: /^[a-f0-9]{128}$/i, length: 128, confidence: 'medium' },
    { name: 'MD4', description: 'Message Digest 4', regex: /^[a-f0-9]{32}$/i, length: 32, confidence: 'medium' },
    { name: 'MD2', description: 'Message Digest 2', regex: /^[a-f0-9]{32}$/i, length: 32, confidence: 'medium' },
    { name: 'CRC32', description: 'Cyclic Redundancy Check 32', regex: /^[a-f0-9]{8}$/i, length: 8, confidence: 'high' },
    { name: 'LM Hash', description: 'LAN Manager Hash', regex: /^[a-f0-9]{32}$/i, length: 32, confidence: 'low' },
    { name: 'NTLM', description: 'NT LAN Manager', regex: /^[a-f0-9]{32}$/i, length: 32, confidence: 'low' },
    { name: 'MySQL', description: 'MySQL Hash', regex: /^[a-f0-9]{16}$/i, length: 16, confidence: 'high' },
    { name: 'SHA-224', description: 'Secure Hash Algorithm 224', regex: /^[a-f0-9]{56}$/i, length: 56, confidence: 'high' },
    { name: 'Base64', description: 'Base64 Encoded String', regex: /^[A-Za-z0-9+/]+={0,2}$/, length: 0, confidence: 'medium' },
    { name: 'Bcrypt', description: 'Bcrypt Hash', regex: /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/, length: 60, confidence: 'high' },
    { name: 'PBKDF2', description: 'Password-Based Key Derivation Function 2', regex: /^[a-f0-9]{64,}$/i, length: 64, confidence: 'low' },
  ];

  const identifyHash = () => {
    if (!hashInput.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter a hash value to identify."
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Clean input
    const cleanedHash = hashInput.trim();
    const matchedHashes: HashType[] = [];
    
    // Check against all hash patterns
    for (const hashType of hashTypes) {
      if (hashType.regex.test(cleanedHash) && (hashType.length === 0 || cleanedHash.length === hashType.length)) {
        matchedHashes.push(hashType);
      }
    }
    
    // Sort by confidence
    matchedHashes.sort((a, b) => {
      const confidenceOrder = { high: 0, medium: 1, low: 2 };
      return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    });
    
    setIdentifiedHashes(matchedHashes);
    
    if (matchedHashes.length > 0) {
      toast({
        title: "Hash Identified",
        description: `Found ${matchedHashes.length} possible hash types.`
      });
    } else {
      toast({
        variant: "destructive",
        title: "No Matches Found",
        description: "Could not identify the hash type. Please check your input."
      });
    }
    
    setIsAnalyzing(false);
  };

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      case 'low': return 'text-red-600 dark:text-red-400';
      default: return '';
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
            <h1 className="text-3xl font-bold mb-2">Hash Identifier</h1>
            <p className="text-muted-foreground">
              Identify different types of cryptographic hashes
            </p>
          </div>

          <Card className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
              <Label htmlFor="hash-input">Enter Hash Value</Label>
              <div className="flex mt-2">
                <Input
                  id="hash-input"
                  placeholder="Paste your hash here..."
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  onClick={identifyHash} 
                  disabled={isAnalyzing} 
                  className="ml-2"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Identify
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-3">Results</h2>
              
              {identifiedHashes.length === 0 ? (
                <div className="p-4 bg-muted rounded-md flex items-center justify-center text-center">
                  <p>Enter a hash value above to identify its type</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {identifiedHashes.map((hash, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{hash.name}</h3>
                          <p className="text-sm text-muted-foreground">{hash.description}</p>
                        </div>
                        <div className={`flex items-center ${getConfidenceColor(hash.confidence)}`}>
                          {hash.confidence === 'high' ? (
                            <ShieldCheck className="h-4 w-4 mr-1" />
                          ) : (
                            <ShieldAlert className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-sm capitalize">{hash.confidence} confidence</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Length:</span> {hash.length} characters
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 mt-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Common Hash Types</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">MD5</h3>
                <p className="text-sm">32 characters, hexadecimal. Commonly used but highly insecure.</p>
                <p className="text-xs font-mono mt-1 bg-muted p-1 rounded">Example: 5d41402abc4b2a76b9719d911017c592</p>
              </div>
              
              <div>
                <h3 className="font-medium">SHA-1</h3>
                <p className="text-sm">40 characters, hexadecimal. Considered cryptographically broken.</p>
                <p className="text-xs font-mono mt-1 bg-muted p-1 rounded">Example: aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d</p>
              </div>
              
              <div>
                <h3 className="font-medium">SHA-256</h3>
                <p className="text-sm">64 characters, hexadecimal. Widely used in security applications.</p>
                <p className="text-xs font-mono mt-1 bg-muted p-1 rounded">Example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</p>
              </div>
              
              <div>
                <h3 className="font-medium">bcrypt</h3>
                <p className="text-sm">~60 characters, starts with "$2a$", "$2b$", or "$2y$". Strong password hashing.</p>
                <p className="text-xs font-mono mt-1 bg-muted p-1 rounded overflow-x-auto">Example: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default HashIdentifier;
