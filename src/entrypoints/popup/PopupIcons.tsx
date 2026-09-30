import { cn } from 'cn';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Lock,
  MapPin,
  Monitor,
  Moon,
  Radio,
  Settings,
  ShieldCheck,
  Star,
  Sun,
  Target,
} from 'lucide-react';
import type { ComponentProps } from 'react';

export type IconProps = ComponentProps<'svg'>;

export function ShieldCheckIcon({ className, ...props }: IconProps) {
  return <ShieldCheck className={cn('size-3.5', className)} {...props} />;
}

export function StarIcon({ className, ...props }: IconProps) {
  return <Star className={cn('size-3.5', className)} {...props} />;
}

export function ClockIcon({ className, ...props }: IconProps) {
  return <Clock className={cn('size-3.5', className)} {...props} />;
}

export function MapPinIcon({ className, ...props }: IconProps) {
  return <MapPin className={cn('size-3.5', className)} {...props} />;
}

export function AlertTriangleIcon({ className, ...props }: IconProps) {
  return <AlertTriangle className={cn('size-4', className)} {...props} />;
}

export function ChevronDownIcon({ className, ...props }: IconProps) {
  return <ChevronDown className={cn('size-4', className)} {...props} />;
}

export function CheckCircleIcon({ className, ...props }: IconProps) {
  return <CheckCircle2 className={cn('size-3.5', className)} {...props} />;
}

export function LockIcon({ className, ...props }: IconProps) {
  return <Lock className={cn('size-3', className)} {...props} />;
}

export function BuildingIcon({ className, ...props }: IconProps) {
  return <Building2 className={cn('size-3.5', className)} {...props} />;
}

export function TargetIcon({ className, ...props }: IconProps) {
  return <Target className={cn('size-3.5', className)} {...props} />;
}

export function RadarIcon({ className, ...props }: IconProps) {
  return <Radio className={cn('size-6', className)} {...props} />;
}

export function SunIcon({ className, ...props }: IconProps) {
  return <Sun className={cn('size-3.5', className)} {...props} />;
}

export function MoonIcon({ className, ...props }: IconProps) {
  return <Moon className={cn('size-3.5', className)} {...props} />;
}

export function MonitorIcon({ className, ...props }: IconProps) {
  return <Monitor className={cn('size-3.5', className)} {...props} />;
}

export function SettingsIcon({ className, ...props }: IconProps) {
  return <Settings className={cn('size-3.5', className)} {...props} />;
}

export function ExternalLinkIcon({ className, ...props }: IconProps) {
  return <ExternalLink className={cn('size-3', className)} {...props} />;
}
