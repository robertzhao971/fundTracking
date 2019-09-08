import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme =>({
  progress : {
    flexGrow: 1,
  }
}));

const Progress = () => {
  const classes = useStyle();
  return (
    <div  className={classes.progress}>
      <LinearProgress color="secondary" />
    </div >
  );
};

export default Progress;
