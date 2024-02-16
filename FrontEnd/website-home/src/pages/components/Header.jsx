import React from 'react';
import {Link} from 'react-router-dom';
import {FaArrowLeftLong} from 'react-icons/fa6';
import '../../App.css';

function Header({title}) {
  return (
    <header className="Header">
      <Link to={'/'}>
        <FaArrowLeftLong />
      </Link>
      <h2>{title}</h2>
    </header>
  )
}

export default Header;