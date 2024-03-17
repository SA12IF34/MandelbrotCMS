import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';

import { api } from '../App';

function Layout({children}:{children: React.ReactNode}) {
  
  const [className, setClassName] = useState<string>('')

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
    <>
        <Header setClassName={setClassName} authenticated={authenticated} />
        <main>
            {children}
        </main>
        {/* {authenticated && ( */}
          <SideBar className={className} setClassName={setClassName} />
        {/* )} */}
    </>
  )
}

export default Layout;