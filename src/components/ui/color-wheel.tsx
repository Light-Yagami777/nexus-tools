
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ColorWheelProps {
  color: string;
  onChange: (color: string) => void;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  magnification?: number;
}

export const ColorWheel: React.FC<ColorWheelProps> = ({
  color,
  onChange,
  rgb,
  hsl,
  magnification = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const magnifierRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Initial color wheel setup
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

  // Updated magnifier function using requestAnimationFrame
  const updateMagnifier = useCallback((x: number, y: number) => {
    if (magnifierRef.current && canvasRef.current) {
      const magnifierCtx = magnifierRef.current.getContext('2d');
      const sourceCtx = canvasRef.current.getContext('2d');
      
      if (magnifierCtx && sourceCtx) {
        magnifierCtx.clearRect(0, 0, 100, 100);
        
        try {
          const size = 20;
          const sourceX = Math.max(0, Math.min(x - size / 2, 200 - size));
          const sourceY = Math.max(0, Math.min(y - size / 2, 200 - size));
          
          // Get pixel data before drawing to check if it's valid
          const pixelData = sourceCtx.getImageData(sourceX, sourceY, size, size);
          
          if (pixelData && pixelData.data) {
            magnifierCtx.imageSmoothingEnabled = false;
            magnifierCtx.drawImage(
              canvasRef.current,
              sourceX,
              sourceY,
              size,
              size,
              0,
              0,
              100,
              100
            );
            
            // Draw grid
            magnifierCtx.strokeStyle = 'rgba(255,255,255,0.2)';
            magnifierCtx.lineWidth = 0.5;
            
            for (let i = 0; i <= size; i++) {
              const pos = (i / size) * 100;
              
              // Vertical lines
              magnifierCtx.beginPath();
              magnifierCtx.moveTo(pos, 0);
              magnifierCtx.lineTo(pos, 100);
              magnifierCtx.stroke();
              
              // Horizontal lines
              magnifierCtx.beginPath();
              magnifierCtx.moveTo(0, pos);
              magnifierCtx.lineTo(100, pos);
              magnifierCtx.stroke();
            }
            
            // Draw center crosshair
            magnifierCtx.strokeStyle = 'rgba(255,255,255,0.8)';
            magnifierCtx.lineWidth = 1;
            magnifierCtx.beginPath();
            magnifierCtx.moveTo(48, 50);
            magnifierCtx.lineTo(52, 50);
            magnifierCtx.moveTo(50, 48);
            magnifierCtx.lineTo(50, 52);
            magnifierCtx.stroke();
          } else {
            // Fallback if pixel data is invalid
            throw new Error("Invalid pixel data");
          }
        } catch (error) {
          console.error("Error updating magnifier:", error);
          // Fallback visual for error state
          magnifierCtx.fillStyle = '#202020';
          magnifierCtx.fillRect(0, 0, 100, 100);
          magnifierCtx.fillStyle = '#ff5555';
          magnifierCtx.font = '10px sans-serif';
          magnifierCtx.textAlign = 'center';
          magnifierCtx.fillText('Error', 50, 50);
        }
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleDrag(e);
  };

  const handleDrag = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Use requestAnimationFrame for smooth updates
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(() => {
        updateMagnifier(x, y);
        
        if (!isDragging && !e.buttons) return;

        const centerX = 100;
        const centerY = 100;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= 90) {
          setPosition({ x, y });
          
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            try {
              const imageData = ctx.getImageData(x, y, 1, 1).data;
              const newColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
              onChange(newColor);
            } catch (error) {
              console.error("Error getting image data:", error);
            }
          }
        }
      });
    }
  }, [isDragging, updateMagnifier, onChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    handleDrag(e);
  }, [handleDrag]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
    setIsDragging(false);
  };

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Utility functions
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
    <div className="relative flex flex-col items-center">
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
          className="border rounded-full cursor-crosshair mx-auto touch-none"
          aria-label="Color wheel"
          role="slider"
          aria-valuetext={`Current color: ${color}`}
        />
        
        {/* Smaller cursor circle (2-3px) with outline */}
        <div
          className="absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 border rounded-full"
          style={{
            backgroundColor: color,
            left: position.x,
            top: position.y,
            borderColor: 'rgba(255,255,255,0.8)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3)'
          }}
        />
        
        {/* Simplified HEX tooltip */}
        <div 
          className="absolute px-2 py-1 text-xs bg-black/80 text-white rounded pointer-events-none"
          style={{
            left: position.x + 8,
            top: position.y - 20,
            opacity: showMagnifier ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          {color}
        </div>
      </div>
      
      {/* Fixed magnifier positioning with higher z-index */}
      {showMagnifier && (
        <div 
          className="fixed bg-background border rounded-lg shadow-lg"
          style={{
            right: '20px', 
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000
          }}
        >
          <canvas
            ref={magnifierRef}
            width={100}
            height={100}
            className="rounded-lg"
          />
          <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-lg" />
        </div>
      )}
    </div>
  );
};
