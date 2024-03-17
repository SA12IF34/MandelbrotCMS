import { Link } from "react-router-dom";
import { PiList } from 'react-icons/pi';
import '../../App.css';

function Header({setClassName, authenticated}: {setClassName: any, authenticated: boolean}) {

  
  return (
    <header>
      <div>
        <Link to={'/home/'}>
          <h1>MandelbrotCMS</h1>
        </Link>
        {authenticated ? (
          <PiList onClick={() => {setClassName('SideBar');}} />
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