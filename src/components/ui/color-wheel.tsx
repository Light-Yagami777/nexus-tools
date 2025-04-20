
import React, { useEffect, useRef, useState } from 'react';

interface ColorWheelProps {
  color: string;
  onChange: (color: string) => void;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export const ColorWheel: React.FC<ColorWheelProps> = ({
  color,
  onChange,
  rgb,
  hsl
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

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
              const rgbValues = hslToRgb(hue, saturation, 50);

              const i = (y * 200 + x) * 4;
              imageData.data[i] = rgbValues.r;
              imageData.data[i + 1] = rgbValues.g;
              imageData.data[i + 2] = rgbValues.b;
              imageData.data[i + 3] = 255;
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && !e.buttons) return;

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = 100;
      const centerY = 100;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= 90) {
        setPosition({ x, y });
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const imageData = ctx.getImageData(x, y, 1, 1).data;
          const newColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
          onChange(newColor);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setIsDragging(false);
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="border rounded-full cursor-crosshair mx-auto"
      />
      <div
        className={`absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-lg overflow-hidden transition-all duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
        style={{
          backgroundColor: color,
          left: position.x,
          top: position.y,
        }}
      >
        <div 
          ref={infoRef}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white text-[8px] font-mono opacity-0 transition-opacity hover:opacity-100"
        >
          <div>{color}</div>
          <div>R: {rgb.r} G: {rgb.g} B: {rgb.b}</div>
          <div>rgba({rgb.r},{rgb.g},{rgb.b},1)</div>
        </div>
      </div>
    </div>
  );
};
