import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {AiOutlineEdit} from 'react-icons/ai';
import {MdDone} from 'react-icons/md';
import { IoClose } from "react-icons/io5";

import { api } from '../App';

import ProjectNotes from '../components/ProjectNotes';

function Project() {

  const [project, setProject] = useState({});
  const [partitions, setPartitions] = useState([]);
  const [notes, setNotes] = useState([]);

  const {id} = useParams();
  const navigate = useNavigate();

  const [startDateEditMode, setStartDateEditMode] = useState(false);
  const [finishDateEditMode, setFinishDateEditMode] = useState(false);

  async function getProject(projectID) {
    try {
        const response = await api.get(`projects/${projectID}/`);

        if (response.status === 200) {
            const data = await response.data;

            setProject(data['project']);
            setPartitions(data['partitions']);
            setNotes(data['notes']);
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

  
  async function checkPartition(partitionID, checked, eleToCheck=undefined) {
    try {
      let dateNow = new Date();
      let today = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;

      const response = await api.patch(`partitions/${partitionID}/`, {done: checked, check_date:today});

      if ((response.status === 202 || response.status === 200) && eleToCheck) {
        eleToCheck.classList.toggle('checked')
      } 

      if (response.status === 200) {
        alert('congratulations! You Have finished The Project!');
        window.location.reload();
      }
      
    } catch (error) {

    }
  }

  async function handleEditDate(data) {
    try {
      const response = await api.patch(`projects/${id}/`, data);

      if (response.status === 202) {
        const data = await response.data;
        setProject(data);

        return response.status;
      }

    } catch (error) {
      return 400
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
          
        </div>
        <p>
          {project['description']}
        </p>
      </section>
      <section>
        <h2>
          Start working on : {startDateEditMode ? (
              <span>
                <input type="date"  />
                <MdDone onClick={async (e) => {
                  const dateValue = e.target.parentElement.firstElementChild.value ? e.target.parentElement.firstElementChild.value : null;
                  const status = await handleEditDate({starting_time: dateValue})
                  if (status === 202) {
                    setStartDateEditMode(false);
                  } else {
                    setStartDateEditMode(false);
                    alert('Edit Failed..');
                  }
                }} className='date-edit-icon' />
              </span>
            ) : (
              <span className={project['starting_time'] === null && 'indetermined'}>
                {project['starting_time'] ? project['starting_time'] : 'Indetermined'}
                <AiOutlineEdit onClick={() => {setStartDateEditMode(true)}} className='date-edit-icon' />
              </span>
            )}
        </h2>

        <h2>
          Finish working on : {finishDateEditMode ? (
              <span>
                <input type="date" />
                <MdDone onClick={async (e) => {
                  const dateValue = e.target.parentElement.firstElementChild.value ? e.target.parentElement.firstElementChild.value : null;
                  const status = await handleEditDate({finish_time: dateValue});
                  if (status === 202) {
                    setFinishDateEditMode(false);
                  } else {
                    setFinishDateEditMode(false);
                    alert('Edit Failed..');
                  }
                }} className='date-edit-icon' />
              </span>
            ) : (
              <span className={project['finish_time'] === null && 'indetermined'}>
                {project['finish_time'] ? project['finish_time'] : 'Indetermined'}
                <AiOutlineEdit onClick={() => {setFinishDateEditMode(true)}} className='date-edit-icon' />
              </span>
            )}
        </h2>
      </section>
      <section>
        <h2>Partitions</h2>
        <div>
          {partitions.map((partition, index) => {
            return (
              <div id={index} className='partition'>
                <div title={(partition.done ? 'un' : '')+'check partition'} 
                     onClick={(e) => {checkPartition(partition.id, !e.target.classList.contains('checked'), e.target);}}
                     className={partition.done ? 'checked' : ''}>
                  <h3>{partition['name']}</h3>
                  <br />
                  <p>
                    {partition['description']}
                  </p>
                </div>
                <div>
                  <button onClick={() => {
                    deletePartition(partition['id'], index);
                  }} title='delete partition' className='delete-partition'>
                    <IoClose />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <button onClick={() => {deleteProject(id)}}>Delete Project</button>

      <span className='creation-date'>created on {project['creation_date']}</span>
    
      {notes.length > 0 && (
        <ProjectNotes notes={notes} layout={'horizontal'} />
      )}
    </div>
  )
}

export default Project;