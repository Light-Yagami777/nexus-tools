
import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Copy, Eye, Upload, Save, Trash, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { ColorWheel } from '@/components/ui/color-wheel';

interface SavedColor {
  color: string;
  name: string;
  timestamp: number;
}

const ColorPicker = () => {
  const [color, setColor] = useState<string>("#3b82f6");
  const [rgb, setRgb] = useState<{r: number; g: number; b: number}>({r: 59, g: 130, b: 246});
  const [hsl, setHsl] = useState<{h: number; s: number; l: number}>({h: 217, s: 91, l: 60});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [colorName, setColorName] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const [colorSource, setColorSource] = useState<'wheel' | 'image'>('wheel');
  const [magnification, setMagnification] = useState<number>(5);

  // Load saved colors from localStorage on component mount
  useEffect(() => {
    const savedPalette = localStorage.getItem('savedColorPalette');
    if (savedPalette) {
      try {
        setSavedColors(JSON.parse(savedPalette));
      } catch (e) {
        console.error("Error loading saved colors:", e);
      }
    }
  }, []);

  // Save colors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedColorPalette', JSON.stringify(savedColors));
  }, [savedColors]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    updateRgbFromHex(newColor);
    updateHslFromHex(newColor);
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const numValue = Math.min(255, Math.max(0, parseInt(value) || 0));
    const newRgb = { ...rgb, [component]: numValue };
    setRgb(newRgb);
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (component: 'h' | 's' | 'l', value: string) => {
    const max = component === 'h' ? 360 : 100;
    const numValue = Math.min(max, Math.max(0, parseInt(value) || 0));
    const newHsl = { ...hsl, [component]: numValue };
    setHsl(newHsl);
    
    const rgbValues = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(rgbValues);
    setColor(rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b));
  };

  const updateRgbFromHex = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      setRgb({ r, g, b });
    }
  };

  const updateHslFromHex = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      setHsl(rgbToHsl(r, g, b));
    }
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h = Math.round(h * 60);
    }
    
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return { h, s, l };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const copyToClipboard = (text: string, label?: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label || 'Color'} copied to clipboard`);
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          setUploadedImage(imageUrl);
          setColorSource('image');
          
          // Load the image onto the canvas
          setTimeout(() => {
            if (imageCanvasRef.current) {
              const canvas = imageCanvasRef.current;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                const img = new Image();
                img.onload = () => {
                  // Calculate scaling to fit within the canvas
                  const scale = Math.min(
                    canvas.width / img.width,
                    canvas.height / img.height
                  );
                  
                  const scaledWidth = img.width * scale;
                  const scaledHeight = img.height * scale;
                  
                  // Center the image on the canvas
                  const x = (canvas.width - scaledWidth) / 2;
                  const y = (canvas.height - scaledHeight) / 2;
                  
                  // Clear and draw
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                };
                img.src = imageUrl;
              }
            }
          }, 50);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleImageCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (imageCanvasRef.current) {
      const rect = imageCanvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ctx = imageCanvasRef.current.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        const newColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
        setColor(newColor);
        setRgb({r: imageData[0], g: imageData[1], b: imageData[2]});
        const hslValues = rgbToHsl(imageData[0], imageData[1], imageData[2]);
        setHsl(hslValues);
      }
    }
  };

  const saveCurrentColor = () => {
    if (!colorName.trim()) {
      toast.error("Please enter a name for this color");
      return;
    }
    
    const newSavedColor: SavedColor = {
      color,
      name: colorName.trim(),
      timestamp: Date.now()
    };
    
    setSavedColors(prev => [...prev, newSavedColor]);
    setColorName("");
    toast.success(`Color "${colorName}" saved to palette`);
  };

  const deleteSavedColor = (timestamp: number) => {
    setSavedColors(prev => prev.filter(c => c.timestamp !== timestamp));
    toast.success("Color removed from palette");
  };

  return (
    <ToolLayout 
      title="Color Picker" 
      description="Pick, convert, and generate color codes"
      icon={<Palette className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Color Picker</CardTitle>
            <CardDescription>
              Pick colors using the wheel, from an image, or input values directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="wheel" onValueChange={(value) => setColorSource(value as 'wheel' | 'image')}>
              <TabsList className="mb-6 gap-2">
                <TabsTrigger value="wheel">Color Wheel</TabsTrigger>
                <TabsTrigger value="image">From Image</TabsTrigger>
              </TabsList>
              
              <div className="grid md:grid-cols-2 gap-6">
                <TabsContent value="wheel" className="mt-0">
                  <div className="space-y-4">
                    <ColorWheel
                      color={color}
                      onChange={(newColor) => {
                        setColor(newColor);
                        updateRgbFromHex(newColor);
                        updateHslFromHex(newColor);
                      }}
                      rgb={rgb}
                      hsl={hsl}
                      magnification={magnification}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="image" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      {uploadedImage ? (
                        <div className="relative w-full">
                          <canvas 
                            ref={imageCanvasRef}
                            width={300}
                            height={300}
                            onClick={handleImageCanvasClick}
                            onMouseMove={(e) => {
                              if (e.buttons) {
                                handleImageCanvasClick(e);
                              }
                            }}
                            className="border rounded-lg cursor-crosshair mx-auto"
                          />
                          <div className="flex justify-center mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="mr-2"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Change Image
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setUploadedImage(null)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 w-full h-[300px]">
                          <Upload className="h-10 w-10 text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground mb-4">Upload an image to pick colors from</p>
                          <Button onClick={() => fileInputRef.current?.click()}>
                            Select Image
                          </Button>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUploadImage}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <div className="flex-1 space-y-4">
                  <div 
                    className="h-32 rounded-lg w-full mb-6 border relative overflow-hidden group"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/30 transition-opacity">
                      <Button variant="outline" className="bg-white" onClick={() => copyToClipboard(color, "HEX color")}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="rgb" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="rgb">RGB</TabsTrigger>
                      <TabsTrigger value="hsl">HSL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rgb" className="space-y-4 mt-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="r-value">R</Label>
                          <Input 
                            id="r-value" 
                            type="number" 
                            min="0" 
                            max="255" 
                            value={rgb.r}
                            onChange={(e) => handleRgbChange('r', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="g-value">G</Label>
                          <Input 
                            id="g-value" 
                            type="number" 
                            min="0" 
                            max="255" 
                            value={rgb.g}
                            onChange={(e) => handleRgbChange('g', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="b-value">B</Label>
                          <Input 
                            id="b-value" 
                            type="number" 
                            min="0" 
                            max="255" 
                            value={rgb.b}
                            onChange={(e) => handleRgbChange('b', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <Input 
                          type="text" 
                          value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} 
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB value")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex">
                        <Input 
                          type="text" 
                          value={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`} 
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => copyToClipboard(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`, "RGBA value")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="hsl" className="space-y-4 mt-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="h-value">H</Label>
                          <Input 
                            id="h-value" 
                            type="number" 
                            min="0" 
                            max="360" 
                            value={hsl.h}
                            onChange={(e) => handleHslChange('h', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="s-value">S (%)</Label>
                          <Input 
                            id="s-value" 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={hsl.s}
                            onChange={(e) => handleHslChange('s', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="l-value">L (%)</Label>
                          <Input 
                            id="l-value" 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={hsl.l}
                            onChange={(e) => handleHslChange('l', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <Input 
                          type="text" 
                          value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} 
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL value")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div>
                    <Label htmlFor="hex-value">HEX</Label>
                    <div className="flex mt-1">
                      <Input
                        id="hex-value" 
                        type="text"
                        value={color}
                        onChange={handleColorChange}
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="ml-2"
                        onClick={() => copyToClipboard(color, "HEX color")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Save to palette</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Color name"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                      />
                      <Button onClick={saveCurrentColor}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="mb-2 block">Magnification Level</Label>
                    <div className="flex items-center gap-4">
                      <Circle className="h-3 w-3" />
                      <Slider
                        defaultValue={[5]}
                        min={2}
                        max={10}
                        step={1}
                        value={[magnification]}
                        onValueChange={(values) => setMagnification(values[0])}
                      />
                      <Circle className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Colors</CardTitle>
            <CardDescription>Your custom color palette</CardDescription>
          </CardHeader>
          <CardContent>
            {savedColors.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {savedColors.map((savedColor) => (
                  <div 
                    key={savedColor.timestamp} 
                    className="flex flex-col overflow-hidden rounded-md border shadow-sm"
                  >
                    <div 
                      className="h-12 w-full cursor-pointer"
                      style={{ backgroundColor: savedColor.color }}
                      onClick={() => {
                        setColor(savedColor.color);
                        updateRgbFromHex(savedColor.color);
                        updateHslFromHex(savedColor.color);
                      }}
                    />
                    <div className="p-2 bg-card">
                      <div className="flex items-center justify-between">
                        <div className="truncate text-xs font-medium">
                          {savedColor.name}
                        </div>
                        <div className="flex">
                          <button 
                            className="p-1 text-muted-foreground hover:text-foreground"
                            onClick={() => copyToClipboard(savedColor.color, savedColor.name)}
                            title={`Copy ${savedColor.color}`}
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button 
                            className="p-1 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteSavedColor(savedColor.timestamp)}
                            title="Remove"
                          >
                            <Trash className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{savedColor.color}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Save colors to build your palette</p>
                <p className="text-sm">Colors are stored in your browser</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default ColorPicker;
