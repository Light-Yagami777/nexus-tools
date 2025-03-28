
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';

interface FormatterOutputProps {
  output: string;
  error: string | null;
  fileType: string;
  isFormatted: boolean;
  isCopied: boolean;
  handleCopy: () => void;
}

export const FormatterOutput: React.FC<FormatterOutputProps> = ({
  output,
  error,
  fileType,
  isFormatted,
  isCopied,
  handleCopy,
}) => {
  return (
    <Card className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Formatted {fileType.toUpperCase()}</h2>
        {isFormatted && (
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>
      
      {error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      ) : output ? (
        <pre className="bg-muted p-4 rounded-md overflow-auto min-h-[300px] text-sm font-mono">
          {output}
        </pre>
      ) : (
        <div className="bg-muted min-h-[300px] flex items-center justify-center rounded-md text-muted-foreground">
          Formatted code will appear here
        </div>
      )}
      
      {isFormatted && !error && (
        <div className="mt-4 text-sm text-green-600 dark:text-green-400">
          ✓ Valid {fileType.toUpperCase()}
        </div>
      )}
    </Card>
  );
};

export default FormatterOutput;
