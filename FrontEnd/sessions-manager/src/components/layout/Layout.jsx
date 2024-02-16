import React from 'react';

import Header from './Header';
import './Layout.css'

function Layout({children}) {
  return (
    <>  
        <Header />
        <main className='page'>
        {children}
        </main>
    </>
  )
}

export default Layout