import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { ColorWheel } from '@/components/ui/color-wheel';

const ColorPicker = () => {
  const [color, setColor] = useState<string>("#3b82f6");
  const [rgb, setRgb] = useState<{r: number; g: number; b: number}>({r: 59, g: 130, b: 246});
  const [hsl, setHsl] = useState<{h: number; s: number; l: number}>({h: 217, s: 91, l: 60});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ctx = canvasRef.current.getContext('2d');
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

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.createImageData(200, 200);
        const center = { x: 100, y: 100 };
        const radius = 90;

        for (let x = 0; x < 200; x++) {
          for (let y = 0; y < 200; y++) {
            const dx = x - center.x;
            const dy = y - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            if (distance <= radius) {
              const hue = ((angle + Math.PI) / (2 * Math.PI)) * 360;
              const saturation = Math.min(100, (distance / radius) * 100);
              const rgbObj = hslToRgb(hue, saturation, 50);
              const r = rgbObj.r;
              const g = rgbObj.g;
              const b = rgbObj.b;

              const i = (y * 200 + x) * 4;
              imageData.data[i] = r;
              imageData.data[i + 1] = g;
              imageData.data[i + 2] = b;
              imageData.data[i + 3] = 255;
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, []);

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
              Pick colors using the wheel or input values directly. Hover over the center circle to see RGB/HSL values.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
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
                />

                <div 
                  className="h-32 rounded-lg w-full mb-4 border" 
                  style={{ backgroundColor: color }}
                />
              </div>

              <div className="flex-1">
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
                        onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
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
                        onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4 border-t border-border">
          <h3 className="text-lg font-medium mb-3">Color Palette</h3>
          <div className="grid grid-cols-5 gap-2">
            {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
              '#00FFFF', '#FFA500', '#800080', '#008000', '#000000'].map((clr) => (
              <button
                key={clr}
                className="h-12 rounded border border-border transition-transform hover:scale-105"
                style={{ backgroundColor: clr }}
                onClick={() => {
                  setColor(clr);
                  updateRgbFromHex(clr);
                  updateHslFromHex(clr);
                }}
                title={clr}
              />
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ColorPicker;
