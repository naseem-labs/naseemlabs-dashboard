import type { ConcernArea, LeadSource, PhotoType } from '../types/addLead';
import type { LucideIcon } from 'lucide-react';
import {
  CircleDot,
  HelpCircle,
  ScanFace,
  Sparkles,
  Waves,
} from 'lucide-react';

export const LEAD_SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'call', label: 'Call' },
  { value: 'walk_in', label: 'Walk-In' },
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' },
];

export const CONCERN_AREA_OPTIONS: {
  value: ConcernArea;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: 'front', label: 'Front', icon: ScanFace },
  { value: 'crown', label: 'Crown', icon: CircleDot },
  { value: 'front_crown', label: 'Front + Crown', icon: Sparkles },
  { value: 'general_thinning', label: 'General Thinning', icon: Waves },
  { value: 'not_sure', label: 'Not Sure', icon: HelpCircle },
];

export const PHOTO_TYPE_OPTIONS: { value: PhotoType; label: string }[] = [
  { value: 'front', label: 'Front' },
  { value: 'top', label: 'Top' },
  { value: 'crown', label: 'Crown' },
  { value: 'donor', label: 'Donor' },
];

export const NOTE_MAX_LENGTH = 250;

export const DEFAULT_COUNTRY_CODE = '+91';

export const SYSTEM_INFO_ITEMS = [
  'Lead saved',
  'Timeline created',
  'Stage = New Lead',
  'Visible in Dashboard',
  'Follow-up can begin',
] as const;

export function getConcernAreaLabel(value: ConcernArea): string {
  return CONCERN_AREA_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function getLeadSourceLabel(value: LeadSource): string {
  return LEAD_SOURCE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
