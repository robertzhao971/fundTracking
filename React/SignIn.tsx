import React, {useContext, useRef} from 'react';
import AuthContext from "./contexts";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import config from './data/firebaseConfig.json';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {withStyles, createStyles, Theme, WithStyles} from '@material-ui/core/styles/';

firebase.initializeApp(config);

const styles = (theme:Theme) => createStyles({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});

interface Props extends WithStyles<typeof styles> {
}

const userLogin = async (emailEl: React.RefObject<HTMLInputElement>, passwordEl: React.RefObject<HTMLInputElement>) => {
  let idToken = '';
  let email = emailEl.current ? emailEl.current.value : null;
  let password = passwordEl.current ? passwordEl.current.value : null;
  try{
    if(email && password){
      await firebase.auth().signInWithEmailAndPassword(email, password);
      let currentUser = await firebase.auth().currentUser;
      if (currentUser) idToken = await currentUser.getIdToken();
    } else {
      alert("Empty Field");
    }
  } catch(error) {
    alert(error.message);
    if(emailEl.current && passwordEl.current){
      emailEl.current.value = '';
      passwordEl.current.value = '';
    }
  } finally {
    return idToken;
  }
}

const SignIn = (props:Props) =>{

  const submitForm = async (event: React.MouseEvent) => {
    event.preventDefault();
    let loggedInUser = await userLogin(emailEl, passwordEl);
    if(loggedInUser) auth.updateAuth({loggedIn: true, user: loggedInUser});
  }

  const auth = useContext(AuthContext);
  const {classes} = props;
  let emailEl = useRef<HTMLInputElement>(null);
  let passwordEl =useRef<HTMLInputElement>(null);

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input name="email" autoComplete="email" inputRef={emailEl} autoFocus />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" inputRef={passwordEl} autoComplete="current-password" />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={ submitForm }
            className={classes.submit}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </main>
  );
}

export default withStyles(styles)(SignIn);