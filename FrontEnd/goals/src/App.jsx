import {Routes, Route} from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import Goal from './pages/Goal';
import NewGoal from './pages/NewGoal';


import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

function App() {
  function handleAlert(message) {
    let container = document.createElement('div');
    let h3 = document.createElement('h3');
    let btn = document.createElement('button');

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
      {/* <Layout> */}
        <Routes>
          <Route path='/goals/' element={<Home />} />
          <Route path='/goals/:id/' element={<Goal handleAlert={handleAlert} />} />
          <Route path='/goals/new/' element={<NewGoal />} />
        </Routes>     
      {/* </Layout>  */}
    </>
  )
}

export default App;
