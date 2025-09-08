import ltijs from 'ltijs';
const { lti } = ltijs;
import { ltiConfig } from './config.js';
import type { LTILaunchData } from './types.js';

class LTIProvider {
  private static instance: LTIProvider;
  private ltiProvider: any;

  private constructor() {
    // Initialize LTIJS provider
    this.ltiProvider = lti.Provider(ltiConfig.encryptionKey);
  }

  static getInstance(): LTIProvider {
    if (!LTIProvider.instance) {
      LTIProvider.instance = new LTIProvider();
    }
    return LTIProvider.instance;
  }

  async setup() {
    // Setup database (in production, use a real database)
    await this.ltiProvider.setup('mongodb://localhost:27017/ltidb', {
      plugin: lti.MemoryDb // Use memory DB for development
    });

    // Register platform
    await this.ltiProvider.registerPlatform({
      url: ltiConfig.platform.url,
      name: ltiConfig.platform.name,
      clientId: ltiConfig.platform.clientId,
      authenticationEndpoint: `${ltiConfig.platform.url}/api/lti/authorize_redirect`,
      accesstokenEndpoint: `${ltiConfig.platform.url}/login/oauth2/token`,
      authConfig: ltiConfig.authConfig
    });

    return this.ltiProvider;
  }

  extractLaunchData(token: any): LTILaunchData {
    const user = {
      id: token.sub,
      name: token.name || token.given_name + ' ' + token.family_name,
      email: token.email,
      roles: token['https://purl.imsglobal.org/spec/lti/claim/roles'] || []
    };

    const context = {
      id: token['https://purl.imsglobal.org/spec/lti/claim/context']?.id || '',
      title: token['https://purl.imsglobal.org/spec/lti/claim/context']?.title || '',
      type: token['https://purl.imsglobal.org/spec/lti/claim/context']?.type || '',
      label: token['https://purl.imsglobal.org/spec/lti/claim/context']?.label
    };

    const platform = {
      id: token.iss,
      name: ltiConfig.platform.name,
      url: ltiConfig.platform.url,
      clientId: ltiConfig.platform.clientId
    };

    const roles = user.roles.map((role: string) => role.toLowerCase());
    const isInstructor = roles.some((role: string) => 
      role.includes('instructor') || role.includes('teacher') || role.includes('faculty')
    );
    const isStudent = roles.some((role: string) => role.includes('learner') || role.includes('student'));

    return {
      user,
      context,
      platform,
      isInstructor,
      isStudent,
      launchUrl: token['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'],
      custom: token['https://purl.imsglobal.org/spec/lti/claim/custom'] || {}
    };
  }

  getProvider() {
    return this.ltiProvider;
  }
}

export default LTIProvider;