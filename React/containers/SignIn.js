import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { fetchLogIn } from '../redux/asyncActions';
import { logInFail } from '../redux/syncActions';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const mapDispatch = { fetchLogIn, logInFail };

const mapStateToProps = (state) => {
  const { errorMessage   } = state.logIn;
  return { errorMessage };
}

const SignIn = (props) => {
  const { errorMessage, fetchLogIn, logInFail } = props;

  let emailRef = useRef(null);
  let passwordRef =useRef(null);

  const handleLogin = (event) => {
    event.preventDefault();
    let email = emailRef.current ? emailRef.current.value : null;
    let password = passwordRef.current ? passwordRef.current.value : null;
    if (email && password) {
      fetchLogIn(email, password);
    } else {
      logInFail("empty fields");
    }
  }

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            inputRef={emailRef}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            inputRef={passwordRef}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={ handleLogin }
          >
            Sign In
          </Button>
        </form>
        <p>{errorMessage}</p>
      </div>
    </Container>
  );
}

export default connect(mapStateToProps, mapDispatch)(SignIn);