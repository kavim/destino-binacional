export {};

declare global {
  interface Window {
    _translations: Record<string, string>;
    axios: {
      post: (url: string, data?: unknown) => Promise<unknown>;
    };
  }
}
