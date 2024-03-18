import {Routes, Route} from 'react-router-dom';
import './App.css'

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Skills from './pages/Skills';
import Portfolio from './pages/Portfolio';


function App() {

  function setBeforePortfolio() {
    window.sessionStorage.setItem('beforePortfolio', 'true');
  }

  function checkBeforePortfolio() {
    const beforePortfolio = window.sessionStorage.getItem('beforePortfolio');

    return beforePortfolio;
  }
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home 
                                      setBeforePortfolio={setBeforePortfolio} 
                                      checkBeforePortfolio={checkBeforePortfolio}
                                 />} />
        <Route path='/contact/' element={<Contact
                                            setBeforePortfolio={setBeforePortfolio} 
                                            checkBeforePortfolio={checkBeforePortfolio}
                                         />} />
        <Route path='/about/' element={<About 
                                            setBeforePortfolio={setBeforePortfolio} 
                                            checkBeforePortfolio={checkBeforePortfolio} 
                                      />} />
        <Route path='/skills/' element={<Skills 
                                            setBeforePortfolio={setBeforePortfolio} 
                                            checkBeforePortfolio={checkBeforePortfolio} 
                                        />} />
        <Route path='/mandelbrotCMS/' element={<Portfolio checkBeforePortfolio={checkBeforePortfolio} />} />
      </Routes>
    </>
  )
}

export default App;
