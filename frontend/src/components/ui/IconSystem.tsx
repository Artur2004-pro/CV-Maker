import React from 'react';
import { 
  // Navigation & Layout
  Home,
  FileText,
  Settings,
  User,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  Layout,
  
  // CV & Document Icons
  File,
  Download,
  Upload,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Save,
  Copy,
  Share2,
  Printer,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  
  // Status & Feedback
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  Clock,
  Calendar,
  Star,
  Heart,
  Bookmark,
  Flag,
  TrendingUp,
  Award,
  Target,
  Shield,
  Lock,
  Unlock,
  
  // Actions & Interactions
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  MoreHorizontal,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  
  // Content & Media
  Image,
  Video,
  Music,
  Folder,
  FolderOpen,
  Archive,
  Paperclip,
  Link,
  
  // UI Elements
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  Battery,
  Volume2,
  Mic,
  MicOff,
  VideoOff,
  Camera,
  CameraOff,
  
  // Business & Professional
  Briefcase,
  Building,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Crown,
  Gem,
  Trophy,
  Medal,
  GraduationCap,
  
  // Data & Analytics
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Database,
  Cloud,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  
  // Communication
  MessageSquare,
  Send,
  Reply,
  Forward,
  AtSign,
  Hash,
  
  // Time & Dates
  Timer,
  Hourglass,
  
  // Shapes & Design
  Circle,
  Square,
  Triangle,
  Hexagon,
  Diamond,
  Sparkles,
  Flame,
  Zap,
  Minus,
  
  // Arrows & Navigation
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  Move,
  Move3d,
  Maximize,
  Minimize,
  Expand,
  Shrink,
  
  // Editing & Tools
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Undo,
  Redo,
  Scissors,
  Clipboard,
  
  // Security & Privacy
  Key,
  Fingerprint,
  EyeOff,
  
  // Social & Sharing
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  
  // Shopping & Commerce
  ShoppingCart,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Tag,
  Tags,
  Package,
  Truck,
  
  // Health & Wellness
  Thermometer,
  Pill,
  Stethoscope,
  
  // Education & Learning
  Book,
  BookOpen,
  Brain,
  Lightbulb,
  
  // Entertainment
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  VolumeX,
  
  // Weather & Environment
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  TreePine,
  
  // Transportation
  Car,
  Plane,
  Train,
  Ship,
  Bike,
  Navigation,
  
  // Technology
  Laptop,
  Bluetooth,
  Usb,
  Code,
  Terminal,
  GitBranch,
  GitMerge,
  GitPullRequest,
  
  // Miscellaneous
  Coffee,
  Pizza,
  Gift,
  PartyPopper
} from 'lucide-react';

// Icon sizes
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface IconProps {
  size?: IconSize;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

// Size mappings
const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 40,
};

// Base Icon Component
export const AppIcon: React.FC<{
  icon: React.ComponentType<any>;
  size?: IconSize;
  className?: string;
  color?: string;
  strokeWidth?: number;
}> = ({ icon: Icon, size = 'md', className = '', color, strokeWidth = 2 }) => {
  const iconSize = sizeMap[size];
  
  return (
    <Icon
      size={iconSize}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
};

// Professional Icon Components with predefined styles
export const ProfessionalIcons = {
  // Navigation Icons
  HomeIcon: (props: IconProps) => (
    <AppIcon icon={Home} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  DashboardIcon: (props: IconProps) => (
    <AppIcon icon={Home} {...props} className={`text-indigo-600 ${props.className || ''}`} />
  ),
  CVIcon: (props: IconProps) => (
    <AppIcon icon={FileText} {...props} className={`text-purple-600 ${props.className || ''}`} />
  ),
  EditorIcon: (props: IconProps) => (
    <AppIcon icon={Edit3} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  TemplatesIcon: (props: IconProps) => (
    <AppIcon icon={Layout} {...props} className={`text-orange-600 ${props.className || ''}`} />
  ),
  SettingsIcon: (props: IconProps) => (
    <AppIcon icon={Settings} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  ProfileIcon: (props: IconProps) => (
    <AppIcon icon={User} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  
  // Action Icons
  SaveIcon: (props: IconProps) => (
    <AppIcon icon={Save} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  DownloadIcon: (props: IconProps) => (
    <AppIcon icon={Download} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  UploadIcon: (props: IconProps) => (
    <AppIcon icon={Upload} {...props} className={`text-purple-600 ${props.className || ''}`} />
  ),
  EditIcon: (props: IconProps) => (
    <AppIcon icon={Edit3} {...props} className={`text-indigo-600 ${props.className || ''}`} />
  ),
  DeleteIcon: (props: IconProps) => (
    <AppIcon icon={Trash2} {...props} className={`text-red-600 ${props.className || ''}`} />
  ),
  AddIcon: (props: IconProps) => (
    <AppIcon icon={Plus} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  ViewIcon: (props: IconProps) => (
    <AppIcon icon={Eye} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  
  // Status Icons
  SuccessIcon: (props: IconProps) => (
    <AppIcon icon={CheckCircle} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  ErrorIcon: (props: IconProps) => (
    <AppIcon icon={AlertCircle} {...props} className={`text-red-600 ${props.className || ''}`} />
  ),
  WarningIcon: (props: IconProps) => (
    <AppIcon icon={AlertTriangle} {...props} className={`text-orange-600 ${props.className || ''}`} />
  ),
  InfoIcon: (props: IconProps) => (
    <AppIcon icon={Info} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  LoadingIcon: (props: IconProps) => (
    <AppIcon icon={Loader2} {...props} className={`text-blue-600 animate-spin ${props.className || ''}`} />
  ),
  
  // Business Icons
  BriefcaseIcon: (props: IconProps) => (
    <AppIcon icon={Briefcase} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  BuildingIcon: (props: IconProps) => (
    <AppIcon icon={Building} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  AwardIcon: (props: IconProps) => (
    <AppIcon icon={Award} {...props} className={`text-yellow-600 ${props.className || ''}`} />
  ),
  TrophyIcon: (props: IconProps) => (
    <AppIcon icon={Trophy} {...props} className={`text-yellow-600 ${props.className || ''}`} />
  ),
  StarIcon: (props: IconProps) => (
    <AppIcon icon={Star} {...props} className={`text-yellow-500 ${props.className || ''}`} />
  ),
  GridIcon: (props: IconProps) => (
    <AppIcon icon={Layout} {...props} className={`text-purple-600 ${props.className || ''}`} />
  ),
  CpuIcon: (props: IconProps) => (
    <AppIcon icon={Cpu} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  BookIcon: (props: IconProps) => (
    <AppIcon icon={Book} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  HeartIcon: (props: IconProps) => (
    <AppIcon icon={Heart} {...props} className={`text-red-500 ${props.className || ''}`} />
  ),
  
  // Communication Icons
  EmailIcon: (props: IconProps) => (
    <AppIcon icon={Mail} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  PhoneIcon: (props: IconProps) => (
    <AppIcon icon={Phone} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  LocationIcon: (props: IconProps) => (
    <AppIcon icon={MapPin} {...props} className={`text-red-600 ${props.className || ''}`} />
  ),
  WebsiteIcon: (props: IconProps) => (
    <AppIcon icon={Globe} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  LinkedInIcon: (props: IconProps) => (
    <AppIcon icon={Linkedin} {...props} className={`text-blue-700 ${props.className || ''}`} />
  ),
  GitHubIcon: (props: IconProps) => (
    <AppIcon icon={Github} {...props} className={`text-gray-800 ${props.className || ''}`} />
  ),
  TwitterIcon: (props: IconProps) => (
    <AppIcon icon={Twitter} {...props} className={`text-blue-400 ${props.className || ''}`} />
  ),
  
  // Security Icons
  ShieldIcon: (props: IconProps) => (
    <AppIcon icon={Shield} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  LockIcon: (props: IconProps) => (
    <AppIcon icon={Lock} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  UnlockIcon: (props: IconProps) => (
    <AppIcon icon={Unlock} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  KeyIcon: (props: IconProps) => (
    <AppIcon icon={Key} {...props} className={`text-yellow-600 ${props.className || ''}`} />
  ),
  
  // Analytics Icons
  TrendingUpIcon: (props: IconProps) => (
    <AppIcon icon={TrendingUp} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  ChartIcon: (props: IconProps) => (
    <AppIcon icon={BarChart} {...props} className={`text-purple-600 ${props.className || ''}`} />
  ),
  ActivityIcon: (props: IconProps) => (
    <AppIcon icon={Activity} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  
  // Time Icons
  CalendarIcon: (props: IconProps) => (
    <AppIcon icon={Calendar} {...props} className={`text-indigo-600 ${props.className || ''}`} />
  ),
  ClockIcon: (props: IconProps) => (
    <AppIcon icon={Clock} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  
  // Navigation Arrows
  ChevronRightIcon: (props: IconProps) => (
    <AppIcon icon={ChevronRight} {...props} className={`text-gray-400 ${props.className || ''}`} />
  ),
  ChevronLeftIcon: (props: IconProps) => (
    <AppIcon icon={ChevronLeft} {...props} className={`text-gray-400 ${props.className || ''}`} />
  ),
  ChevronDownIcon: (props: IconProps) => (
    <AppIcon icon={ChevronDown} {...props} className={`text-gray-400 ${props.className || ''}`} />
  ),
  ArrowRightIcon: (props: IconProps) => (
    <AppIcon icon={ArrowRight} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  ArrowLeftIcon: (props: IconProps) => (
    <AppIcon icon={ArrowLeft} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  
  // Menu Icons
  MenuIcon: (props: IconProps) => (
    <AppIcon icon={Menu} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  CloseIcon: (props: IconProps) => (
    <AppIcon icon={X} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  
  // Search & Filter
  SearchIcon: (props: IconProps) => (
    <AppIcon icon={Search} {...props} className={`text-gray-400 ${props.className || ''}`} />
  ),
  FilterIcon: (props: IconProps) => (
    <AppIcon icon={Filter} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  
  // Notifications
  BellIcon: (props: IconProps) => (
    <AppIcon icon={Bell} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  
  // User Actions
  LogoutIcon: (props: IconProps) => (
    <AppIcon icon={LogOut} {...props} className={`text-red-600 ${props.className || ''}`} />
  ),
  
  // Document Icons
  FileTextIcon: (props: IconProps) => (
    <AppIcon icon={FileText} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  ShareIcon: (props: IconProps) => (
    <AppIcon icon={Share2} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  CreditCardIcon: (props: IconProps) => (
    <AppIcon icon={CreditCard} {...props} className={`text-purple-600 ${props.className || ''}`} />
  ),
  TrashIcon: (props: IconProps) => (
    <AppIcon icon={Trash2} {...props} className={`text-red-600 ${props.className || ''}`} />
  ),
  AlertTriangleIcon: (props: IconProps) => (
    <AppIcon icon={AlertTriangle} {...props} className={`text-orange-600 ${props.className || ''}`} />
  ),
  
  // UI Elements
  SunIcon: (props: IconProps) => (
    <AppIcon icon={Sun} {...props} className={`text-yellow-500 ${props.className || ''}`} />
  ),
  MoonIcon: (props: IconProps) => (
    <AppIcon icon={Moon} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  MonitorIcon: (props: IconProps) => (
    <AppIcon icon={Monitor} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  SmartphoneIcon: (props: IconProps) => (
    <AppIcon icon={Smartphone} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  TabletIcon: (props: IconProps) => (
    <AppIcon icon={Tablet} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  EyeIcon: (props: IconProps) => (
    <AppIcon icon={Eye} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  TargetIcon: (props: IconProps) => (
    <AppIcon icon={Target} {...props} className={`text-orange-600 ${props.className || ''}`} />
  ),
  UserCheckIcon: (props: IconProps) => (
    <AppIcon icon={UserCheck} {...props} className={`text-green-600 ${props.className || ''}`} />
  ),
  GlobeIcon: (props: IconProps) => (
    <AppIcon icon={Globe} {...props} className={`text-blue-600 ${props.className || ''}`} />
  ),
  
  // Premium Icons with special effects
  SparkleIcon: (props: IconProps) => (
    <AppIcon icon={Sparkles} {...props} className={`text-yellow-500 animate-pulse ${props.className || ''}`} />
  ),
  ZapIcon: (props: IconProps) => (
    <AppIcon icon={Zap} {...props} className={`text-yellow-500 ${props.className || ''}`} />
  ),
  FlameIcon: (props: IconProps) => (
    <AppIcon icon={Flame} {...props} className={`text-orange-500 ${props.className || ''}`} />
  ),
  CrownIcon: (props: IconProps) => (
    <AppIcon icon={Crown} {...props} className={`text-yellow-500 ${props.className || ''}`} />
  ),
  GemIcon: (props: IconProps) => (
    <AppIcon icon={Gem} {...props} className={`text-purple-500 ${props.className || ''}`} />
  ),
  
  // Additional Icons for Canvas
  SquareIcon: (props: IconProps) => (
    <AppIcon icon={Square} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  CircleIcon: (props: IconProps) => (
    <AppIcon icon={Circle} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  MinusIcon: (props: IconProps) => (
    <AppIcon icon={Minus} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  CopyIcon: (props: IconProps) => (
    <AppIcon icon={Copy} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
  ChevronUpIcon: (props: IconProps) => (
    <AppIcon icon={ChevronUp} {...props} className={`text-gray-600 ${props.className || ''}`} />
  ),
};

export default ProfessionalIcons;
