import {Routes, Route} from 'react-router-dom';
import './App.css'

// Pages
// import Home from './pages/Home';
// import Contact from './pages/Contact';
// import About from './pages/About';
// import Skills from './pages/Skills';
import Portfolio from './pages/Portfolio';
// import GoogleLink from './pages/GoogleLink';

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Portfolio />} />
      </Routes>
    </>
  )
}

export default App;
