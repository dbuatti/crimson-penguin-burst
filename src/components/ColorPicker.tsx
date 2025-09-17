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
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
          <div
            className="mr-2 h-4 w-4 rounded-full border border-gray-400"
            style={{ backgroundColor: selectedColor }}
          />
          {selectedColor || "Select Color"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 bg-gray-800 border-gray-700">
        <div className="grid grid-cols-5 gap-2">
          {availableColors.map((color) => (
            <Button
              key={color}
              variant="ghost"
              size="icon"
              onClick={() => onSelectColor(color)}
              className={cn(
                "h-8 w-8 rounded-full border-2",
                selectedColor === color ? "border-white ring-2 ring-offset-2 ring-offset-gray-800" : "border-transparent"
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