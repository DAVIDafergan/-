
import { createContext, useContext } from 'react';
import { Post, Ad, User, Comment, ContactMessage, NewsletterSubscriber, AccessibilitySettings } from '../types';

export interface AppState {
  posts: Post[];
  ads: Ad[];
  user: User | null;
  comments: Comment[];
  registeredUsers: User[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  accessibility: AccessibilitySettings;
  
  addPost: (post: Post) => void;
  deletePost: (id: string) => void;
  incrementViews: (id: string) => void; // Added incrementViews
  updateAd: (id: string, updates: Partial<Ad>) => void;
  createAd: (ad: Ad) => void;
  deleteAd: (id: string) => void;
  login: (usernameOrEmail: string, password: string) => boolean;
  logout: () => void;
  register: (user: User) => boolean;
  addComment: (comment: Comment) => void;
  toggleLikeComment: (commentId: string) => void;
  addContactMessage: (msg: ContactMessage) => void;
  subscribeToNewsletter: (email: string) => boolean;
  sendNewsletter: (subject: string, content: string, postId?: string) => void;
  
  // Accessibility
  toggleAccessibilityOption: (option: keyof AccessibilitySettings) => void;
  setFontSize: (size: number) => void;
  resetAccessibility: () => void;
}

export const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
