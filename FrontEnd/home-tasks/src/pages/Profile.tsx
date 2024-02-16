import {useState, useEffect} from 'react';
import {api} from '../App';
import '../App.css';

function Profile() {

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  async function handleGetUser() {
    try {
      const response = await api.get('authentication/apis/profile/');

      if (response.status === 200) {
        const data = await response.data;
        const {username} = data;
        const {email} = data;

        setUsername(username);
        setEmail(email);
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
    try {
      const response = await api.post('authentication/apis/logout/', {});

      if (response.status === 202) {
        window.location.assign('/');
      }
    
    } catch (error) {
      console.error(error);  
    }
  }

  useEffect(() => {
    handleGetUser();
  }, [])

  return (
    <div className='profile-page'>
      <div className='user-data'> 
        <h2>Username : {username}</h2>
        <h2>Email : {email}</h2>
      </div>
      <button onClick={handleLogout} className="logout">Log out</button>
    </div>
  )
}

export default Profile;