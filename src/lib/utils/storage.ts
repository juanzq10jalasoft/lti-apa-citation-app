import type { Citation, CitationStyle } from '../types';

const CITATIONS_KEY = 'citations';
const STYLE_KEY = 'citation_style';

export const storage = {
  getCitations(): Citation[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(CITATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setCitations(citations: Citation[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CITATIONS_KEY, JSON.stringify(citations));
    } catch (error) {
      console.error('Failed to save citations:', error);
    }
  },

  getStyle(): CitationStyle {
    if (typeof window === 'undefined') return 'APA';
    
    try {
      const stored = localStorage.getItem(STYLE_KEY);
      return (stored as CitationStyle) || 'APA';
    } catch {
      return 'APA';
    }
  },

  setStyle(style: CitationStyle): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STYLE_KEY, style);
    } catch (error) {
      console.error('Failed to save style:', error);
    }
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(CITATIONS_KEY);
      localStorage.removeItem(STYLE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};