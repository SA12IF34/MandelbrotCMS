import { useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';

// Import Layout
import Layout from './layout/Layout';

// Import Pages
import Home from './pages/Home';
import Material from './pages/Material';
import AddMaterial from './pages/AddMaterial';
import Special from './pages/Special';
import MaterialsSearch from './pages/MaterialsSearch';
import Recommendations from './pages/Recommendations';

import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

function App() {

  const [animeRecommendations, setAnimeRecommendations] = useState<Array<object>>();

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
        <Route path='/entertainment/' element={<Home />} />
        <Route path='/entertainment/materials/:id/' element={<Material handleAlert={handleAlert} />} />
        <Route path='/entertainment/materials/' element={<Material />} />
        <Route path='/entertainment/add-material/' element={<AddMaterial handleAlert={handleAlert} />} />
        <Route path='/entertainment/special/' element={<Special />} />
        <Route path='/entertainment/search/' element={<MaterialsSearch />} />
        <Route path='/entertainment/recommendations/' element={<Recommendations 
          animeRecommendations={animeRecommendations}
          setAnimeRecommendations={setAnimeRecommendations}
        />} />
      </Routes>
    </Layout>
    </>
  )
}

export default App;
