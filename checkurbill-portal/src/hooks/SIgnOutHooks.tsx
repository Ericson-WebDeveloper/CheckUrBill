import React from 'react'
import { CLEAR_CREDENTIALS } from '../feature/auth/auth';
import { useAppDispatch } from '../feature/index';
import { useNavigate } from 'react-router-dom';

type Props = {}

const SignOutHooks = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleSignOut = () => {
        dispatch(CLEAR_CREDENTIALS());
        navigate('/', {replace: true});
    }

  return {handleSignOut}
}

export default SignOutHooks