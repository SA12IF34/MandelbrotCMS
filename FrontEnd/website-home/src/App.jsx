import {Routes, Route} from 'react-router-dom';
import './App.css'

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Skills from './pages/Skills';
import Portfolio from './pages/Portfolio';


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact/' element={<Contact />} />
        <Route path='/about/' element={<About />} />
        <Route path='/skills/' element={<Skills />} />
        <Route path='/mandelbrotCMS/' element={<Portfolio />} />
      </Routes>
    </>
  )
}

export default App;
