import {useState} from 'react';
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";



function ProjectNotes({notes, layout}) {
  const [opened, setOpened] = useState(false);


  function handleOpen() {
    document.querySelector('.notes-element').classList.toggle('opened');
    setOpened(!opened);
  }

  return (
    <div className={`notes-element ${layout}-layout`}>
        <div className="notes">
            {notes.map(note => {
                return (
                    <a target='_blank' href={`/notes/notes/${note.id}/`}>
                        <div className='note'>
                            <h3>{note.name}</h3>
                            <p>
                                {note.content}
                            </p>
                        </div>
                    </a>
                )
            })}
        </div>
        <div title='Notes' className='notes-element-btn'>
            <button onClick={handleOpen}> 
                {opened ? (
                   <>{layout === 'horizontal' ? (<IoIosArrowForward />) : (<IoIosArrowUp />)}</>
                ) : (
                    <>{layout === 'horizontal' ? (<IoIosArrowBack />) : (<IoIosArrowDown />)}</>
                )}
            </button>
        </div>
    </div>
  )
}

export default ProjectNotes;