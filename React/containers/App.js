import React from 'react';
import { connect } from 'react-redux';
import SignIn from './SignIn';
import Dashboard from './Dashboard';

const mapStateToProps = (state) => {
  const { isLoggedIn  } = state.logIn;
  return { isLoggedIn };
}

const App = (props) => {
  const { isLoggedIn } = props;

  if (isLoggedIn) {
    return <Dashboard />
  } else {
    return <SignIn />
  }
}

export default connect(mapStateToProps)(App);
