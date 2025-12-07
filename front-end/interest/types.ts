export interface Event {
  id: string;
  title: string;
  dateStr: string;
  startTime: string; // ISO format or 24h string for sorting
  endTime: string;
  location: string;
  country?: string;
  category: string;
  imageUrl: string;
  imageType?: 'image' | 'video'; // New: Support video/gif
  organizerName: string;
  organizerAvatar: string;
  organizerId?: string; // To link to user/page
  organizerType?: 'user' | 'page';
  coHosts?: UserProfile[]; // New: Co-hosts
  price: string;
  description?: string;
  
  // Status flags
  isSoldOut?: boolean;
  isEnded?: boolean;
  
  // User interaction
  isLiked?: boolean;
  isOwner?: boolean; // Mock flag to check if current user owns this
  isRegistered?: boolean; // New: Track registration status
  attendeesCount?: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string; // Color code or image URL
  bio?: string;
}

export interface ManagedPage {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface DateFilter {
  start: string;
  end: string;
  isAuto: boolean;
}

export type Theme = 'light' | 'dark' | 'system';

export type ViewMode = 'list' | 'grid';
export type AppView = 'landing' | 'dashboard';
export type DashboardPage = 'discover' | 'interest' | 'profile' | 'activity';