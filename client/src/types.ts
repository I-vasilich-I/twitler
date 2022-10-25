interface ISignUpData {
  username: string;
  email: string;
  password: string;
}

type ISignInData = Omit<ISignUpData, "username">;

interface IAuthData {
  email: string;
  password: string;
  username?: string;
}

interface IUser {
  id: number;
  email: string;
  username: string;
  isActivated: boolean;
  bio: string;
  avatar: string;
}

interface IAuthResponseData {
  user: IUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export type { ISignUpData, ISignInData, IAuthData, IUser, IAuthResponseData };
