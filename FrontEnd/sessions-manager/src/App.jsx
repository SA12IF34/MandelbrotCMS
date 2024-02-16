import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios';

import Layout from './components/layout/Layout'

import Home from './pages/Home'
import './App.css'
import Project from './pages/Project';
import AddProject from './pages/AddProject';
import Completed from './pages/Completed';
import InProgress from './pages/InProgress';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <Layout>
        <Routes>
          <Route path='/sessions_manager/' element={<Home />} />
          <Route path='/sessions_manager/completed/' element={<Completed />} />
          <Route path='/sessions_manager/in-progress/' element={<InProgress />} />
          <Route path='/sessions_manager/projects/:id/' element={<Project api={api} />} />
          <Route path='/sessions_manager/new-project/' element={<AddProject api={api} />} />
        </Routes> 
      </Layout>
    </>
  )
}

export default App;
