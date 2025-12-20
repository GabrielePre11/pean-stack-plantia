declare global {
  namespace Express {
    interface Request {
      cookies: Record<string, string>;
      user?: {
        id: number;
        role: "USER" | "ADMIN";
      };
    }
  }
}

export {};
