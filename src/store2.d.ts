declare module "store2" {
  export interface Store2Namespace {
    get(key: string): unknown;
    set(key: string, value: unknown): unknown;
    remove(key: string): unknown;
    has?(key: string): boolean;
  }

  export interface Store2Static extends Store2Namespace {
    (key: string, value?: unknown): unknown;
    namespace(namespace: string): Store2Namespace;
    session: {
      namespace(namespace: string): Store2Namespace;
    };
  }

  const store2: Store2Static;
  export default store2;
}