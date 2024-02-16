import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <>
      <header>
        <Link to={'/goals/'}>
          <h1>Goals</h1>
        </Link>
        <a href="/home/">
          <button>Go Home</button>
        </a>
      </header>
      <nav>
        <Link to={'/goals/new/'}>
          <button>New Goal</button>
        </Link>
      </nav>  
    </>
  )
}

export default Header;