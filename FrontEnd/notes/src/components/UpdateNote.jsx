import React, { useState, useRef } from 'react';
import { api } from '../App';

import Paper from './Paper';

function UpdateNote({note, setNote, handleSetReadMode}) {
  const nameRef = useRef();
  const contentRef = useRef();

  const updateData = {};
  
  async function handleUpdateNote() {
    try {
      const nameVal = nameRef.current.value;
      const contentVal = contentRef.current.innerHTML;
      if (nameVal === '' && contentVal === '') {
        handleSetReadMode();
        return;
      }

      if (nameVal === '' || contentVal === '') {
        alert('Please enter note name and content.');
        return;
      }

      updateData['name'] = nameVal;
      updateData['content'] = JSON.stringify(contentVal)

      const response = await api.patch(`update/${note.id}/`, updateData);
      
      if (response) {
        var status = response.status;
        console.log(status)
        if (status === 202) {
          const data = await response.data;
    
          setNote(data);
          handleSetReadMode();
        }      
      }
  
    } catch (error) {
        
      const status = error['response'] ? error['response']['status']: '';
  
      if (status === 500) {
        alert('Encountered problems updating note, try later.')
      }else if (status === 400) {
        alert('Did you enter new data correctly?')
      }

      handleSetReadMode();
        
    }
  }

  
  return (
    <div className='update-note'>
      <button onClick={handleSetReadMode} className='btn-main-style left-btn'>
        Cancel
      </button>
      <button onClick={handleUpdateNote} className='btn-main-style right-btn'>
        Done
      </button>
      <div className='container'>
        <Paper write={true} noteName={note.name} noteContent={note.content} nameRef={nameRef} contentRef={contentRef} />
      </div>
    </div>
  )
}

export default UpdateNote;