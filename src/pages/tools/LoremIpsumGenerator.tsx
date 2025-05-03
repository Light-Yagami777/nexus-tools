
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Type, ArrowLeft, Copy, RefreshCw, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';

const LoremIpsumGenerator = () => {
  const [type, setType] = useState<string>("paragraphs");
  const [count, setCount] = useState<number>(3);
  const [includeHtml, setIncludeHtml] = useState<boolean>(false);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [generatedText, setGeneratedText] = useState<string>("");
  const navigate = useNavigate();

  const loremIpsumParagraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.",
    "Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Donec varius, lectus id viverra malesuada, quam nunc dictum diam, eget gravida ligula magna eu ligula. Sed ut ipsum aliquam, iaculis purus eu, varius risus.",
    "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Donec sed odio dui.",
    "Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
    "Vestibulum id ligula porta felis euismod semper. Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.",
    "Donec ullamcorper nulla non metus auctor fringilla. Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur.",
    "Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Maecenas faucibus mollis interdum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam id dolor id nibh ultricies vehicula ut id elit.",
    "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Etiam porta sem malesuada magna mollis euismod.",
  ];
  
  // Additional Latin paragraphs for variety
  const alternativeParagraphs = [
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  ];

  const generateText = () => {
    let result = [];
    const allParagraphs = startWithLorem 
      ? [...loremIpsumParagraphs, ...alternativeParagraphs]
      : [...alternativeParagraphs, ...loremIpsumParagraphs.slice(1)];
    
    const words = allParagraphs.join(' ').split(' ');
    const sentences = allParagraphs.join('. ').split('. ');

    switch (type) {
      case 'paragraphs':
        for (let i = 0; i < count; i++) {
          const para = allParagraphs[i % allParagraphs.length];
          result.push(includeHtml ? `<p>${para}</p>` : para);
        }
        break;
      case 'sentences':
        for (let i = 0; i < count; i++) {
          const sentence = sentences[i % sentences.length];
          result.push(includeHtml ? `<span>${sentence}.</span>` : `${sentence}.`);
        }
        break;
      case 'words':
        const selectedWords = words.slice(0, count);
        result.push(includeHtml ? `<span>${selectedWords.join(' ')}</span>` : selectedWords.join(' '));
        break;
    }

    setGeneratedText(result.join(includeHtml ? '\n' : '\n\n'));
  };

  const copyToClipboard = () => {
    if (!generatedText) {
      toast.error('Generate some text first');
      return;
    }

    navigator.clipboard.writeText(generatedText)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };
  
  const downloadAsFile = () => {
    if (!generatedText) {
      toast.error('Generate some text first');
      return;
    }
    
    const fileType = includeHtml ? 'text/html' : 'text/plain';
    const extension = includeHtml ? 'html' : 'txt';
    const blob = new Blob([generatedText], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `lorem-ipsum.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded as ${extension.toUpperCase()} file`);
  };

  return (
    <ToolLayout 
      title="Lorem Ipsum Generator" 
      description="Generate placeholder text for your designs and layouts"
      icon={<Type className="h-6 w-6" />}
      extraPadding={true}
    >
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-2 flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Generator Options</CardTitle>
            <CardDescription>
              Customize your Lorem Ipsum text generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select 
                  value={type} 
                  onValueChange={setType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Count ({count})</Label>
                <Slider
                  value={[count]}
                  onValueChange={([value]) => setCount(value)}
                  min={1}
                  max={type === 'words' ? 200 : 20}
                  step={1}
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-html" 
                    checked={includeHtml}
                    onCheckedChange={() => setIncludeHtml(!includeHtml)}
                  />
                  <Label htmlFor="include-html">Include HTML Tags</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="start-with-lorem" 
                    checked={startWithLorem}
                    onCheckedChange={() => setStartWithLorem(!startWithLorem)}
                  />
                  <Label htmlFor="start-with-lorem">Start with "Lorem ipsum"</Label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={generateText}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate
                </Button>
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" onClick={downloadAsFile}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedText && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedText}
                readOnly
                className="min-h-[200px] font-mono text-sm resize-y"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default LoremIpsumGenerator;
