import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

const allLucideIcons = Object.keys(LucideIcons).filter(name => name !== 'createLucideIcon');

// Filter out duplicates to ensure unique keys
const uniqueAvailableIcons = Array.from(new Set([
  'Dumbbell', 'Code', 'Book', 'Walk', 'Coffee', 'Meditation', 'Drum', 'Bike', 'Heart', 'DollarSign',
  'AlarmClock', 'Apple', 'Bed', 'Calendar', 'Camera', 'Cloud', 'Compass', 'CreditCard', 'Feather',
  'Film', 'Flag', 'Gift', 'Globe', 'GraduationCap', 'Hammer', 'Headphones', 'Home', 'Lamp', 'Leaf',
  'Lightbulb', 'Map', 'MessageSquare', 'Mic', 'Monitor', 'Moon', 'Music', 'Palette', 'PenTool',
  'Phone', 'PieChart', 'Plane', 'Plug', 'Pocket', 'Printer', 'Puzzle', 'RefreshCw', 'Rocket',
  'Rss', 'Scissors', 'Send', 'Settings', 'Shield', 'ShoppingCart', 'Smile', 'Speaker', 'Star',
  'Sun', 'Tablet', 'Target', 'Thermometer', 'ThumbsUp', 'Train', 'Tv', 'Umbrella', 'Upload',
  'User', 'Video', 'Volume2', 'Wallet', 'Watch', 'Wifi', 'Zap', 'ZoomIn', 'ZoomOut', 'Anchor',
  'Award', 'BatteryCharging', 'Bell', 'Briefcase', 'Bug', 'Building', 'Bus', 'Car', 'Cast',
  'CheckCircle', 'ChevronDown', 'ChevronUp', 'Chrome', 'Circle', 'Clipboard', 'Clock', 'CloudDrizzle',
  'CloudLightning', 'CloudOff', 'CloudRain', 'CloudSnow', 'Codesandbox', 'Codepen', 'Command',
  'Copy', 'CornerDownLeft', 'CornerDownRight', 'CornerLeftDown', 'CornerLeftUp',
  'CornerRightDown', 'CornerRightUp', 'CornerUpLeft', 'CornerUpRight', 'Cpu', 'Crop', 'Crosshair',
  'Database', 'Delete', 'Disc', 'Divide', 'DivideCircle', 'DivideSquare', 'Download', 'DownloadCloud',
  'Droplet', 'Edit', 'Edit2', 'Edit3', 'ExternalLink', 'Eye', 'EyeOff', 'Facebook', 'FastForward',
  'Figma', 'File', 'FileMinus', 'FilePlus', 'FileText', 'Filter', 'Folder',
  'FolderMinus', 'FolderPlus', 'Framer', 'Frown', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest',
  'Github', 'Gitlab', 'Grid', 'HardDrive', 'Hash', 'HelpCircle', 'Hexagon',
  'History', 'Image', 'Inbox', 'Info', 'Instagram', 'Italic', 'Key', 'Layers', 'Layout',
  'LifeBuoy', 'Link', 'Linkedin', 'List', 'Loader', 'Lock', 'LogIn', 'LogOut', 'Mail', 'MapPin',
  'Maximize', 'Meh', 'Menu', 'MessageCircle', 'Minus', 'MinusCircle', 'MinusSquare',
  'MoreHorizontal', 'MoreVertical', 'MousePointer', 'Move', 'Navigation',
  'Navigation2', 'Octagon', 'Package', 'Paperclip', 'Pause', 'PauseCircle', 'Percent',
  'PhoneCall', 'PhoneForwarded', 'PhoneIncoming', 'PhoneMissed', 'PhoneOff', 'PhoneOutgoing',
  'Play', 'PlayCircle', 'Plus', 'PlusCircle', 'PlusSquare', 'Power',
  'Radio', 'RefreshCcw', 'Repeat', 'Rewind', 'RotateCcw', 'RotateCw', 'Save',
  'Search', 'Server', 'Share', 'Share2', 'Shuffle', 'Sidebar',
  'SkipBack', 'SkipForward', 'Slack', 'Slash', 'Sliders', 'Smartphone',
  'Square', 'StopCircle', 'Sunrise', 'Sunset', 'Tag', 'Terminal',
  'ThumbsDown', 'ToggleLeft', 'ToggleRight', 'Tool', 'Trash', 'Trash2', 'Trello',
  'TrendingDown', 'TrendingUp', 'Triangle', 'Truck', 'Type', 'Underline', 'Unlock',
  'UploadCloud', 'UserCheck', 'UserMinus', 'UserPlus',
  'UserX', 'Users', 'VideoOff', 'Voicemail', 'Volume', 'Volume1', 'VolumeX',
  'WifiOff', 'Wind', 'X', 'XCircle', 'XOctagon', 'XSquare', 'Youtube', 'ZapOff',
].filter(iconName => allLucideIcons.includes(iconName))));


const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  const SelectedIconComponent = selectedIcon ? (LucideIcons as any)[selectedIcon] : LucideIcons.Circle;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
          {SelectedIconComponent && <SelectedIconComponent className="mr-2 h-4 w-4 text-muted-foreground" />}
          {selectedIcon || "Select Icon"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-3 bg-popover border-border shadow-lg rounded-xl">
        <div className="grid grid-cols-6 gap-1">
          {uniqueAvailableIcons.map((iconName) => {
            const IconComponent = (LucideIcons as any)[iconName];
            return (
              <Button
                key={iconName}
                variant="ghost"
                size="icon"
                onClick={() => onSelectIcon(iconName)}
                className={cn(
                  "h-9 w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150 rounded-md",
                  selectedIcon === iconName && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {IconComponent && <IconComponent className="h-5 w-5" />}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;