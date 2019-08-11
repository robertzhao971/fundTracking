import React, { useState } from 'react';


import AuthContext, {updateAuth} from './contexts';
import SignIn from './SignIn';
import DashBoard from './DashBoard';

const App: React.FC = () => {
  const [auth, setAuth] = useState({
    loggedIn: false,
    user: '',
    updateAuth: (update:updateAuth) => {setAuth(auth => ({ ...auth, ...update }))}
  });

  if (!auth.loggedIn) {
    return (
      <AuthContext.Provider value={auth}>
        <SignIn />
      </AuthContext.Provider>
    );
  } 
  else { 
    return (
      <AuthContext.Provider value={auth}>
        <DashBoard />
      </AuthContext.Provider>
    );
  }
}

export default App;
