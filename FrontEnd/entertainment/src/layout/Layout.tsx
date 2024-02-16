import React from 'react';
import '../App.css';
import Header from './components/Header';

function Layout({children}:{children: React.ReactNode}) {
  return (
    <>
    <Header />
    <main>
      {children}
    </main>
    </>
  )
}

export default Layout;