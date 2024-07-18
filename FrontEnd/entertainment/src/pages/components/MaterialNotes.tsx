import {useState} from 'react';
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function MaterialNotes({notes, layout}: {notes: Array<object>, layout: string}) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    (document.querySelector('.notes-element') as HTMLDivElement).classList.toggle('opened');
    setOpened(!opened);
  }

  return (
    <div className={`notes-element ${layout}-layout`}>
        <div className="notes">
            {notes.map(note => {
                return (
                    <a target='_blank' href={`/notes/notes/${note['id' as keyof typeof note]}`}>
                        <div className='note'>
                            <h3>{note['name' as keyof typeof note]}</h3>
                            <p>
                                {note['content' as keyof typeof note]}
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

export default MaterialNotes;