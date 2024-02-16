import {useEffect, useState, useRef} from 'react';
import { api } from '../App';
import {IoIosAdd, IoIosRemove} from 'react-icons/io';
import '../App.css';

import CoursesSearchPopup from './components/CoursesSearchPopup';
import ProjectsSearchPopup from './components/ProjectsSearchPopup'
import RewardsSearchPopup from './components/RewardsSearchPopup';
import TaskCreatePopup from './components/TaskCreatePopup';

function NewGoal() {
  
  const nameRef = useRef();
  const descriptionRef = useRef();
  const rewardTextRef = useRef();

  const [searchCourses, setSearchCourses] = useState(false);
  const [searchProjects, setSearchProjects] = useState(false);
  const [searchRewards, setSearchRewards] = useState(false);
  const [createTask, setCreateTask] = useState(false);

  const [courses, setCourses] = useState([]);
  const [courseIds, setCourseIds] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectIds, setProjectsIds] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardIds, setRewardIds] = useState([]);
  const [tasks, setTasks] = useState([]);
  const contentRef = useRef();

  async function handleAddGoal() {
    try {
      const data = {
        goal: {
          name: nameRef.current.value,
          description: descriptionRef.current.value,
          learning_materials: courseIds,
          projects: projectIds,
          rewards: rewardIds,
          reward_text: rewardTextRef.current.value
        }, tasks: tasks
      }

      const response = await api.post('/goals/apis/goals/', data);

      if (response.status === 201) {
        const {id} = await response.data;

        window.location.assign(`/goals/${id}/`)
      }

    } catch (error) {
      console.error(error)
    }
  }

  // async function handleAddTasks() {
  //   try {
      
  //   } catch (error) {
      
  //   }
  // }

  
  function handlePopup(popupClass, setPopup) {
    const prevScroll = document.documentElement.scrollTop;
    console.log(prevScroll)
    document.documentElement.scrollTo(0, 0);


    setTimeout(() => {
      if (document.querySelector(`.${popupClass}`)){
        document.querySelector(`.${popupClass} button`).onclick = () => {
          if (document.querySelector(`.${popupClass} button`).id === 'add-task-btn') {
            console.log(contentRef.current.value);
            if (contentRef.current.value.length > 0) {
              console.log('add task');
              tasks.push({content: contentRef.current.value});
              setTasks(tasks);
            }
          }
          document.documentElement.scrollTop = prevScroll;
          setPopup(false);
        }
      }
    }, 100)
    
  }

  return (
    <div className='new-goal-page goal-page'>  
      <div className='main-info'>
        <input ref={nameRef} className='goal-name-input' type="text" placeholder='Goal Name' />
        <textarea ref={descriptionRef} className='goal-description-input' placeholder='Goal Description' rows="10"></textarea>
      </div>
      <div className="related">
        <div>
          <h2>Courses you want to finish</h2>
          <IoIosAdd onClick={() => {
            setSearchCourses(true);
            handlePopup('courses-popup', setSearchCourses);
          }} />
          <div>
            {courses.map(course => {
              return (
                <div className="course-item">
                  <div className="image">
                    <img src={course['image']} />
                  </div>
                  <h3>{course['name']}</h3>
                </div>
              )
            }) }
          </div>
        </div>
        <div>
          <h2>Projects you want to finish</h2>
          <IoIosAdd onClick={() => {
            setSearchProjects(true);
            handlePopup('projects-popup', setSearchProjects);
          }} />
          <div>
            {projects.map(project => {
              return (
                <div className="project-item">
                  <h3>{project['name'].length > 22 ? project['name'].slice(0, 23) + '...' : project['name']}</h3>
                  <span>
                    {project['description'].length > 85 ? project['description'].slice(0, 86) + '...' : project['description']}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <h2>Missions you want to accomplish</h2>
          <IoIosAdd onClick={() => {
            setCreateTask(true);
            handlePopup('task-popup', setCreateTask);
          }} />
          <div>
            {tasks.map(task => {
              return (
                <div className="mission-item">
                  <p>{task['content']}</p>
                  <IoIosRemove onClick={(e) => {
                    
                    tasks.splice(tasks.indexOf(task), 1);
                    setTasks(tasks);
                    
                    e.target.parentElement.remove();

                  }} />
                </div>
              )
            })}

          </div>
        </div>
      </div>
      <div className='rewards'>
        <input ref={rewardTextRef} className='goal-reward-text-input' type="text" placeholder='Your words for rewarding yourself' />
        <h2>What you will reward yourself</h2>
        <IoIosAdd onClick={() => {
          setSearchRewards(true);
          handlePopup('rewards-popup', setSearchRewards);
        }} />
        <div>
          {rewards.map(reward => {
            return (
              <div className="reward">
                <img src={reward['image']} />
                <h3>{reward['name']}</h3>
              </div>
            )
          })}
          {/* <div className='reward'>
            <img src="" alt="" />
            <h3></h3>
          </div> */}
        </div>
      </div>

      <button onClick={() => {
        handleAddGoal();
      }} className="goal-set-btn">
        Set The Goal
      </button>

      {searchCourses && (
        <CoursesSearchPopup 
        courses={courses} 
        setCourses={setCourses}
        courseIds={courseIds}
        setCourseIds={setCourseIds} />
      )}

      {searchProjects && (
        <ProjectsSearchPopup 
        projects={projects} 
        setProjects={setProjects}
        projectIds={projectIds}
        setProjectIds={setProjectsIds} />
      )}

      {searchRewards && (
        <RewardsSearchPopup 
        rewards={rewards} 
        setRewards={setRewards}
        rewardIds={rewardIds}
        setRewardIds={setRewardIds} />
      )}

      {createTask && (
        <TaskCreatePopup contentRef={contentRef} />
      )}
    </div>
  )
}

export default NewGoal