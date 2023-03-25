import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Icon from './icon';
import useStyles from './styles';
import Input from './Input';
import { signin, signup } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setformData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();


   const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

   const handleSubmit = (e) => {
    e.preventDefault();

    if(isSignup) {
      dispatch(signup(formData, navigate));
    } else {
      dispatch(signin(formData, navigate));
    }
   };

   const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
   };

   const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
   }

   const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: AUTH, data: { result, token }});
      
      navigate.push('/');
    } catch (error) {
      console.log(error);

    }
   };

   const googleFailure = async () => {
console.log("Google sign in was unsucessful. Try again later")
   };

  return (
    <Container component="main" maxWidth="xs">
      <paper className={classes.paper} elevation={3}>
<Avatar className={classes.avatar}>
<LockOutlinedIcon />
</Avatar>
<Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
<form className={classes.form} onSubmit={handleSubmit}>
  <Grid container spacing={2}>
  {
    isSignup && (
      <>
                     <Input name='firstName' label="First Name" handleChange={handleChange} autoFocus half />
                     <Input name='lastName' label="Last Name" handleChange={handleChange} half />
      </>
    )}
<Input name="email" label="Email Address" handleChange={handleChange} type="email" />
<Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
{isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
  </Grid>
  <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} style={{margin: "5px 0"}}>{isSignup ? 'Sign Up' : 'Sign In'}</Button>
  <GoogleLogin
  clientId="165529690107-h9srfqg1u8nge6tlbrufo5ldt4l7hvb9.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )} 
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
    />
  <Grid container justify="flex-end">
    <Grid item>
      <Button onClick={switchMode}>
        {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }
      </Button>
    </Grid>
  </Grid>
</form>
      </paper>
    </Container>
  )
}

export default Auth;