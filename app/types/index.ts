export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  timestamp: Date;
  expiresAt: number;
  userAvatar: string;
  userName: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'emoji';
  timestamp: Date;
  senderId: string;
  mediaUrl?: string;
} 