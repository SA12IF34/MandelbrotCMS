import {useRef, RefObject} from 'react';
import { api } from '../App';
import '../App.css';

import GoogleLogin from './components/GoogleLogin';
import GithubLogin from './components/GithubLogin';

function Login({handleAlert}: {handleAlert: any}) {

  const usernameRef = useRef() as RefObject<HTMLInputElement>;
  const emailRef = useRef() as RefObject<HTMLInputElement>;
  const passwordRef = useRef() as RefObject<HTMLInputElement>;


  async function handleSubmit() {
    try {
      const response = await api.post('authentication/apis/authenticate/', {
        username:usernameRef.current?.value,
        email:emailRef.current?.value,
        password: passwordRef.current?.value
      })

      if (response.status === 202) {
        window.location.assign('/');
      }

    } catch (error) {
      
      if (error!['code' as keyof typeof error] === 'ERR_NETWORK') {
        handleAlert('The server is down.')
      
      } else {
        var response = error!['response' as keyof typeof error];
        var status = response['status' as keyof typeof response]; 
        if (status === 404) {
          handleAlert('User does not exist or provided info is wrong.');
        
        }
      }

      
    }
  }


  return (
    <div className='authentication-page'>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}  >
        <h1>Log In</h1>
        <input ref={usernameRef} type="text" name="username" id="username" placeholder='Username' required />
        <input ref={emailRef} type="email" name="email" id="email" placeholder='Email' required />
        <input ref={passwordRef} type="password" name="password" id="password" placeholder='Password' required />
        <input type="submit" value="Submit" />
        <h3 style={{textAlign: 'center'}}>Or login with</h3>
        <div className='OAuthContainer'>
          <GoogleLogin />
          <GithubLogin />
        </div>
      </form>
    </div>
  )
}

export default Login