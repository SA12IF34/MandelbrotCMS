import { useState, useEffect } from 'react';
import {Routes, Route, useParams} from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './pages/Home';
import AddMaterial from './pages/AddMaterial';
import Material from './pages/Material';
import './App.css'

import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

function App() {

  const link = useParams()['*']

  useEffect(() => {
    if (!link.includes("materials")) {
      document.querySelector("main").style.cssText = "padding: 0 20px;"
    }
  }, [link])

  return (
    <>
      <Layout>
        <Routes>
          <Route path='/learning_tracker/' element={<Home />} />
          <Route path='/learning_tracker/add-material/' element={<AddMaterial />} />
          <Route path='/learning_tracker/materials/:id/' element={<Material />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
