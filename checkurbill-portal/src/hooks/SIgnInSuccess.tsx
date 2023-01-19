import React from 'react'
import { useAppDispatch } from '../feature'
import { SET_TOKEN, SET_USER_AUTH } from '../feature/auth/auth';
import { Role } from '../models/Role';
import { User, UserInfo } from '../models/User';

type Props = {}

interface UserInterface {
    info?: UserInfo | null;
    roles: Role[];
  }
  
  // Define a type for the slice state
  type UserAuth = UserInterface & User;

const SignInSuccess = () => {
    const dispatch = useAppDispatch();

    const setUpToken = (token: string) => {
        dispatch(SET_TOKEN(token));
    }

    const setUpCredentials = (user: UserAuth) => {
        dispatch(SET_USER_AUTH(user));
    }

  return {
    setUpToken, setUpCredentials
  }
}

export default SignInSuccess