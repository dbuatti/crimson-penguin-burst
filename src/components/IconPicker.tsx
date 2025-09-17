import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

const availableIcons = [
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
  'Compass', 'Copy', 'CornerDownLeft', 'CornerDownRight', 'CornerLeftDown', 'CornerLeftUp',
  'CornerRightDown', 'CornerRightUp', 'CornerUpLeft', 'CornerUpRight', 'Cpu', 'Crop', 'Crosshair',
  'Database', 'Delete', 'Disc', 'Divide', 'DivideCircle', 'DivideSquare', 'Download', 'DownloadCloud',
  'Droplet', 'Edit', 'Edit2', 'Edit3', 'ExternalLink', 'Eye', 'EyeOff', 'Facebook', 'FastForward',
  'Figma', 'File', 'FileMinus', 'FilePlus', 'FileText', 'Film', 'Filter', 'Flag', 'Folder',
  'FolderMinus', 'FolderPlus', 'Framer', 'Frown', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest',
  'Github', 'Gitlab', 'Globe', 'Grid', 'HardDrive', 'Hash', 'Headphones', 'HelpCircle', 'Hexagon',
  'History', 'Home', 'Image', 'Inbox', 'Info', 'Instagram', 'Italic', 'Key', 'Layers', 'Layout',
  'LifeBuoy', 'Link', 'Linkedin', 'List', 'Loader', 'Lock', 'LogIn', 'LogOut', 'Mail', 'MapPin',
  'Maximize', 'Meh', 'Menu', 'MessageCircle', 'Minus', 'MinusCircle', 'MinusSquare', 'Monitor',
  'Moon', 'MoreHorizontal', 'MoreVertical', 'MousePointer', 'Move', 'Music', 'Navigation',
  'Navigation2', 'Octagon', 'Package', 'Paperclip', 'Pause', 'PauseCircle', 'PenTool', 'Percent',
  'PhoneCall', 'PhoneForwarded', 'PhoneIncoming', 'PhoneMissed', 'PhoneOff', 'PhoneOutgoing',
  'PieChart', 'Play', 'PlayCircle', 'Plus', 'PlusCircle', 'PlusSquare', 'Pocket', 'Power',
  'Printer', 'Radio', 'RefreshCcw', 'Repeat', 'Rewind', 'RotateCcw', 'RotateCw', 'Rss', 'Save',
  'Scissors', 'Search', 'Send', 'Server', 'Share', 'Share2', 'Shield', 'Shuffle', 'Sidebar',
  'SkipBack', 'SkipForward', 'Slack', 'Slash', 'Sliders', 'Smartphone', 'Smile', 'Speaker',
  'Square', 'Star', 'StopCircle', 'Sun', 'Sunrise', 'Sunset', 'Tablet', 'Tag', 'Target', 'Terminal',
  'Thermometer', 'ThumbsDown', 'ToggleLeft', 'ToggleRight', 'Tool', 'Trash', 'Trash2', 'Trello',
  'TrendingDown', 'TrendingUp', 'Triangle', 'Truck', 'Tv', 'Twitch', 'Twitter', 'Type', 'Umbrella',
  'Underline', 'Unlock', 'Upload', 'UploadCloud', 'User', 'UserCheck', 'UserMinus', 'UserPlus',
  'UserX', 'Users', 'Video', 'VideoOff', 'Voicemail', 'Volume', 'Volume1', 'VolumeX', 'Watch',
  'Wifi', 'WifiOff', 'Wind', 'X', 'XCircle', 'XOctagon', 'XSquare', 'Youtube', 'Zap', 'ZapOff',
  'ZoomIn', 'ZoomOut',
];


const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  const SelectedIconComponent = selectedIcon ? (LucideIcons as any)[selectedIcon] : LucideIcons.Circle;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
          {SelectedIconComponent && <SelectedIconComponent className="mr-2 h-4 w-4 text-muted-foreground" />}
          {selectedIcon || "Select Icon"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 bg-popover border-border shadow-lg">
        <div className="grid grid-cols-6 gap-1">
          {availableIcons.map((iconName) => {
            const IconComponent = (LucideIcons as any)[iconName];
            return (
              <Button
                key={iconName}
                variant="ghost"
                size="icon"
                onClick={() => onSelectIcon(iconName)}
                className={cn(
                  "h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
                  selectedIcon === iconName && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;