import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const availableColors = [
  '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', // Bright, vibrant
  '#A2D2FF', '#BDE0FE', '#FFC8DD', '#FFAFCC', '#CDDAF0', // Pastels
  '#8338EC', '#3A86FF', '#FF006E', '#FB5607', '#FFBE0B', // Bold
  '#E0BBE4', '#957DAD', '#D291BC', '#FFC72C', '#DA2C38', // Varied
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', // Material-like
];

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
          <div
            className="mr-2 h-4 w-4 rounded-full border border-border"
            style={{ backgroundColor: selectedColor }}
          />
          {selectedColor || "Select Color"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-3 bg-popover border-border shadow-lg rounded-xl">
        <div className="grid grid-cols-5 gap-2">
          {availableColors.map((color) => (
            <Button
              key={color}
              variant="ghost"
              size="icon"
              onClick={() => onSelectColor(color)}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition-all duration-150",
                selectedColor === color ? "border-primary ring-2 ring-offset-2 ring-offset-popover" : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;