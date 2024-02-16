import React from 'react'
import Header from './Header';
import { Link } from 'react-router-dom';
import '../App.css'

function Layout({children}) {
  return (
    <>
    <Header />
    <main>
      <Link to={'/learning_tracker/add-material/'}>
        <button>Add a Material</button>
      </Link>
      <br />
      {children}
    </main>
    </>
  )
}

export default Layout;