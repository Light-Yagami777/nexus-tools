
import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Image as ImageIcon, Upload, Download, RefreshCw, Type, AlignCenter, AlignLeft, AlignRight, Bold, Italic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  alignment: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  strokeColor: string;
  strokeWidth: number;
}

const popularMemes = [
  { name: "Drake Hotline Bling", url: "https://i.imgflip.com/30b1gx.jpg" },
  { name: "Distracted Boyfriend", url: "https://i.imgflip.com/1ur9b0.jpg" },
  { name: "Two Buttons", url: "https://i.imgflip.com/1g8my4.jpg" },
  { name: "Change My Mind", url: "https://i.imgflip.com/24y43o.jpg" },
  { name: "Expanding Brain", url: "https://i.imgflip.com/1jwhww.jpg" },
  { name: "One Does Not Simply", url: "https://i.imgflip.com/1bij.jpg" },
  { name: "Batman Slapping Robin", url: "https://i.imgflip.com/9ehk.jpg" },
  { name: "Waiting Skeleton", url: "https://i.imgflip.com/2fm6x.jpg" },
  { name: "Surprised Pikachu", url: "https://i.imgflip.com/2kbn1e.jpg" },
  { name: "Doge", url: "https://i.imgflip.com/4t0m5.jpg" }
];

const MemeGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: '1',
      text: 'TOP TEXT',
      x: 50,
      y: 10,
      fontSize: 32,
      color: '#FFFFFF',
      alignment: 'center',
      fontFamily: 'Impact',
      isBold: false,
      isItalic: false,
      strokeColor: '#000000',
      strokeWidth: 2,
    },
    {
      id: '2',
      text: 'BOTTOM TEXT',
      x: 50,
      y: 90,
      fontSize: 32,
      color: '#FFFFFF',
      alignment: 'center',
      fontFamily: 'Impact',
      isBold: false,
      isItalic: false,
      strokeColor: '#000000',
      strokeWidth: 2,
    }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('1');
  const [imageSize, setImageSize] = useState({ width: 600, height: 600 });
  
  useEffect(() => {
    if (imageUrl) {
      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let newWidth, newHeight;
        
        if (img.width > img.height) {
          newWidth = Math.min(img.width, 800);
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = Math.min(img.height, 800);
          newWidth = newHeight * aspectRatio;
        }
        
        setImageSize({
          width: Math.round(newWidth),
          height: Math.round(newHeight)
        });
        
        // Update text layer positions
        setTextLayers(layers => layers.map(layer => {
          if (layer.id === '1') {
            return { ...layer, y: 10 };
          } else if (layer.id === '2') {
            return { ...layer, y: 90 };
          }
          return layer;
        }));
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);
  
  useEffect(() => {
    if (imageUrl) {
      drawCanvas();
    }
  }, [imageUrl, textLayers, imageSize]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setGeneratedImageUrl('');
    };
    reader.readAsDataURL(file);
  };
  
  const selectMemeTemplate = (url: string) => {
    setImageUrl(url);
    setGeneratedImageUrl('');
  };
  
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = imageSize.width;
    canvas.height = imageSize.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background image
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw text layers
        textLayers.forEach(layer => {
          const x = (layer.x / 100) * canvas.width;
          const y = (layer.y / 100) * canvas.height;
          
          ctx.font = `${layer.isItalic ? 'italic ' : ''}${layer.isBold ? 'bold ' : ''}${layer.fontSize}px ${layer.fontFamily}`;
          
          // Set text alignment
          let textX = x;
          ctx.textAlign = layer.alignment as CanvasTextAlign;
          
          if (layer.alignment === 'center') {
            textX = canvas.width / 2;
          } else if (layer.alignment === 'right') {
            textX = canvas.width - x;
          }
          
          // Draw text stroke
          ctx.lineWidth = layer.strokeWidth;
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineJoin = 'round';
          ctx.strokeText(layer.text, textX, y);
          
          // Draw text fill
          ctx.fillStyle = layer.color;
          ctx.fillText(layer.text, textX, y);
        });
        
        // Update generated image
        setGeneratedImageUrl(canvas.toDataURL('image/png'));
      };
      img.src = imageUrl;
    }
  };
  
  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: `TEXT ${textLayers.length + 1}`,
      x: 50,
      y: 50,
      fontSize: 32,
      color: '#FFFFFF',
      alignment: 'center',
      fontFamily: 'Impact',
      isBold: false,
      isItalic: false,
      strokeColor: '#000000',
      strokeWidth: 2,
    };
    
    setTextLayers([...textLayers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };
  
  const removeTextLayer = (id: string) => {
    if (textLayers.length <= 1) {
      toast.error('You need at least one text layer');
      return;
    }
    
    setTextLayers(textLayers.filter(layer => layer.id !== id));
    
    // If the selected layer was removed, select another layer
    if (selectedLayerId === id) {
      const remainingLayers = textLayers.filter(layer => layer.id !== id);
      if (remainingLayers.length > 0) {
        setSelectedLayerId(remainingLayers[0].id);
      }
    }
  };
  
  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(textLayers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ));
  };
  
  const handleDownload = () => {
    if (!generatedImageUrl) {
      drawCanvas(); // Ensure canvas is drawn
      return;
    }
    
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = 'meme.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Meme downloaded!');
  };
  
  const selectedLayer = textLayers.find(layer => layer.id === selectedLayerId) || textLayers[0];
  
  return (
    <ToolLayout 
      title="Meme Generator" 
      description="Create custom memes with popular templates or upload your own images"
      icon={<ImageIcon className="h-6 w-6" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Meme</CardTitle>
              <CardDescription>
                Upload an image or select a template and add your text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload an image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  
                  {imageUrl && (
                    <div className="text-center text-sm text-muted-foreground">
                      Image uploaded. You can now edit text and customize your meme.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="templates">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                    {popularMemes.map((meme, index) => (
                      <div
                        key={index}
                        className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-all"
                        onClick={() => selectMemeTemplate(meme.url)}
                      >
                        <img 
                          src={meme.url} 
                          alt={meme.name} 
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-1 text-xs text-center truncate">
                          {meme.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {imageUrl && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Text Layers</CardTitle>
                  <Button size="sm" onClick={addTextLayer}>
                    Add Text
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Text Layer Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    {textLayers.map(layer => (
                      <div
                        key={layer.id}
                        className={`border rounded-md p-2 cursor-pointer ${
                          layer.id === selectedLayerId ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedLayerId(layer.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="truncate">{layer.text || 'Empty Text'}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTextLayer(layer.id);
                            }}
                            disabled={textLayers.length <= 1}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Text Layer Content */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text">Text</Label>
                      <Input
                        id="text"
                        value={selectedLayer.text}
                        onChange={(e) => updateTextLayer(selectedLayer.id, { text: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Font</Label>
                        <Select
                          value={selectedLayer.fontFamily}
                          onValueChange={(fontFamily) => updateTextLayer(selectedLayer.id, { fontFamily })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Impact">Impact</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Comic Sans MS">Comic Sans</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Size: {selectedLayer.fontSize}px</Label>
                        <Slider
                          min={12}
                          max={72}
                          step={1}
                          value={[selectedLayer.fontSize]}
                          onValueChange={([fontSize]) => updateTextLayer(selectedLayer.id, { fontSize })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={selectedLayer.color}
                            onChange={(e) => updateTextLayer(selectedLayer.id, { color: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={selectedLayer.color}
                            onChange={(e) => updateTextLayer(selectedLayer.id, { color: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Stroke Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={selectedLayer.strokeColor}
                            onChange={(e) => updateTextLayer(selectedLayer.id, { strokeColor: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={selectedLayer.strokeColor}
                            onChange={(e) => updateTextLayer(selectedLayer.id, { strokeColor: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Stroke Width: {selectedLayer.strokeWidth}px</Label>
                        <Slider
                          min={0}
                          max={10}
                          step={0.5}
                          value={[selectedLayer.strokeWidth]}
                          onValueChange={([strokeWidth]) => updateTextLayer(selectedLayer.id, { strokeWidth })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Style</Label>
                        <ToggleGroup type="multiple" className="justify-start">
                          <ToggleGroupItem 
                            value="bold"
                            aria-label="Toggle bold"
                            data-state={selectedLayer.isBold ? "on" : "off"}
                            onClick={() => updateTextLayer(selectedLayer.id, { isBold: !selectedLayer.isBold })}
                          >
                            <Bold className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem 
                            value="italic"
                            aria-label="Toggle italic"
                            data-state={selectedLayer.isItalic ? "on" : "off"}
                            onClick={() => updateTextLayer(selectedLayer.id, { isItalic: !selectedLayer.isItalic })}
                          >
                            <Italic className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem 
                            value="left"
                            aria-label="Align left"
                            data-state={selectedLayer.alignment === 'left' ? "on" : "off"}
                            onClick={() => updateTextLayer(selectedLayer.id, { alignment: 'left' })}
                          >
                            <AlignLeft className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem 
                            value="center"
                            aria-label="Align center"
                            data-state={selectedLayer.alignment === 'center' ? "on" : "off"}
                            onClick={() => updateTextLayer(selectedLayer.id, { alignment: 'center' })}
                          >
                            <AlignCenter className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem 
                            value="right"
                            aria-label="Align right"
                            data-state={selectedLayer.alignment === 'right' ? "on" : "off"}
                            onClick={() => updateTextLayer(selectedLayer.id, { alignment: 'right' })}
                          >
                            <AlignRight className="h-4 w-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Position X: {selectedLayer.x}%</Label>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[selectedLayer.x]}
                          onValueChange={([x]) => updateTextLayer(selectedLayer.id, { x })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Position Y: {selectedLayer.y}%</Label>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[selectedLayer.y]}
                          onValueChange={([y]) => updateTextLayer(selectedLayer.id, { y })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Meme Preview</CardTitle>
              <CardDescription>
                {imageUrl ? 'Preview of your meme' : 'Upload an image to create a meme'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4 min-h-[200px] flex items-center justify-center border rounded-md w-full">
                {imageUrl ? (
                  <>
                    <canvas 
                      ref={canvasRef} 
                      className="max-w-full"
                      style={{
                        maxHeight: '400px',
                        width: imageSize.width,
                        height: imageSize.height,
                        display: 'none'
                      }}
                    />
                    {generatedImageUrl && (
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated Meme" 
                        className="max-w-full"
                        style={{ maxHeight: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Upload an image or select a template to get started
                    </p>
                  </div>
                )}
              </div>
              
              {imageUrl && (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button 
                    className="flex-1"
                    onClick={drawCanvas}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Type className="mr-2 h-4 w-4" />
                        Update Meme
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDownload}
                    disabled={!generatedImageUrl}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default MemeGenerator;
