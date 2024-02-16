import React from 'react';
import {Link} from 'react-router-dom'
import '../App.css';

function ProjectItem({id, name, description, start, finish}) {
  return (
    <Link to={`/sessions_manager/projects/${id}/`}>
        <div className='project'>
            <h2>{name.length > 30 ? name.slice(0, 30) + '...': name}</h2>
            <span>start: {start}</span>
            <span>finish: {finish}</span>
            <span>{description.length > 35 ? `${description.slice(0, 31)}...` : description}</span>
        </div>
    </Link>
  )
}

export default ProjectItem;