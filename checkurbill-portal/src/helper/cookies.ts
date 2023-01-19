import cookie from "js-cookie";
import cookies from 'cookiejs';

export const setCookie = (name: string, value: string) => {
  // cookie.set(name, value);
  cookies.set(name, value, 1) 
};

export const getCookie = (name: string): string | null => {
  // return cookie.get(name);
  return cookies.get(name) ? cookies.get(name) as string : null;
};

export const removeCookie = (name: string) => {
  // cookie.remove(name);
  cookies.remove(name);
};
