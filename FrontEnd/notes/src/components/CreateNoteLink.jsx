import {Link} from 'react-router-dom';
import { TiEdit } from "react-icons/ti";


function CreateNoteLink() {
  return (
    <Link to={'/notes/create-note/'} className='create-note-link'>
        <TiEdit />
    </Link>
  )
}

export default CreateNoteLink;