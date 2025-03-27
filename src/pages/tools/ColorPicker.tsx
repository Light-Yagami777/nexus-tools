
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette } from "lucide-react";
import { toast } from "sonner";

const ColorPicker = () => {
  const [color, setColor] = useState<string>("#3b82f6");
  const [rgb, setRgb] = useState<{r: number; g: number; b: number}>({r: 59, g: 130, b: 246});
  const [hsl, setHsl] = useState<{h: number; s: number; l: number}>({h: 217, s: 91, l: 60});

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
    let r, g, b;

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

  return (
    <ToolLayout title="Color Picker">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div 
                className="h-32 rounded-lg w-full mb-4 border border-border" 
                style={{ backgroundColor: color }}
              />
              
              <div className="mb-4">
                <Label htmlFor="colorpicker">Choose a color</Label>
                <div className="flex mt-2">
                  <Input 
                    type="color" 
                    id="colorpicker"
                    value={color} 
                    onChange={handleColorChange}
                    className="h-10 w-16"
                  />
                  <Input 
                    type="text" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="ml-2 flex-1" 
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="ml-2"
                    onClick={() => copyToClipboard(color)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
                </div>
              </div>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

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
      </Card>
    </ToolLayout>
  );
};

export default ColorPicker;
