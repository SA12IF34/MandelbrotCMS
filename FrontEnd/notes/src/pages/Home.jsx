import {useEffect, useState} from 'react';
import { api } from '../App';

// Importing Components
import NoteElement from '../components/NoteElement';
import Message from '../components/Message';
import CreateNoteLink from '../components/CreateNoteLink';

function Home() {

  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const [noNotes, setNoNotes] = useState(false);

  async function getNotes() {
    try {
      const response = await api.get('get/');

      if (response.status === 200) {
        const data = await response.data;
        if (data.length == 0) {
          NoNotes()
        } else {
          setNotes(data);
        }
      }

    } catch (error) {
      if (error['code'] && error['code'] === 'ERR_NETWORK') {
        setMessage('Server is Down.')
        setNoNotes(true)
      } else {
        var status = error['response']['status'];

        if (status === 500) {
          setMessage('We encountered problems fetching data from server.')
          setNoNotes(true)
        } else if (status === 403) {
          setMessage('You are not Authenticated');
          setNoNotes(true)
        }
      }
    }
  }

  function NoNotes() {
    // setNoNotes(true);
    setMessage(`You didn't create any notes yet.`)
  }


  useEffect(() => {
    if (window) {
      document.querySelector('title').textContent = 'Notes Part - Home'
    }
    getNotes();
  }, [])

  return (
    <>
    <CreateNoteLink />
    <div className='home-page page'>
      {notes.length > 0 ? (
        <div className='notes'>
            {notes.map(note => {
              return (
                <NoteElement key={note.id} noteId={note.id} noteName={note.name} noteLastUpdateDate={note.last_update} />
              )
            })}
        </div>
      ): (                         
        <Message message={message} noNotes={noNotes} />
      )}
    </div>
    </>
  )
}

export default Home