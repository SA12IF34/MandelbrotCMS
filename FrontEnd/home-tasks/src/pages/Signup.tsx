import {useRef, RefObject} from 'react';
import { api } from '../App';
import '../App.css';

import GoogleLogin from './components/GoogleLogin';
import GithubLogin from './components/GithubLogin';

function Signup({handleAlert}: {handleAlert: any}) {

  const usernameRef = useRef() as RefObject<HTMLInputElement>;
  const emailRef = useRef() as RefObject<HTMLInputElement>;
  const passwordRef = useRef() as RefObject<HTMLInputElement>;

  async function handleSubmit() {
    try {
        const response = await api.post('authentication/apis/register/', {
            username: usernameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        })

        if (response.status === 201) {
            window.location.assign('/');
        }
    } catch (error) {
        
        if (error!['code' as keyof typeof error] === 'ERR_NETWORK') {
          handleAlert('The server is down.')
        } else {
          var response = error!['response' as keyof typeof error];
          var status = response['status' as keyof typeof response];

          if (status === 306) {
            handleAlert('The account is already used, login or use different email.')
          }
        }

    }
  }

  return (
  <div className='signup-page authentication-page'>
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit()
    }} >
      <h1>Create Account</h1>
      <input ref={usernameRef} type="text" name="username" id="username" required placeholder='Username' />
      <input ref={emailRef} type="email" name="email" id="email" required placeholder='Email' />
      <input ref={passwordRef} type="password" name="password" id="password" required placeholder='Password' />
      <input type="submit" value="Submit" />
      <h3 style={{textAlign: 'center'}}>Or signup with</h3>
      <div className='OAuthContainer'>
        <GoogleLogin />
        <GithubLogin />
      </div>
    </form>
  </div>
  )
}

export default Signup;