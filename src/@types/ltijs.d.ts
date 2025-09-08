declare module 'ltijs' {
  const ltiModule: {
    lti: {
      Provider: (encryptionKey: string) => LTIProvider;
      MemoryDb: any;
    };
  };

  interface LTIProvider {
    setup(database?: string, options?: any): Promise<LTIProvider>;
    registerPlatform(config: any): Promise<void>;
    oidcLogin(params: any): Promise<string>;
    validateIdToken(token: string, state?: string): Promise<any>;
    getPublicKey(): Promise<any>;
  }

  export = ltiModule;
}