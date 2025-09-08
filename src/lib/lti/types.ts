// LTI-specific types, separate from main app types
export interface LTIUser {
  id: string;
  name: string;
  email?: string;
  roles: string[];
}

export interface LTIContext {
  id: string;
  title: string;
  type: string;
  label?: string;
}

export interface LTIPlatform {
  id: string;
  name: string;
  url: string;
  clientId: string;
}

export interface LTILaunchData {
  user: LTIUser;
  context: LTIContext;
  platform: LTIPlatform;
  isInstructor: boolean;
  isStudent: boolean;
  launchUrl: string;
  custom?: Record<string, string>;
}

export interface LTIConfig {
  platform: {
    url: string;
    name: string;
    clientId: string;
  };
  keySet: {
    keys: any[];
  };
  authConfig: {
    method: string;
    key: string;
  };
  encryptionKey: string;
}