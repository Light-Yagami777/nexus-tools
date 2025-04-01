
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Key, Search, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { toast } from "sonner";

// Hash patterns for identification
const hashPatterns = [
  { name: "MD5", regex: /^[a-f0-9]{32}$/i, bits: 128 },
  { name: "SHA-1", regex: /^[a-f0-9]{40}$/i, bits: 160 },
  { name: "SHA-256", regex: /^[a-f0-9]{64}$/i, bits: 256 },
  { name: "SHA-512", regex: /^[a-f0-9]{128}$/i, bits: 512 },
  { name: "SHA3-256", regex: /^[a-f0-9]{64}$/i, bits: 256 },
  { name: "SHA3-512", regex: /^[a-f0-9]{128}$/i, bits: 512 },
  { name: "RIPEMD-160", regex: /^[a-f0-9]{40}$/i, bits: 160 },
  { name: "Bcrypt", regex: /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9\.\/]{53}$/i, bits: null },
  { name: "MySQL", regex: /^\*[A-F0-9]{40}$/i, bits: null },
  { name: "Base64", regex: /^[a-zA-Z0-9+\/]+=*$/i, bits: null },
  { name: "CRC32", regex: /^[a-f0-9]{8}$/i, bits: 32 }
];

const HashIdentifier = () => {
  const [inputHash, setInputHash] = useState<string>('');
  const [identificationResults, setIdentificationResults] = useState<Array<any>>([]);
  const [isIdentifying, setIsIdentifying] = useState<boolean>(false);

  const identifyHash = () => {
    if (!inputHash.trim()) {
      toast.error('Please enter a hash value');
      return;
    }

    setIsIdentifying(true);
    
    const hash = inputHash.trim();
    const matchedPatterns = [];
    
    // Check against each pattern
    for (const pattern of hashPatterns) {
      if (pattern.regex.test(hash)) {
        matchedPatterns.push({
          name: pattern.name,
          bits: pattern.bits,
          confidence: calculateConfidence(hash, pattern)
        });
      }
    }
    
    // Sort by confidence
    matchedPatterns.sort((a, b) => b.confidence - a.confidence);
    
    setIdentificationResults(matchedPatterns);
    setIsIdentifying(false);
    
    if (matchedPatterns.length === 0) {
      toast.error('Could not identify the hash format');
    } else {
      toast.success(`Identified ${matchedPatterns.length} possible hash formats`);
    }
  };
  
  const calculateConfidence = (hash: string, pattern: any) => {
    // Simple confidence scoring
    let confidence = 75; // Base confidence
    
    // Adjust based on length and pattern specificity
    if (pattern.name === "Bcrypt" && hash.startsWith("$2")) confidence += 20;
    if (pattern.name === "MySQL" && hash.startsWith("*")) confidence += 20;
    if (pattern.name === "SHA-256" && hash.length === 64) confidence += 5;
    if (pattern.name === "MD5" && hash.length === 32) confidence += 5;
    
    return Math.min(confidence, 100);
  };

  const clearInput = () => {
    setInputHash('');
    setIdentificationResults([]);
  };

  return (
    <ToolLayout 
      title="Hash Identifier" 
      description="Identify the type of hash"
      icon={<Key className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Hash Identifier</h1>
            <p className="text-muted-foreground">
              Identify the type of hash function used to generate a hash
            </p>
          </div>
          
          <Card className="p-6 mb-6">
            <div>
              <Label htmlFor="hash-input">Enter Hash Value</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="hash-input"
                  placeholder="e.g., 5f4dcc3b5aa765d61d8327deb882cf99"
                  value={inputHash}
                  onChange={(e) => setInputHash(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={identifyHash} disabled={isIdentifying}>
                  {isIdentifying ? (
                    'Identifying...'
                  ) : (
                    <><Search className="h-4 w-4 mr-2" /> Identify</>
                  )}
                </Button>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={clearInput}>Clear</Button>
              </div>
            </div>
          </Card>
          
          {identificationResults.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Identification Results</h2>
              <div className="space-y-4">
                {identificationResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-md border ${
                      index === 0 ? 'bg-primary/10 border-primary/20' : 'bg-muted border-muted-foreground/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {result.confidence > 70 ? (
                          <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <ShieldAlert className="h-5 w-5 mr-2 text-muted-foreground" />
                        )}
                        <span className="font-medium">{result.name}</span>
                      </div>
                      <span className="text-sm bg-muted-foreground/10 px-2 py-1 rounded text-muted-foreground">
                        {result.confidence}% confidence
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {result.bits && <span>Bit length: {result.bits} bits</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">About Hash Identification</h2>
            <div className="space-y-4">
              <p>
                Hash functions convert data of arbitrary size into fixed-size values. Different hash algorithms 
                produce outputs with recognizable patterns, typically varying in length and character composition.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Common Hash Types</h3>
                  <ul className="space-y-1 text-sm">
                    <li><span className="font-medium">MD5:</span> 32 hexadecimal characters</li>
                    <li><span className="font-medium">SHA-1:</span> 40 hexadecimal characters</li>
                    <li><span className="font-medium">SHA-256:</span> 64 hexadecimal characters</li>
                    <li><span className="font-medium">SHA-512:</span> 128 hexadecimal characters</li>
                    <li><span className="font-medium">Bcrypt:</span> Starts with $2a$, $2b$ or $2y$</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Security Recommendations</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Avoid using MD5 and SHA-1 for passwords (vulnerable)</li>
                    <li>For passwords, use bcrypt, Argon2, or PBKDF2</li>
                    <li>For data integrity, SHA-256 or SHA-512 are suitable</li>
                    <li>Always use salt with password hashes</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default HashIdentifier;
