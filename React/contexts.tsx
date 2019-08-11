import React from 'react';

export type updateAuth = {
  loggedIn: boolean,
  user: string
}

const AuthContext = React.createContext({
    loggedIn: false,
    user: '',
    updateAuth: (update:updateAuth) => {}
  });

export default AuthContext;