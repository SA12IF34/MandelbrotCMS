import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { api } from '../../App';
import '../../App.css';

function Header() {

  const [authenticated, setAuthenticated] = useState<boolean>(false);

  async function handleGetUser() {
    try {
      const response = await api.get('authentication/apis/profile/');

      if (response.status === 200) {
        setAuthenticated(true);
      }

    } catch (error) {
      if (error) {
        const response = error['response' as keyof typeof error];

        if (response['status' as keyof typeof response] === 403) {
          setAuthenticated(false);
        }
      }
    }
  }

  useEffect(() => {
    handleGetUser();
  }, [])

  return (
    <header>
      <div>
        <Link to={'/home/'}>
          <h1>MandelbrotCMS</h1>
        </Link>
        {authenticated ? (
          <Link to={'/profile/'}>
            <button className="profile">Profile</button>
          </Link> 
        ): (
          <div style={{display: 'flex', columnGap: '20px'}}> 
            <Link to={'/sign-up/'}> 
              <button className='profile'>Sign Up</button>
            </Link>
            <Link to={'/log-in/'}> 
              <button className='profile'>Log In</button>
            </Link>
          </div>
        )} 
      </div>

      <nav>
        <a href={'/sessions_manager/'}>
          <span>Sessions Manager</span>
        </a>
        <a href={'/learning_tracker'}>
          <span>Learning Tracker</span>
        </a>
        <a href={'/entertainment/'}>
          <span>Entertainment</span>
        </a>
        <a href={'/goals/'}>
          <span>Goals</span>
        </a>
        <a href={'/all-missions/'}>
          <span>All Missions</span>
        </a>
        <a href={'/create-missions-list/'}>
          <span>New Missions List</span>
        </a>
      </nav>
    </header>
  )
}

export default Header;