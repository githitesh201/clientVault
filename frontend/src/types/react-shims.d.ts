declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }

  interface Element {
    [key: string]: any;
  }
}

declare module 'react' {
  export type ReactNode = any;
  export type FormEvent = any;
  export type EffectCallback = () => void | (() => void);

  interface Context<T> {
    Provider: (props: { value: T; children?: ReactNode }) => JSX.Element;
  }

  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useEffect(effect: EffectCallback, deps?: unknown[]): void;
  export function useState<T>(
    initial: T | (() => T)
  ): [T, (next: T | ((previous: T) => T)) => void];

  const React: {
    StrictMode: (props: { children?: ReactNode }) => JSX.Element;
  };

  export default React;
}

declare module 'react-dom/client' {
  const ReactDOM: {
    createRoot(container: Element): {
      render(node: any): void;
    };
  };

  export default ReactDOM;
}

declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}
