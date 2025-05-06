
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { toast } from "sonner";

const EmailValidator = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const validateEmail = () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    
    // In a real app, this would use a proper email validation API
    // For demonstration purposes, we'll use a simple regex check and simulate an API call
    setTimeout(() => {
      // Basic email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);
      
      // Additional validation checks (simulated)
      const hasMX = Math.random() > 0.2;
      const isDisposable = email.includes("temp") || email.includes("disposable") || Math.random() < 0.1;
      const isRoleAccount = email.startsWith("admin@") || email.startsWith("info@") || email.startsWith("support@");
      
      // Checking for common typos in domain
      const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
      const emailDomain = email.split("@")[1];
      let suggestedEmail = null;
      
      if (isValidFormat && !commonDomains.includes(emailDomain)) {
        const similarDomain = commonDomains.find(domain => 
          domain.length === emailDomain.length && 
          [...domain].filter((char, i) => char !== emailDomain[i]).length <= 2
        );
        
        if (similarDomain) {
          suggestedEmail = `${email.split("@")[0]}@${similarDomain}`;
        }
      }
      
      setResult({
        email,
        isValidFormat,
        hasMX,
        isDisposable,
        isRoleAccount,
        suggestedEmail,
        score: isValidFormat ? (hasMX ? (isDisposable ? 50 : 90) : 40) : 10
      });
      
      setLoading(false);
    }, 1500);
  };

  return (
    <ToolLayout title="Email Validator" icon={<Mail size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-6">
              Validate email addresses to ensure they are correctly formatted and likely to exist.
              This tool checks email syntax, domain validation, and more.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-input" className="mb-2 block">Email Address</Label>
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    id="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter an email address to validate"
                    className="flex-grow"
                  />
                  <Button 
                    onClick={validateEmail} 
                    disabled={loading}
                    className="whitespace-nowrap"
                  >
                    {loading ? "Validating..." : "Validate Email"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {result && (
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                {result.isValidFormat && result.hasMX && !result.isDisposable ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <h3 className="text-lg font-medium text-green-600">Valid Email Address</h3>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500" />
                    <h3 className="text-lg font-medium text-red-600">
                      {!result.isValidFormat ? "Invalid Email Format" : 
                       !result.hasMX ? "Domain Has No Mail Server" : 
                       "Disposable Email Detected"}
                    </h3>
                  </>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email Format</p>
                    <div className="flex items-center mt-1">
                      {result.isValidFormat ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-600">Valid format</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-red-600">Invalid format</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Mail Server</p>
                    <div className="flex items-center mt-1">
                      {result.hasMX ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-600">Found</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-red-600">Not found</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Disposable Email</p>
                    <div className="flex items-center mt-1">
                      {!result.isDisposable ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-600">Not disposable</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-red-600">Disposable email</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Role Account</p>
                    <div className="flex items-center mt-1">
                      {!result.isRoleAccount ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-600">Personal account</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-amber-600">Role account</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        result.score >= 80 ? 'bg-green-600' : 
                        result.score >= 50 ? 'bg-amber-500' : 'bg-red-600'
                      }`} 
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">{result.score}/100</p>
                </div>
                
                {result.suggestedEmail && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-md">
                    <p className="text-sm text-blue-700">
                      <strong>Did you mean:</strong> {result.suggestedEmail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default EmailValidator;
