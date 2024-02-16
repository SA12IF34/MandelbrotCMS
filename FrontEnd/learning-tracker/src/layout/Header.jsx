import React from 'react';
import {Link} from 'react-router-dom';
import '../App.css';

function Header() {
  return (
    <header>
        <Link to="/learning_tracker/">
            <h1>Learning Tracker</h1>
        </Link>
        <a href={'/home/'}>
          <button>Go Home</button>
        </a>
    </header>
  )
}

export default Header;