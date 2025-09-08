import { writable } from 'svelte/store';
import type { Citation, CitationStyle } from '../types';
import { storage } from '../utils/storage';

function createCitationsStore() {
  const { subscribe, set, update } = writable<Citation[]>([]);

  return {
    subscribe,
    
    load() {
      const citations = storage.getCitations();
      set(citations);
    },

    add(citation: Citation) {
      update(citations => {
        const newCitations = [...citations, citation];
        storage.setCitations(newCitations);
        return newCitations;
      });
    },

    update(id: string, updatedCitation: Citation) {
      update(citations => {
        const newCitations = citations.map(c => 
          c.id === id ? updatedCitation : c
        );
        storage.setCitations(newCitations);
        return newCitations;
      });
    },

    remove(id: string) {
      update(citations => {
        const newCitations = citations.filter(c => c.id !== id);
        storage.setCitations(newCitations);
        return newCitations;
      });
    },

    clear() {
      set([]);
      storage.setCitations([]);
    }
  };
}

function createStyleStore() {
  const { subscribe, set } = writable<CitationStyle>('APA');

  return {
    subscribe,
    
    load() {
      const style = storage.getStyle();
      set(style);
    },

    set(style: CitationStyle) {
      set(style);
      storage.setStyle(style);
    }
  };
}

export const citations = createCitationsStore();
export const citationStyle = createStyleStore();