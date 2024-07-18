import React, { useEffect, useState } from 'react';
import { MdOutlineModeEdit } from 'react-icons/md';
import { IoTrashOutline } from 'react-icons/io5';
import { FaFileDownload } from 'react-icons/fa';
import {} from '@react-pdf/renderer';
import { api } from '../App';

import Paper from './Paper';
import DownloadList from './DownloadList';

function ReadNote({note, handleSetUpdateMode}) {
  const [download, setDownload] = useState(false);  

  async function handleDeleteNote() {
    try {
      const response = await api.delete(`delete/${note.id}/`);

      if (response.status === 301) throw {response: {status: 301}};
      
      if (response.status === 204) {
        window.location.assign('/notes/');
      }
      

    } catch (error) {
      const status = error['response']['status'];

      if (status === 500) {
        alertChan('Encountered problems deleting note, try later.')
      }else if (status === 301) {
        alertChan('Note is already deleted or does not exist.')
      }
    }
  } 

  return (
    <div className='read-note'>
      <div className='btns-container left-btn'>
        <button onClick={handleDeleteNote} className='trash-btn'>
          <IoTrashOutline />
        </button>
        <button onClick={() => {setDownload(!download)}}>
          <FaFileDownload />
        </button>
        {download && (
          <DownloadList noteName={note.name} noteContent={note.content} noteDrawnContent={note.drawn_content} />
        )}
      </div>
      <button onClick={handleSetUpdateMode} className='update-btn right-btn'>
        <MdOutlineModeEdit />
      </button>
      <div className='container'>
        <Paper noteName={note.name} noteContent={note.content} noteDrawnContent={note.drawn_content} />
      </div>
    </div>
  )
}

export default ReadNote;