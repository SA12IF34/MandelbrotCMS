import ReactDOM from 'react-dom'
import {useEffect, useState} from 'react';
import { TbPointFilled } from "react-icons/tb";
import {FaRegCheckSquare, FaCheckSquare} from 'react-icons/fa';
import '../App.css';
import { api } from '../App';

import ListNotes from './components/ListNotes';

function Home() {

  const [data, setData] = useState<object | undefined>(undefined);
  const [undefindDataMsg, setUndefindDataMsg] = useState<string>('');
  const [missionsProjects, setProjects] = useState<Array<object>>([])
  const projects: Array<object> = [];
  const [missionsLearningMaterials, setLearningMaterials] = useState<Array<object>>([]);
  const learningMaterials: Array<object> = [];
  const [reward, setReward] = useState<object | null>(null);
  const [goalProgress, setGoalProgress] = useState<number>(0);
  const [goalName, setGoalName] = useState<string>('');
  const [notes, setNotes] = useState<Array<object>>([]);

  async function handleGetTodayTasks() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    
    const date = `${year}-${month}-${day}`;

    try {
      const response = await api.get(`tasks/apis/today-tasks/${date}/`);

      if (response.status === 200) {
        const data = await response.data;
        const listData = data['list' as keyof typeof data]
        const tasks = listData['tasks' as keyof typeof listData];
        const listNotes = data['notes' as keyof typeof data]

        for (let i=0; i < tasks.length; i++) {
          if (tasks[i]['project']) {
            handleGetProject(tasks[i]['project'])
          }
          if (tasks[i]['learningMaterial']) {
            handleGetLearningMaterial(tasks[i]['learningMaterial']);
            console.log(learningMaterials)
          }
          if (tasks[i]['reward']) {
            handleGetReward(tasks[i]['reward']);
          }
          if (tasks[i]['goal']) {
            handleGetGoalProgress(tasks[i]['goal']);
          }
        }

        if (listData['reward']) {
          handleGetReward(listData['reward']);
        }

        setData(listData);
        setNotes(listNotes);
      
      } else if (response.status === 404) {
        setUndefindDataMsg(`You didn't create a list for today.`)
      }

    } catch (error) {
      var response = error!['response' as keyof typeof error]
      var status = response['status' as keyof typeof response]
      
      if (status === 500) {
        setUndefindDataMsg('There is a problem on the server side.')
      
      } else if (status === 403) {
        setUndefindDataMsg('You must be authenticated to use the system.');
      
      } else if (status === 404) {
        setUndefindDataMsg(`You didn't create a list for today.`)
      
      }
    }

  }

  async function handleGetProject(projectID: number | string) {
    try {
      const response = await api.get(`sessions_manager/apis/projects/${projectID}/`, {
        withCredentials: true
      });

      if (response.status === 200) {
        const data = await response.data;

        projects.push(data);
        setProjects(projects)
      }

    } catch (error) {
      console.error(error)
    }
  }

  async function handleGetLearningMaterial(materialID: number | string) {
    try {
      const response = await api.get(`learning_tracker/apis/materials/${materialID}/`, {
        withCredentials: true
      });

      if (response.status === 200) {
        const data = await response.data;
        
        learningMaterials.push(data);
        setLearningMaterials(learningMaterials);
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetReward(rewardID: number | string) {
    try {
      const response = await api.get(`entertainment/apis/materials/${rewardID}/`, {
        withCredentials: true
      });

      if (response.status === 200) {
        const data = await response.data['material'];
        setReward(data);
      }
    
    } catch (error) {
      console.error(error);  
    }
  }

  async function handleGetGoalProgress(goalID: number | string) {
   try {
    const response = await api.get(`/goals/apis/goals/progress/${goalID}/`);

    if (response.status === 200) {
      const {progress} = await response.data;
      const {goal} = await response.data;

      setGoalProgress(progress)
      setGoalName(goal);
    }

  } catch (error) {
    console.error(error);
   } 
  }

  async function handleDoneTask(button: HTMLButtonElement, taskID: number, isDone: boolean) {
    try {
      const response = await api.patch(`/tasks/apis/update-task/${taskID}/`, {done: isDone ? false : true});

      if (response.status === 202) {
        let parent = button.parentElement;
        let btn = document.createElement('button') as HTMLButtonElement;
        button.remove();
        if (isDone) {
          ReactDOM.render(<FaRegCheckSquare />, btn);
        } else {
          ReactDOM.render(<FaCheckSquare />, btn)
        }
        btn.onclick = () => {
          handleDoneTask(btn, taskID, isDone ? false:true);
        }
        parent?.appendChild(btn);
      } else if (response.status === 200) {
        window.location.reload();
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetTodayTasks();
  }, [])  

  return (
    <div className='home-page'>
      {data ? (!data['done' as keyof typeof data] ? (
      <>
        <div className='today-tasks'>
          <h1>Today's Missions ({data && data['title' as keyof typeof data]})</h1>
          <div className='tasks-list list'>
            {data && (data['tasks' as keyof typeof data] as Array<object>).map(task => {
              return (
                <div>
                  <TbPointFilled />
                  <div>
                    <h2>{task['content' as keyof typeof task]}</h2>
                    <button onClick={(e) => {handleDoneTask((e.target as HTMLButtonElement), task['id' as keyof typeof task], task['done' as keyof typeof task])}}>
                      {task['done' as keyof typeof task] ?
                      (<FaCheckSquare />) :
                      (<FaRegCheckSquare />)
                      }
                    </button>
                  </div>
                </div>
              )
            }) }
          </div>
        </div>
        
        {missionsProjects.length > 0 && (
        <div className="today-projects">
          <h1>Today's Project(s)</h1>
          <div className='projects-list list container'>
            {missionsProjects.map(item => {

              var project = item['project' as keyof typeof item]
              return (
                <a href={`/sessions_manager/projects/${project['id' as keyof typeof project]}/`}>
                  <div>
                    <h2>{project['name' as keyof typeof project]}</h2>
                  </div>
                </a>
              )
              })}
          </div>  
        </div>
        )}
            
        {missionsLearningMaterials.length > 0 && (
          <div className="today-learning_materials">
            <h1>Today's Course(s)</h1>
            <div className="courses-list list container">
              {missionsLearningMaterials.map(item => {
                var material = item['material' as keyof typeof item];
                return (
                  <a href={`/learning_tracker/materials/${material['id' as keyof typeof material]}/`}>
                    <div>
                      <h2>{material['name' as keyof typeof material]}</h2>
                    </div>
                  </a>
                )
                
              })}
            </div>
          </div>
        ) }
          
        
        {reward && (
          <div className="today-reward">
            <h1>Your Reward</h1>
            <div className="reward">
              <a href={`/entertainment/materials/${reward['id' as keyof typeof reward]}`}>
                <div className='image'>
                  <img src={reward['image' as keyof typeof reward]} alt={reward['name' as keyof typeof reward]} />
                </div>
                <br />
                <h2>
                  {reward['name' as keyof typeof reward]}
                </h2>
              </a>
            </div>
          </div>
        )}
          
        {goalName && goalName.length > 0 &&
          (
            <div className="goal">
              <h1>{goalName}</h1>
              <div className='goal-progress'>
                <div className="container-bar">
                  <span style={{backgroundColor: goalProgress === 100 ? '#c03939': '#2c6df7', width: `${goalProgress}%`}} className='progress-bar'></span>
                </div>
                <span data-progress={`${goalProgress}%`} style={{left: `${goalProgress}%`}} className='progress-point'></span>
              </div>
          </div>
          )
        }

        {notes.length > 0 && (
          <ListNotes notes={notes} layout='vertical' />
        )}
      </>
      ) : (
        <div className='reward'>
          <h1>You have done today's list</h1>
            {reward && (
              <a href={`/entertainment/materials/${reward['id' as keyof typeof reward]}/`}>
                <div className='container'>
                  <div className='image'>
                    <img src={reward['image' as keyof typeof reward]} alt={reward['name' as keyof typeof reward]} />
                  </div>
                </div>
              </a>
            )}
        </div>
      )): (
        <div>
          <h1>{undefindDataMsg && undefindDataMsg}</h1>
        </div>
      )}
    </div>
  )
}

export default Home