import { env } from '$env/dynamic/private';
import type { LTIConfig } from './types.js';

// LTI Configuration
export const ltiConfig: LTIConfig = {
  platform: {
    url: env.LTI_PLATFORM_URL || 'https://canvas.instructure.com',
    name: env.LTI_PLATFORM_NAME || 'Canvas LMS',
    clientId: env.LTI_CLIENT_ID || 'your-client-id'
  },
  keySet: {
    keys: []  // Will be populated from platform's public key set
  },
  authConfig: {
    method: 'JWK_SET',
    key: env.LTI_PUBLIC_KEY_URL || 'https://canvas.instructure.com/api/lti/security/jwks'
  },
  encryptionKey: env.LTI_ENCRYPTION_KEY || 'your-encryption-key-here'
};

// LTI Tool Configuration for registration
export const toolConfig = {
  title: 'Citation & Bibliography Manager',
  description: 'Create, manage, and export citations in APA, MLA, and Chicago styles',
  target_link_uri: env.LTI_LAUNCH_URL || 'https://your-app.vercel.app/lti/launch',
  oidc_initiation_url: env.LTI_OIDC_URL || 'https://your-app.vercel.app/lti/login',
  public_jwk_url: env.LTI_PUBLIC_JWK_URL || 'https://your-app.vercel.app/lti/keys',
  extensions: [{
    platform: 'canvas.instructure.com',
    settings: {
      placements: [{
        placement: 'assignment_selection',
        message_type: 'LtiResourceLinkRequest',
        target_link_uri: env.LTI_LAUNCH_URL || 'https://your-app.vercel.app/lti/launch',
        text: 'Citation Manager',
        selection_width: 800,
        selection_height: 600
      }]
    }
  }]
};