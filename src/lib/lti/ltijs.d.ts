// Type declarations for ltijs
declare module 'ltijs' {
  export const lti: {
    Provider: (encryptionKey: string) => any;
    MemoryDb: any;
  };
}