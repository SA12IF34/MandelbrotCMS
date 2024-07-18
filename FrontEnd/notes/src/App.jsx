import {Routes, Route} from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Importing Pages
import Home from './pages/Home';
import Note from './pages/Note';
import CreateNote from './pages/CreateNote';
import NotExist from './pages/NotExist';
import PdfPage from './components/PdfPage';

// Importing Layout
import Layout from './components/layout/Layout';


// Initializing API Object
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


export const api = axios.create({
  baseURL: import.meta.env.VITE_NOTES_API_URL,
  withCredentials: true
})

function App() {

  return (
    <>
      <Layout>
        <Routes>
          <Route path='/notes' element={<Home />} />
          <Route path='/notes/create-note' element={<CreateNote />} />
          <Route path='/notes/notes/:id' element={<Note />} />
          <Route path='/notes/*' element={<NotExist />} />
          <Route path='/notes/pdf' element={<PdfPage noteName={"Note Name"} noteContent={['line one', 'line two', 'line three']} />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
