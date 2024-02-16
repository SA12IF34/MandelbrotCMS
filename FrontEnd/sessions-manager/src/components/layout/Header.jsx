import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function Header() {
  return (
    <header>
      <div>
        <Link style={{color: 'black', textDecoration: 'none'}} to={'/sessions_manager/'}>
        <h1>Sessions Manager</h1>
        </Link>
        <a href="/home/">
          <button>Go Home</button>
        </a>
      </div>
      <div>
        <nav>
          <Link to="/sessions_manager/completed/">
            <span>completed</span>
          </Link>
          <Link to="/sessions_manager/in-progress/">
            <span>in progress</span>
          </Link> 
        </nav>
        <Link to="/sessions_manager/new-project/">
          <button>Add</button>
        </Link>
      </div>
    </header>
  )
}

export default Header