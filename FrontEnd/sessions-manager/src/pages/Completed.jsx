import React, {useState, useEffect} from 'react'
import '../App.css'

import { api } from '../App';

import ProjectItem from '../components/ProjectItem';

function Completed() {

  const [projects, setProjects] = useState([]);

  async function getCompletedProjects() {
      try {
        const response = await api.get('projects/completed/');
  
        if (response.status === 200) {
          const data = await response.data;

          setProjects(data);
        }
      } catch (error) {
        console.error(error);
      }
  }

  useEffect(() => {
    getCompletedProjects();
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
      }): (
        <>
          <h1 style={{margin: '20px'}}>There are no completed projects yet.</h1>
        </>
      )}
    </div>
  )
}

export default Completed;