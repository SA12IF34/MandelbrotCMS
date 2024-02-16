import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { api } from '../App';

import Popup from './components/Popup';

function Goal({handleAlert}) {

  const {id} = useParams();

  const [handleDelete, setHandleDelete] = useState(false);
  const [goalData, setGoalData] = useState({});
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [missions, setMissions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardsText, setRewardsText] = useState('');
  const [progress, setProgress] = useState('0');

  async function handleGetGoal() {
    try {
      const response = await api.get(`/goals/apis/goals/${id}/`);

      if (response.status === 200) {
        const data = await response.data;

        setGoalData({
          name: data['name'],
          description: data['description']
        })

        setCourses(data['learning_materials']);
        setProjects(data['projects']);
        setMissions(data['tasks']);
        setRewards(data['rewards']);
        setRewardsText(data['reward_text']);
      }

    } catch (error) {
      
    }
  }

  async function handleGetGoalProgress() {
    try {
      const response = await api.get(`/goals/apis/goals/progress/${id}/`);

      if (response.status === 200) {
        const {progress} = await response.data;

        setProgress(progress);
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteGoal() {
    try {
      const response = await api.delete(`/goals/apis/goals/${id}/`);

      if (response.status === 204) {
        window.location.assign('/goals/');
      }
    } catch (error) {
      if (error['response']['status'] === 500) {
        handleAlert('There is a problem on server side.')
      }
    }
  }

  // async function handleUpdateGoal() {
  //   try {
  //     const response = await api.patch(`/goals/${id}/`, data);

  //     if (response.status === 202) {
  //       window.location.reload();
  //     }

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async function handleAccomplishMission(missionID, value, target) {
    try {
      const response = await api.patch(`/tasks/apis/update-task/${missionID}/`, {done: target.checked});

      if (response.status === 202) {
        target.defaultChecked = target.checked;
      }
    } catch (error) {
      if (error['response']['status'] === 500) {
        handleAlert('There is a problem on server side.')
      }
    }
  }

  function handleRequestDelete() {
    setHandleDelete(true);
  }

  useEffect(() => {
    handleGetGoal();
    handleGetGoalProgress();
  }, []) 

  return (
    <div className='goal-page'>
      <div className='main-info'>
        <h1>{goalData['name']}</h1>
        <p>
          {goalData['description']}
        </p>
      </div>
      <div className='related'>
        <div>
          <h2>Courses you have to finish</h2>
          <div>
            {courses && courses.map(course => {
              return (
                <a style={{color:'black', textDecoration: 'none'}} href={`/learning_tracker/materials/${course['id']}/`}>
                  <div className="course-item">
                    <div className="image">
                      <img src={course['image']} alt={course['name']} />
                    </div>
                    <h3>{course['name'].length > 22 ? course['name'].slice(0, 23) + '...' : course['name']}</h3>
                  </div>
                </a>
              )
            })}
          </div>    
        </div>
        <div>
          <h2>Projects you have to finish</h2>
          <div>
            {projects && projects.map(project => {
              return (
                <a style={{color: 'black', textDecoration: 'none'}} href={`/sessions_manager/projects/${project['id']}/`}>
                  <div className="project-item">
                    <h3>{project['name'].length > 22 ? project['name'].slice(0, 23) + '...' : project['name']}</h3>
                    <span>{project['description'].length > 85 ? project['description'].slice(0, 86) + '...' : project['description']}</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
        <div>
          <h2>Missions you have to accomplish</h2>
          <div>
            {missions && missions.map(mission => {
              return (
                <div className="mission-item">
                  <p>
                    {mission['content']}
                  </p>
                  <div>
                    <input onClick={(e) => {
                      // e.preventDefault();
                      handleAccomplishMission(mission['id'], mission['done'], e.target)
                    }} defaultChecked={mission['done']? true : false} type="checkbox" name="" id="" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className='progress'>
        <div className="container-bar">
          <span style={{backgroundColor: progress === 100 ? '#c03939': '#2c6df7', width: `${progress}%`}} className='progress-bar'></span>
          <span data-progress={`${progress}%`} style={{left: `${progress}%`}} className='progress-point'></span>
        </div>
      </div>
      <div className='rewards'>
        <h1>{rewardsText}</h1>
        <div>
          {rewards && rewards.map(reward => {
            return (
              <a style={{color: 'black', textDecoration: 'none'}} href={`/entertainment/materials/${reward['id']}/`}>
                <div className="reward">
                  <img src={reward['image']} alt={reward['name']} />
                  <h3>{reward['name']}</h3>
                </div>
              </a>
            )
          })}
        </div>
      </div>
      <button onClick={handleRequestDelete} className='goal-delete-btn'>
        Delete The Goal
      </button>

      {handleDelete && (
        <Popup handleDeleteGoal={handleDeleteGoal} setHandleDelete={setHandleDelete} />
      )}
    </div>
  )
}

export default Goal;