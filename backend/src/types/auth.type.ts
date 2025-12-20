export type SignUpBody = {
  name: string;
  email: string;
  password: string;
};

export type SignInBody = {
  email: string;
  password: string;
};

export interface JWT_PayLoad_Type {
  id: number;
  role: "USER" | "ADMIN";
}
