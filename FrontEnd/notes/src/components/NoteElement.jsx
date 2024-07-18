
import {Link} from 'react-router-dom';

function NoteElement({noteId, noteName, noteLastUpdateDate}) {
  return (
    <Link to={`/notes/notes/${noteId}/`}>
        <div className='note'>
            <h2>{noteName}</h2>
            <h4>{noteLastUpdateDate}</h4>
        </div>
    </Link>
  )
}

export default NoteElement;