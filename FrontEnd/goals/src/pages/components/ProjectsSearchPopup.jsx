import {useState, useRef, useEffect} from 'react';
import { api } from '../../App';

function ProjectsSearchPopup({
  projects, 
  setProjects,
  projectIds,
  setProjectIds
}) {

  const searchRef = useRef();

  const [projectsData, setProjectsData] = useState([]);

  async function handleSearchProjects() {
    try {
      const response = await api.get(`sessions_manager/apis/projects/?search=${searchRef.current.value}`);
      
      if (response.status === 200) {
        const data = await response.data;

        setProjectsData(data);
      }

    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    console.log(projects);
    console.log(projectIds)
  }, [projectIds]);

  return (
    <div className='projects-popup'>
      <div className='search-done'> 
        <input ref={searchRef} onChange={handleSearchProjects} type="text" placeholder='Search Projects' />
        <button>done</button>
      </div>
      <div className='project-results'>
        {projectsData.map(project => {
          return (
            <div onClick={(e) => {
              var index = projectIds.indexOf(project['id']);

              if (index === -1) {
                projects.push(project);
                setProjects(projects);
                projectIds.push(project['id']);
                setProjectIds(projectIds);
              
              } else {
                projects.splice(index, 1);
                setProjects(projects)
                projectIds.splice(index, 1);
                setProjectIds(projectIds)
              }
              
              if (e.target.tagName === 'H3') {
                e.target.parentElement.classList.toggle('chosen');
              } else {
                e.target.classList.toggle('chosen');
              }
            }} className={projectIds.indexOf(project['id']) !== -1 ? 'chosen' : ''} > 
              <h3>{project['name'].length > 20 ? project['name'].slice(0, 22) : project['name']}</h3>
            </div>
          )
        })}
        
      </div>
    </div>
  )
}

export default ProjectsSearchPopup