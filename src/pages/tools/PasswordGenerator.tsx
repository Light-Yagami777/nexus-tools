
import { useState, useEffect, useRef } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PasswordGenerator = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const passwordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+{}[]|:;<>,.?/~`-=";

    let chars = "";
    let generatedPassword = "";

    if (includeLowercase) chars += lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars.length === 0) {
      setPassword("Please select at least one character type");
      return;
    }

    // Ensure at least one character from each selected type
    if (includeUppercase) {
      generatedPassword += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    }
    if (includeLowercase) {
      generatedPassword += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    }
    if (includeNumbers) {
      generatedPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    if (includeSymbols) {
      generatedPassword += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    // Fill the rest of the password with random characters
    for (let i = generatedPassword.length; i < length; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Shuffle the password
    generatedPassword = generatedPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(generatedPassword);
  };

  const calculatePasswordStrength = () => {
    let strength = 0;
    
    if (password.length > 0) {
      // Length factor
      strength += Math.min(password.length / 32, 1) * 25;
      
      // Character diversity factor
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      
      // Adjust for redundancy
      if (password.length < 8) strength = Math.min(strength, 50);
    }
    
    setPasswordStrength(Math.min(100, strength));
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(
      () => {
        setCopied(true);
        toast({
          title: "Password copied!",
          description: "The password has been copied to your clipboard.",
          duration: 2000,
        });
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-32 pb-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-12 text-center"
          >
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
              Security & Encryption
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Password Generator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Generate secure, random passwords that are impossible to crack. Customize length and character types.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerVariants}
          >
            {/* Password Display */}
            <motion.div 
              variants={itemVariants}
              className="glass-card p-6 rounded-2xl mb-8 relative overflow-hidden"
            >
              <div
                ref={passwordRef}
                className="bg-background/50 p-6 rounded-lg border border-border text-xl font-mono overflow-x-auto whitespace-nowrap"
              >
                {password}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <motion.div 
                  className={`h-full ${getStrengthColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm font-medium">
                  Strength: <span className={`font-bold ${getStrengthColor().replace('bg-', 'text-')}`}>{getStrengthLabel()}</span>
                </span>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generatePassword}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Regenerate</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Settings */}
            <motion.div 
              variants={itemVariants}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-6">Password Settings</h3>
              
              {/* Length Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Password Length</label>
                  <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">{length}</span>
                </div>
                <Slider
                  value={[length]}
                  min={4}
                  max={64}
                  step={1}
                  onValueChange={(value) => setLength(value[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>4</span>
                  <span>64</span>
                </div>
              </div>
              
              {/* Character Types */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2">Character Types</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between glass p-4 rounded-lg">
                    <label className="text-sm">Include Uppercase Letters</label>
                    <Switch
                      checked={includeUppercase}
                      onCheckedChange={setIncludeUppercase}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between glass p-4 rounded-lg">
                    <label className="text-sm">Include Lowercase Letters</label>
                    <Switch
                      checked={includeLowercase}
                      onCheckedChange={setIncludeLowercase}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between glass p-4 rounded-lg">
                    <label className="text-sm">Include Numbers</label>
                    <Switch
                      checked={includeNumbers}
                      onCheckedChange={setIncludeNumbers}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between glass p-4 rounded-lg">
                    <label className="text-sm">Include Symbols</label>
                    <Switch
                      checked={includeSymbols}
                      onCheckedChange={setIncludeSymbols}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Tips Section */}
            <motion.div
              variants={itemVariants}
              className="mt-8 glass-card p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-4">Password Security Tips</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Use a different password for each account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Longer passwords are generally more secure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Include a mix of character types for maximum security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Consider using a password manager to store your passwords securely</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Change sensitive passwords regularly</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PasswordGenerator;
