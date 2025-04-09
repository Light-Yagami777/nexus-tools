
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type ColorPickerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const DEFAULT_COLOR = "#000000";

export const ColorPicker = ({ 
  value, 
  defaultValue = DEFAULT_COLOR,
  onChange 
}: ColorPickerProps) => {
  const [color, setColor] = useState(value || defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const isControlled = value !== undefined;

  useEffect(() => {
    if (isControlled && value !== color) {
      setColor(value);
    }
  }, [value, isControlled, color]);

  const handleChange = (newColor: string) => {
    if (!isControlled) {
      setColor(newColor);
    }
    onChange?.(newColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 p-1 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div
              className="h-6 w-6 rounded-sm mr-2"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <ColorPickerContent color={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  );
};

const PRESET_COLORS = [
  "#000000", "#ffffff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", 
  "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", 
  "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", 
  "#795548", "#607d8b"
];

const ColorPickerContent = ({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(color);

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Only update if valid hex
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onChange(value);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePresetClick = (presetColor: string) => {
    onChange(presetColor);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-2 block">Select Color</label>
        <div className="flex">
          <input
            type="color"
            value={color}
            onChange={handleColorInputChange}
            className="w-10 h-10 p-0 border rounded-l-md"
          />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleHexInputChange}
            className="flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="#000000"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Presets</label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              onClick={() => handlePresetClick(presetColor)}
              className="w-8 h-8 rounded-sm border overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ backgroundColor: presetColor }}
              aria-label={`Select color ${presetColor}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
