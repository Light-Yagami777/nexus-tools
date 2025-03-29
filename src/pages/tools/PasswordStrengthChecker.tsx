
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const PasswordStrengthChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setStrength(0);
      setFeedback([]);
      return;
    }

    let score = 0;
    const issues: string[] = [];

    // Length check
    if (password.length < 8) {
      issues.push('Password should be at least 8 characters long');
    } else {
      score += 20;
    }

    // Lowercase letters check
    if (!/[a-z]/.test(password)) {
      issues.push('Include lowercase letters (a-z)');
    } else {
      score += 20;
    }

    // Uppercase letters check
    if (!/[A-Z]/.test(password)) {
      issues.push('Include uppercase letters (A-Z)');
    } else {
      score += 20;
    }

    // Numbers check
    if (!/[0-9]/.test(password)) {
      issues.push('Include numbers (0-9)');
    } else {
      score += 20;
    }

    // Special characters check
    if (!/[^A-Za-z0-9]/.test(password)) {
      issues.push('Include special characters (!@#$%^&*)');
    } else {
      score += 20;
    }

    // Common password patterns
    const commonPatterns = [
      'password', '123456', 'qwerty', 'admin', '12345',
      'welcome', 'iloveyou', '111111', '1234567', '123123'
    ];
    
    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      issues.push('Avoid common password patterns');
      score = Math.max(score - 30, 0);
    }

    // Check for sequential characters
    const sequentialRegex = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
    if (sequentialRegex.test(password)) {
      issues.push('Avoid sequential characters');
      score = Math.max(score - 20, 0);
    }

    // Check for repeated characters
    const repeatedRegex = /(.)\1{2,}/;
    if (repeatedRegex.test(password)) {
      issues.push('Avoid repeated characters');
      score = Math.max(score - 20, 0);
    }

    setStrength(score);
    setFeedback(issues);
  };

  const getStrengthLabel = () => {
    if (strength <= 20) return 'Very Weak';
    if (strength <= 40) return 'Weak';
    if (strength <= 60) return 'Medium';
    if (strength <= 80) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 20) return 'text-red-500';
    if (strength <= 40) return 'text-amber-500';
    if (strength <= 60) return 'text-yellow-500';
    if (strength <= 80) return 'text-lime-500';
    return 'text-green-500';
  };

  const getProgressColor = () => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-amber-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getIcon = () => {
    if (strength <= 20) return <XCircle className="h-5 w-5 text-red-500" />;
    if (strength <= 40) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    if (strength <= 60) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (strength <= 80) return <CheckCircle className="h-5 w-5 text-lime-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  return (
    <ToolLayout title="Password Strength Checker">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Password Strength Checker</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Test the strength of your passwords against common security standards and find out how to improve them.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Enter Password to Check
            </label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password here"
              className="w-full"
            />
          </div>
          
          {password && (
            <>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Password Strength:</span>
                  <div className="flex items-center">
                    {getIcon()}
                    <span className={`ml-1 font-medium ${getStrengthColor()}`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                </div>
                <Progress value={strength} className="h-2" 
                  style={{ 
                    '--progress-background': getProgressColor()
                  } as React.CSSProperties}
                />
              </div>
              
              {feedback.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Ways to improve:</h3>
                  <ul className="space-y-1">
                    {feedback.map((item, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {strength > 80 && feedback.length === 0 && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-md">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Excellent password! Your password meets all security criteria.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-2">Password Security Tips:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use a mix of uppercase and lowercase letters, numbers, and symbols</li>
              <li>• Make your password at least 12 characters long</li>
              <li>• Avoid using personal information</li>
              <li>• Don't use the same password for multiple accounts</li>
              <li>• Consider using a password manager</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default PasswordStrengthChecker;
