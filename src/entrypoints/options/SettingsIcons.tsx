import {
  AlertCircle as LucideAlertCircle,
  Bookmark as LucideBookmark,
  Briefcase as LucideBriefcase,
  Check as LucideCheck,
  CheckCircle2 as LucideCheckCircle2,
  Copy as LucideCopy,
  Database as LucideDatabase,
  ExternalLink as LucideExternalLink,
  Info as LucideInfo,
  Pencil as LucidePencil,
  Plus as LucidePlus,
  Save as LucideSave,
  Settings as LucideSettings,
  ShieldCheck as LucideShieldCheck,
  Sparkles as LucideSparkles,
  Trash2 as LucideTrash2,
  User as LucideUser,
  X as LucideX,
} from 'lucide-react';

export function SettingsIcon({ className = 'size-5' }: { className?: string }) {
  return <LucideSettings className={className} aria-hidden="true" />;
}

export function UserIcon({ className = 'size-4' }: { className?: string }) {
  return <LucideUser className={className} aria-hidden="true" />;
}

export function BriefcaseIcon({ className = 'size-4' }: { className?: string }) {
  return <LucideBriefcase className={className} aria-hidden="true" />;
}

export function BookmarkIcon({ className = 'size-4' }: { className?: string }) {
  return <LucideBookmark className={className} aria-hidden="true" />;
}

export function DatabaseIcon({ className = 'size-4' }: { className?: string }) {
  return <LucideDatabase className={className} aria-hidden="true" />;
}

export function TrashIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucideTrash2 className={className} aria-hidden="true" />;
}

export function PlusIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucidePlus className={className} aria-hidden="true" />;
}

export function PencilIcon({ className = 'size-3' }: { className?: string }) {
  return <LucidePencil className={className} aria-hidden="true" />;
}

export function ExternalLinkIcon({ className = 'size-3' }: { className?: string }) {
  return <LucideExternalLink className={className} aria-hidden="true" />;
}

export function CheckCircle2Icon({ className = 'size-4' }: { className?: string }) {
  return <LucideCheckCircle2 className={className} aria-hidden="true" />;
}

export function AlertCircleIcon({ className = 'size-4' }: { className?: string }) {
  return <LucideAlertCircle className={className} aria-hidden="true" />;
}

export function ShieldLockIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucideShieldCheck className={className} aria-hidden="true" />;
}

export function CheckIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucideCheck className={className} aria-hidden="true" />;
}

export function CopyIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucideCopy className={className} aria-hidden="true" />;
}

export function SaveIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucideSave className={className} aria-hidden="true" />;
}

export function SparklesIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucideSparkles className={className} aria-hidden="true" />;
}

export function InfoIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucideInfo className={className} aria-hidden="true" />;
}

export function XIcon({ className = 'size-3.5' }: { className?: string }) {
  return <LucideX className={className} aria-hidden="true" />;
}
