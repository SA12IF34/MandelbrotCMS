import {FaGoogle} from 'react-icons/fa';
import {useGoogleLogin} from '@react-oauth/google';
import { api } from '../../App';

function GoogleLogin() {

  async function handleLogin(accessToken: string) {
    try {
        const response = await api.post('authentication/apis/rest-auth/google/', {
          access_token: accessToken
        })

        if (response.status === 200) {
          window.location.assign('/');
        }
    } catch (error) {
        alert("Problems Problems!!");
        console.log(error)
    }
  }

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
        handleLogin(codeResponse['access_token'])
    },
    onError: (error) => {
        alert('Auth Failed Failed!!');
        console.log(error);
    }
  })

  return (
    <button onClick={() => login()} className='LoginBtn GoogleLogin'>
        <FaGoogle />
    </button>
  )
}

export default GoogleLogin;