import { writable } from 'svelte/store';
import type { LTILaunchData } from './types.js';

// LTI context store - separate from main app stores
export const ltiContext = writable<LTILaunchData | null>(null);
export const isLTIMode = writable<boolean>(false);

// Helper functions to work with LTI context
export function setLTIContext(context: LTILaunchData) {
  ltiContext.set(context);
  isLTIMode.set(true);
}

export function clearLTIContext() {
  ltiContext.set(null);
  isLTIMode.set(false);
}

// Get user-specific storage key for LTI context
export function getLTIStorageKey(baseKey: string, userId?: string): string {
  if (!userId) return baseKey;
  return `${baseKey}_lti_${userId}`;
}