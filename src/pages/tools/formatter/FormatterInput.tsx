
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Trash, Upload, Code } from 'lucide-react';

interface FormatterInputProps {
  input: string;
  setInput: (value: string) => void;
  fileType: string;
  handleClear: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formatCode: () => void;
  minifyCode: () => void;
}

export const FormatterInput: React.FC<FormatterInputProps> = ({
  input,
  setInput,
  fileType,
  handleClear,
  handleFileUpload,
  formatCode,
  minifyCode
}) => {
  return (
    <Card className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Input {fileType.toUpperCase()}</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleClear}>
            <Trash className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button size="sm" variant="outline" className="relative">
            <input
              type="file"
              accept=".json,.html,.htm,.css,.js,.sql,.xml,.md,.markdown,.txt"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Paste your ${fileType.toUpperCase()} here...`}
        className="min-h-[300px] font-mono text-sm"
      />
      <div className="mt-4 space-x-2">
        <Button onClick={formatCode} variant="default">
          <Code className="h-4 w-4 mr-1" />
          Format
        </Button>
        <Button onClick={minifyCode} variant="outline">
          Minify
        </Button>
      </div>
    </Card>
  );
};

export default FormatterInput;
