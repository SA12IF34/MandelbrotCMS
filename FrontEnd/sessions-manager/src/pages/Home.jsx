import React, {useState, useEffect} from 'react';

import ProjectItem from '../components/ProjectItem';
import { api } from '../App';

import '../App.css';

function Home() {

  const [projects, setProjects] = useState([])

  async function getProjects() {
    try {
      const response = await api.get('projects/');
      
      if (response.status === 200) {
        const data = await response.data;
        console.log(data)
        setProjects(data);
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getProjects();
    
  }, [])

  return (
    <div className='page home'>
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
          <h1 style={{margin: '20px'}}>there are no created projects.</h1>
        </>
      )}
    </div>
  )
}

export default Home