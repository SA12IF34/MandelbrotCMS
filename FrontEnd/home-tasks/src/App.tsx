import {Routes, Route} from 'react-router-dom';
import './App.css';

import Layout from './layout/Layout';
import Home from './pages/Home';
import AllTasks from './pages/AllTasks';
import Tasks from './pages/Tasks';
import CreateTasksList from './pages/CreateTasksList';

import axios from 'axios';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

function App() {

  function handleAlert(message: string) {
    let container = document.createElement('div') as HTMLDivElement;
    let h3 = document.createElement('h3') as HTMLHeadingElement;
    let btn = document.createElement('button') as HTMLButtonElement;

    h3.textContent = message;
    btn.textContent = 'Ok';

    container.append(h3, btn);

    document.querySelector('#root')?.appendChild(container);

    container.classList.add('container', 'alert-container');

    btn.onclick = () => {
      container.classList.add('alert-back');
      setTimeout(() => {
        container.remove();
      }, 800)
      
    }

  }

  return (
    <>
      <Layout>
        <Routes>
          <Route path='/home/' element={<Home />} />
          <Route path='/all-tasks/' element={<AllTasks />} />
          <Route path='/tasks/:id/' element={<Tasks />} />
          <Route path='/create-tasks-list/' element={<CreateTasksList handleAlert={handleAlert} />} />
          <Route path='/sign-up/' element={<Signup handleAlert={handleAlert} />} />
          <Route path='/log-in/' element={<Login handleAlert={handleAlert} />} />
          <Route path='/profile/' element={<Profile />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
