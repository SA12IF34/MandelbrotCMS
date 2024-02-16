import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom'

import { api } from '../App';

function Project() {

  const [project, setProject] = useState({});
  const [partitions, setPartitions] = useState([]);

  const {id} = useParams();
  const navigate = useNavigate();

  async function getProject(projectID) {
    try {
        const response = await api.get(`projects/${projectID}/`);

        if (response.status === 200) {
            const data = await response.data;

            setProject(data['project']);
            setPartitions(data['partitions'])
        }
    } catch (error) {
        
    }
  }

  async function deleteProject(projectID) {
    try {
        const response = await api.delete(`projects/${projectID}/`);

        if (response.status === 204) {
          navigate('/sessions_manager/')
        }
    } catch (error) {
        
    }
  }

  async function deletePartition(partitionID, index) {
    document.getElementById(`${index}`).remove();
    try {
      await api.delete(`partitions/${partitionID}/`);
    } catch (error) {
      console.error(error);
    }
  }
  
  async function checkPartition(partitionID, checked) {
    try {
      const response = await api.patch(`partitions/${partitionID}/`, {done: checked});

      if (response.status === 202) {

      } else if (response.status === 200) {
        alert('congratulations! You Have finished The Project!')
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getProject(id);
  }, [])

  return (
    <div className='project-page'>
      <section>
        <div>
          <h2>{project['name']}</h2> 
          <span>created on {project['creation_date']}</span>
        </div>
        <p>
          {project['description']}
        </p>
      </section>
      <section>
        <h2>
          Start working on : {project['starting_time']}
        </h2>
        <h2>
          Finish working on : {project['finish_time']}
        </h2>
      </section>
      <section>
        <h2>Partitions</h2>
        <div>
          {partitions.map((partition, index) => {
            return (
              <div id={index} className='partition'>
                <div>
                  <h3>{partition['name']}</h3>
                  <br />
                  <p>
                    {partition['description']}
                  </p>
                </div>
                <div>
                  <input onChange={(e) => {
                    checkPartition(partition['id'], e.target.checked)
                  }} title='check partition' className='check-partition' type="checkbox" name="done" id="done" defaultChecked={partition['done'] ? true : false} />
                  <button onClick={() => {
                    deletePartition(partition['id'], index);
                  }} title='delete partition' className='delete-partition'>
                    x
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <br />
      <button onClick={() => {deleteProject(id)}}>Delete Project</button>
    </div>
  )
}

export default Project;