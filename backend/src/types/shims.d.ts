declare const process: {
  env: Record<string, string | undefined>;
  exit(code?: number): never;
};

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

declare module 'express' {
  export interface Request {
    headers: Record<string, string | undefined>;
    userId?: string;
    [key: string]: any;
  }

  export interface Response {
    status(code: number): Response;
    json(body: any): Response;
    send(body?: any): Response;
    [key: string]: any;
  }

  export type NextFunction = (err?: any) => void;
  export type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;

  export interface Router {
    use: (...args: any[]) => Router;
    get: (...args: any[]) => Router;
    post: (...args: any[]) => Router;
    put: (...args: any[]) => Router;
    patch: (...args: any[]) => Router;
    delete: (...args: any[]) => Router;
    [key: string]: any;
  }

  export function Router(): Router;

  interface ExpressFactory {
    (): Router;
    json(options?: any): RequestHandler;
  }

  const express: ExpressFactory;
  export default express;
}

declare module 'cors' {
  const cors: (options?: any) => any;
  export default cors;
}

declare module 'morgan' {
  const morgan: (format: string) => any;
  export default morgan;
}

declare module 'bcryptjs' {
  export function hash(data: string, salt: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module 'jsonwebtoken' {
  export function sign(payload: object, secret: string, options?: { expiresIn?: string }): string;
  export function verify(token: string, secret: string): unknown;

  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
  };

  export default jwt;
}
