
import React from 'react';
import { Card } from '@/components/ui/card';

export const FormatterAbout: React.FC = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">About Formatter</h2>
      <Card className="p-6">
        <p className="mb-4">
          Formatter is an all-in-one tool for developers to format and beautify various types of code and markup languages.
        </p>
        <h3 className="font-semibold mt-4 mb-2">Supported File Types:</h3>
        <ul className="list-disc list-inside space-y-1 ml-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <li>JSON</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>SQL</li>
          <li>XML</li>
          <li>Markdown</li>
          <li>Plain Text</li>
        </ul>
        <h3 className="font-semibold mt-4 mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Format and beautify code for improved readability</li>
          <li>Minify code to reduce file size</li>
          <li>Validate syntax for supported formats</li>
          <li>Upload files directly</li>
          <li>Copy formatted code to clipboard</li>
        </ul>
        <h3 className="font-semibold mt-4 mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Select the file type from the tabs above</li>
          <li>Paste your code in the input field or upload a file</li>
          <li>Click "Format" to beautify or "Minify" to compress your code</li>
          <li>Use the "Copy" button to copy the result to your clipboard</li>
        </ol>
      </Card>
    </div>
  );
};

export default FormatterAbout;
