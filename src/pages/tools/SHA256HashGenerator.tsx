import React from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Key } from 'lucide-react';

const SHA256HashGenerator = () => {
  const [inputText, setInputText] = useState<string>('');
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateSHA256 = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter text to generate SHA-256 hash."
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setSha256Hash(hashHex);
      
      toast({
        title: "SHA-256 Hash Generated",
        description: "Your SHA-256 hash has been successfully generated."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Generating Hash",
        description: "An error occurred while generating the SHA-256 hash."
      });
      console.error("SHA-256 generation error:", error);
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
    navigator.clipboard.writeText(sha256Hash);
    setIsCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: "The SHA-256 hash has been copied to your clipboard."
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const clearInputs = () => {
    setInputText('');
    setSha256Hash('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolLayout 
      title="SHA256 Hash Generator" 
      description="Generate SHA256 hashes from text"
      icon={<Key className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">SHA-256 Hash Generator</h1>
            <p className="text-muted-foreground">
              Generate secure SHA-256 hash values from text or file input
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4">
                <Label htmlFor="input-text">Input Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter text to generate SHA-256 hash..."
                  className="min-h-[200px] mt-2"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button onClick={generateSHA256} disabled={isGenerating}>
                  <Shield className="h-4 w-4 mr-2" />
                  Generate SHA-256 Hash
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
                <Label htmlFor="sha256-output">SHA-256 Hash</Label>
                {sha256Hash && (
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
              
              <div className="bg-muted p-4 rounded-md font-mono break-all min-h-[80px] flex items-center text-xs md:text-sm">
                {sha256Hash || "SHA-256 hash will appear here"}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Hash Details:</h3>
                <ul className="text-sm space-y-2">
                  <li><span className="font-medium">Algorithm:</span> SHA-256 (Secure Hash Algorithm 256-bit)</li>
                  <li><span className="font-medium">Hash Length:</span> 256 bits (64 hexadecimal characters)</li>
                  <li><span className="font-medium">Character Set:</span> Hexadecimal (0-9, a-f)</li>
                </ul>
              </div>
            </Card>
          </div>

          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">About SHA-256 Hash</h2>
            <div className="space-y-4">
              <p>
                SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that takes an input and produces a 256-bit (32-byte) hash value, typically rendered as a hexadecimal number, 64 digits long.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Common Uses:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Digital signatures</li>
                    <li>SSL/TLS certificates</li>
                    <li>Password storage (with additional salting)</li>
                    <li>Blockchain technology</li>
                    <li>File integrity verification</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Security Features:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Part of the SHA-2 family of hash functions</li>
                    <li>No known practical collision attacks</li>
                    <li>Widely used in security applications</li>
                    <li>Resistant to brute force attacks</li>
                    <li>Recommended by NIST for sensitive applications</li>
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

export default SHA256HashGenerator;
