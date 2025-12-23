export type SignIn = {
  email: string;
  password: string;
};

export type SignUp = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export type AuthResponse = { user: User };

export type SignInResponse = {
  user: string;
  messsage: string;
};
