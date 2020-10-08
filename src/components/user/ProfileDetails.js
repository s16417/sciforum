import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { LocationOn, AccountCircle } from '@material-ui/icons';
import { theme, useStyles } from './styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, fetchUser } from '../../redux/ActionCreators';

export default function ProfileDetails(props) {

  const classes = useStyles();
  const auth = useSelector(state => state.Auth);
  const user = useSelector(state => state.User);
  const dispatch = useDispatch();

  const usernameFromTheUrl = props.match.params.username;

  const [values, setValues] = useState({
    location: user.user ? user.user.data.profile.location: null,
    displayName: user.user ? user.user.data.profile.displayName: null,
  });

  React.useEffect(() => {
    if(user.status === 'idle') {
      dispatch(fetchUser(null, usernameFromTheUrl));
    }
  }, [user, dispatch]);

  React.useEffect(() => {
    if(user.user) {
      handleUserInfo(user.user.data.profile.location, user.user.data.profile.displayName);
    }
  }, [user]);

  const handleUserInfo = (location, displayName) => {
    setValues({
      location,
      displayName,
    });
  }

  const profileSchema = Yup.object().shape({
    location: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!'),
    displayName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!'),
  });

  const formik = useFormik({
    initialValues: {
      location: values.location,
      displayName: values.displayName,
    },
    onSubmit: (values) => {
      //console.log(values);
      dispatch(updateUser(auth, values.firstname, values.lastname, values.aboutMe));
    },
    validationSchema: profileSchema,
  });

  //console.log(values.location);

  if(user.status === 'loading' || user.status === 'idle') {
    return <CircularProgress color="secondary" size={15}/>
  }else if(user.status === 'failed') {
    return <h2>Error loading!</h2>
  }else {
    return (
      <ThemeProvider theme={theme}>
        <Card className={classes.root} elevation={1}>
          <Grid container direction="column" justify="flex-start" alignItems="flex-start">
            <Grid item>
              <CardHeader title="Profile"/>
            </Grid>
            <Divider className={classes.divider}/>
            <CardContent>
              <Grid item>
                <Typography className={classes.iconWrap}><LocationOn style={{marginRight: 3}}/>Lives in {values.location}</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.iconWrap}><LocationOn style={{marginRight: 3}}/>Lives in {values.location}</Typography>
              </Grid>
            </CardContent>
          </Grid>
        </Card>
        {/*<form className={classes.root} onSubmit={formik.handleSubmit}>
          <Card className={classes.root} elevation={1}>
            <CardHeader title="Profile"/>
            <Divider className={classes.divider} style={{backgroundColor: 'inherit'}}/>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.firstname && formik.errors.firstname}
                    helperText={(formik.errors.firstname && formik.touched.firstname) && formik.errors.firstname}
                    id="firstname"
                    label="First name"
                    name="firstname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstname}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.lastname && formik.errors.lastname}
                    helperText={(formik.errors.lastname && formik.touched.lastname) && formik.errors.lastname}
                    label="Last name"
                    id="lastname"
                    name="lastname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastname}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="About Me"
                    id="aboutMe"
                    name="aboutMe"
                    onChange={formik.handleChange}
                    value={formik.values.aboutMe}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2} >
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className={classes.submit}
              >
                Save
              </Button>
            </Box>
          </Card>
        </form>*/}
      </ThemeProvider>
    );
  }
};
