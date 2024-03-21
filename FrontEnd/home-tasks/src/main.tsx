import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {GoogleOAuthProvider} from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT} >
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </GoogleOAuthProvider>
    </React.StrictMode>
  </BrowserRouter>,
)
