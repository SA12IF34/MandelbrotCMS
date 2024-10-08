import React, {useState, useEffect} from 'react'
import '../App.css'

import { api } from '../App';

import ProjectItem from '../components/ProjectItem';

function InProgress() {

  const [projects, setProjects] = useState([])

  async function getInProgressProjects() {
    try {
      const response = await api.get('projects/filter-category/?category=in progress');
      
      if (response.status === 200) {
        const data = await response.data;
        
        setProjects(data);
      }

    } catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {
    getInProgressProjects();
  }, [])


  return (
    <div className='page'>
      {projects && projects.length > 0 ? projects.map(project => {
        return (
          <ProjectItem  id={project['id']}
                        name={project['name']}
                        description={project['description']}
                        start={project['starting_time']}
                        finish={project['finish_time']}  />
        )
      }) : (
        <>
          <h1 style={{margin: '20px'}}>There are no in progress projects.</h1>
        </>
      )}
    </div>
  )
}

export default InProgress