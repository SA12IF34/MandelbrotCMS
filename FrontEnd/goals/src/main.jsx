import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.jsx'
import Layout from './layout/Layout';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <Layout>

        <Routes>
          <Route path='/*' element={<App />}/>
        </Routes>
     
      </Layout>
    </React.StrictMode>
  </BrowserRouter>,
)
