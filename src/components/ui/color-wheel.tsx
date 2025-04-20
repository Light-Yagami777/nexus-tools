
import React, { useEffect, useRef, useState } from 'react';

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
  magnification = 5 // Default magnification level
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const magnifierRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPixelData, setMagnifierPixelData] = useState<ImageData | null>(null);

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

  const updateMagnifier = (x: number, y: number) => {
    if (magnifierRef.current && canvasRef.current) {
      const magnifierCtx = magnifierRef.current.getContext('2d');
      const sourceCtx = canvasRef.current.getContext('2d');
      
      if (magnifierCtx && sourceCtx) {
        // Clear the magnifier canvas
        magnifierCtx.clearRect(0, 0, 100, 100);
        
        try {
          // Calculate the area to capture, ensuring we don't go out of bounds
          const size = 20; // Size of area to magnify
          const sourceX = Math.max(0, Math.min(x - size / 2, 200 - size));
          const sourceY = Math.max(0, Math.min(y - size / 2, 200 - size));
          
          // Try to get the image data from the source
          const pixelData = sourceCtx.getImageData(sourceX, sourceY, size, size);
          setMagnifierPixelData(pixelData);
          
          // Draw with smooth rendering disabled for a clear pixel view
          magnifierCtx.imageSmoothingEnabled = false;
          
          // Draw the source image onto the magnifier canvas with scaling
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
          
          // Draw crosshair
          magnifierCtx.strokeStyle = 'rgba(255,255,255,0.8)';
          magnifierCtx.lineWidth = 1;
          
          // Horizontal line
          magnifierCtx.beginPath();
          magnifierCtx.moveTo(0, 50);
          magnifierCtx.lineTo(100, 50);
          magnifierCtx.stroke();
          
          // Vertical line
          magnifierCtx.beginPath();
          magnifierCtx.moveTo(50, 0);
          magnifierCtx.lineTo(50, 100);
          magnifierCtx.stroke();
          
          // Draw a pixel grid for more precision
          drawPixelGrid(magnifierCtx, 100, 100, size);
        } catch (error) {
          console.error("Error updating magnifier:", error);
          
          // Display fallback for error case
          magnifierCtx.fillStyle = '#f0f0f0';
          magnifierCtx.fillRect(0, 0, 100, 100);
          magnifierCtx.fillStyle = '#ff0000';
          magnifierCtx.font = '10px sans-serif';
          magnifierCtx.textAlign = 'center';
          magnifierCtx.fillText('Error loading', 50, 45);
          magnifierCtx.fillText('magnifier', 50, 60);
        }
      }
    }
  };

  // Draw a pixel grid on the magnifier to help with precision
  const drawPixelGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, gridSize: number) => {
    const cellSize = width / gridSize;
    
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update magnifier regardless of dragging state
      updateMagnifier(x, y);
      
      if (!isDragging && !e.buttons) return;

      const centerX = 100;
      const centerY = 100;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= 90) {
        setPosition({ x, y });
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          try {
            const imageData = ctx.getImageData(x, y, 1, 1).data;
            const newColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
            onChange(newColor);
          } catch (error) {
            console.error("Error getting image data:", error);
            // Don't update color in case of error
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setShowMagnifier(false);
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
          className="border rounded-full cursor-crosshair mx-auto"
        />
        {/* Small color selector cursor circle - reduced from w-16 h-16 to w-4 h-4 */}
        <div
          className={`absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full shadow-sm overflow-hidden transition-all duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
          style={{
            backgroundColor: color,
            left: position.x,
            top: position.y,
            // Add an outline to make it more visible
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.5)'
          }}
        >
          {/* The inside of the cursor is now too small for text, so we remove it */}
        </div>
        
        {/* Color info tooltip that shows on hover near the cursor */}
        <div 
          className="absolute px-2 py-1 bg-black/80 text-white text-xs rounded shadow-lg pointer-events-none z-10"
          style={{
            left: position.x + 10, // Offset from cursor
            top: position.y - 40,
            opacity: isZoomed ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          <div className="font-bold">{color}</div>
          <div className="grid grid-cols-2 gap-x-2 text-[10px]">
            <div>RGB: {rgb.r},{rgb.g},{rgb.b}</div>
            <div>HSL: {hsl.h}°,{hsl.s}%,{hsl.l}%</div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Magnifier with error handling and pixel grid */}
      {showMagnifier && (
        <div className="absolute -top-28 right-0 transform translate-x-full p-2 bg-background border rounded-lg shadow-lg">
          <div className="text-xs font-medium mb-1 text-center">Magnifier ({magnification}x)</div>
          <div className="relative">
            <canvas
              ref={magnifierRef}
              width={100}
              height={100}
              className="border rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] font-mono p-1 rounded-b-lg">
              {magnifierPixelData ? (
                <>
                  <span className="font-semibold">Center: </span>
                  {`RGB(${rgb.r},${rgb.g},${rgb.b})`}
                </>
              ) : (
                "No data"
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
