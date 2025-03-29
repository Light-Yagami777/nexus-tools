
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Key } from 'lucide-react';

const JwtDecoder = () => {
  const [jwtToken, setJwtToken] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const decodeJwt = () => {
    try {
      setError(null);
      if (!jwtToken.trim()) {
        throw new Error('Please enter a JWT token');
      }

      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. The token should have three parts separated by dots.');
      }

      // Decode header (first part)
      const headerJson = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/').padEnd(parts[0].length + (4 - parts[0].length % 4) % 4, '='));
      const headerObj = JSON.parse(headerJson);
      setHeader(headerObj);

      // Decode payload (second part)
      const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '='));
      const payloadObj = JSON.parse(payloadJson);
      setPayload(payloadObj);

      toast.success('JWT token decoded successfully');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      setHeader(null);
      setPayload(null);
    }
  };

  const formatJson = (jsonObj: any) => {
    return JSON.stringify(jsonObj, null, 2);
  };

  const clearData = () => {
    setJwtToken('');
    setHeader(null);
    setPayload(null);
    setError(null);
  };

  return (
    <ToolLayout title="JWT Decoder" extraPadding={true} icon={<Key size={24} />}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Decode JWT Token</CardTitle>
            <CardDescription>
              Enter a JWT token to decode and view its contents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your JWT token here..."
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                className="h-32 font-mono"
              />
              <div className="flex space-x-4">
                <Button onClick={decodeJwt}>Decode</Button>
                <Button variant="outline" onClick={clearData}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {(header || payload) && (
          <Card>
            <CardHeader>
              <CardTitle>Decoded Token</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payload" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="payload">Payload</TabsTrigger>
                  <TabsTrigger value="header">Header</TabsTrigger>
                </TabsList>
                <TabsContent value="payload" className="py-4">
                  {payload && (
                    <div className="space-y-4">
                      <Textarea
                        readOnly
                        value={formatJson(payload)}
                        className="h-80 font-mono bg-secondary"
                      />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="header" className="py-4">
                  {header && (
                    <div className="space-y-4">
                      <Textarea
                        readOnly
                        value={formatJson(header)}
                        className="h-80 font-mono bg-secondary"
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>About JWT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              JSON Web Tokens (JWT) are an open, industry standard RFC 7519 method for representing claims securely between two parties. JWT consists of three parts separated by dots:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
              <li>Header - contains token type and signing algorithm</li>
              <li>Payload - contains the claims (data)</li>
              <li>Signature - verifies the token hasn't been altered</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default JwtDecoder;
