import {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../App';

// Import needed components
import ReadNote from '../components/ReadNote';
import UpdateNote from '../components/UpdateNote';
import Message from '../components/Message';

import { alertChan } from '../utils/utils';

function Note() {
  const [updateMode, setUpdateMode] = useState(false); // false: "read" | true: "update"
  const [note, setNote] = useState(null);
  const [message, setMessage] = useState('');


  const {id} = useParams();

  async function handleGetNote() {
    try {
      const response = await api.get(`get/${id}/`);

      if (response.status === 200) {
        const data = await response.data;

        setNote(data)
      }

    } catch (error) {
      if (error['code'] && error['code'] === 'ERR_NETWORK') {
        setMessage('Server is Down.');
      
      } else {
        var status = error['response']['status'];

        if (status === 500) {
          setMessage('We encountered problems fetching data from server.')
        
        } else if (status === 404) {
          setMessage('Note does not exist.');
        }
      }
    }
  }
  

  function handleSetUpdateMode() {
    setUpdateMode(true);
  }

  function handleSetReadMode() {
    setUpdateMode(false);
  }

  

  useEffect(() => {
    handleGetNote()
  }, []);

  useEffect(() => {
    if(window && note && note.name) {
      document.querySelector('title').textContent = `Note - ${note.name}`;
    }
  }, note)

  return (
    <div className='note-page'>
      {note ? (
        <>
          {updateMode ? (
            <UpdateNote note={note} setNote={setNote} handleSetReadMode={handleSetReadMode} />
          ) :  (
            <ReadNote note={note} handleSetUpdateMode={handleSetUpdateMode} />
          )}
        </>
      ) : (
        <Message message={message} />
      )}
    </div>
  )
}

export default Note;