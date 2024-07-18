import {useState, useEffect} from 'react';
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function ListNotes({notes, layout}: {notes: Array<object>, layout: string}) {

    const [opened, setOpened] = useState(false);
    const [allHorizontal, setAllHorizontal] = useState(false);

    function handleOpen() {
      (document.querySelector('.notes-element') as HTMLDivElement).classList.toggle('opened');
      setOpened(!opened);
    }

    useEffect(() => {
        window.matchMedia('(max-width: 540px)').matches ? setAllHorizontal(true): null;
    }, [])
  
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
                   <>{!allHorizontal ? (layout === 'horizontal' ? (<IoIosArrowForward />) : (<IoIosArrowUp />)) : (<IoIosArrowForward />)}</>
                ) : (
                    <>{!allHorizontal ? (layout === 'horizontal' ? (<IoIosArrowBack />) : (<IoIosArrowDown />)) : (<IoIosArrowBack />)}</>
                )}
            </button>
        </div>
    </div>
  )
}

export default ListNotes;