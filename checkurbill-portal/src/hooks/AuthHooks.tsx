import { Role } from "../models/Role";
import { User, UserInfo } from "../models/User";
import { getCookie } from '../helper/cookies';
import { IGenericResponse } from '../models/response/Response';

interface UserInterface {
  info?: UserInfo | null;
  roles: Role[];
}

// Define a type for the slice state
export type UserAuthHooks = UserInterface & User;

export const authHooks = async (): Promise<IGenericResponse<UserAuthHooks> | null> => {
  try {
    let token = getCookie('auth_token');
    let r = await fetch(`http://127.0.0.1:8000/api/portal/user-auth`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return r.json();
  } catch (error) {
    return null;
  }
};
