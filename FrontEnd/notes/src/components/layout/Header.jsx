import React from 'react';

function Header() {
  return (
    <header className='header'>
        <a href="/notes/">
            <h2>Notes</h2>
        </a>

        <a href="/home/">
            <button>Go Home</button>
        </a>
    </header>
  )
}

export default Header;