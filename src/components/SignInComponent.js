import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core';
import { theme, useStylesSignin as useStyles } from '../styles/signinSignupStyles';
import { useFormik } from 'formik';
import { DisplayFormikState } from '../shared/DisplayFormikState';
import * as Yup from 'yup';
import { loginUser } from '../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/home">
        sciForum
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const signinSchema = Yup.object().shape({
  username: Yup.string()
    .required('Required'),
  /*email: Yup.string()
    .email()
    .required('Required'),*/
  password: Yup.string()
    .required('Required'),
});

export default function SignIn(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.Auth);
  const history = useHistory();
  const [isRememberMe, setRememberMe] = React.useState(false);

  const formik = useFormik({
    initialValues: {username: '', email: '', password: '', rememberMe: false},
    onSubmit: (values, {}) => {
      //alert(JSON.stringify(values));
      dispatch(loginUser(values));
      props.handleModalClose();
      /*if(auth.isAuthenticated) {
        return(<Redirect to="/questions"/>);
      }*/
    },
    validationSchema: signinSchema
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className={classes.content}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              error={formik.errors.username && formik.touched.username}
              helperText={(formik.errors.username && formik.touched.username) && formik.errors.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              aria-describedby="password-errors"
              error={formik.errors.password && formik.touched.password}
              helperText={(formik.errors.password && formik.touched.password) && formik.errors.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" onChange={(event) => formik.setFieldValue('rememberMe', event.target.checked)}/>}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            {/*<DisplayFormikState {...props}/>*/}
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
}