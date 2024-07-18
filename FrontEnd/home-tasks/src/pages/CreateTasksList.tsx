import ReactDOM from "react-dom/client";
import { useEffect, useState, useRef, RefObject } from "react";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { api } from "../App";


interface taskInterface {
  content?: string,
  project?: number,
  learningMaterial?: number,
  goal?: number
}

interface dataInterface {
  container?: {
    title?: string,
    date?: string,
    reward?: number
    reminder?: number
  },
  tasks?: Array<taskInterface>
} 

interface objectInterface {
  name?: string,
  id?: number
}

// Reminder Interface
// interface reminderInterface {
//   id?: number,
//   times?: string,
//   user?: number
// }

function CreateTasksList({handleAlert}: {handleAlert: any}) {
  
  const [data, setData] = useState<dataInterface>({});
  const [tasks, setTasks] = useState<Array<taskInterface>>([])
  const [object, setObject] = useState<objectInterface>({});
  const titleRef = useRef() as RefObject<HTMLInputElement>;
  const dateRef = useRef() as RefObject<HTMLInputElement>;

  const [content, setContent] = useState<string>('');
  const [searchVal, setSearchVal] = useState<string>('');
  const [selectVal, setSelectVal] = useState<string>('projects');

  const [taskForm, setTaskForm] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Array<object>>([]); 

  const [rewards, setRewards] = useState<Array<object>>([]);
  const rewardRef = useRef() as RefObject<HTMLInputElement>;

// Reminder Variables
  // const [reminders, setReminders] = useState<Array<reminderInterface>>([]);
  // const [reminderForm, setReminderForm] = useState<boolean>(false);
  // const [timeOne, setTimeOne] = useState<string>('');
  // const [timeTwo, setTimeTwo] = useState<string>('');
  // const [timeThree, setTimeThree] = useState<string>('')

  async function handleCreateTasksList(data:dataInterface) {
    try {      
      
      const response = await api.post('tasks/apis/new-task-list/', data);
      
      if (response.status === 201) {
        const {id} = await response.data;
        window.location.assign(`/missions/${id}/`)
      }

    } catch (error) {
      if (error!['code' as keyof typeof error] === 'ERR_NETWORK') {
        document.documentElement.scrollTo(0, 0);
        handleAlert('The server is down.')
      } else {
        var response = error!['response' as keyof typeof error];
        var status = response['status' as keyof typeof response];
        if (status === 400) {
          document.documentElement.scrollTo(0, 0);
          handleAlert('Check if you filled all the data correctly.');
        }
      }
    }
  }


  async function handleSearchObject(query: string) {
    try {
      var response;

      if (selectVal  === 'projects') {
        response = await api.get('sessions_manager/apis/projects/?search='+query);
      } else if (selectVal === 'courses') {
        response = await api.get('learning_tracker/apis/materials/?search='+query);
      } else if (selectVal === 'goals') {
        response = await api.get('goals/apis/goals/?search='+query);
      }

      if (response?.status === 200) {
        const data = await response.data;
        
        setSearchResults(data);
        
      }
    } catch (error) {
      console.error(error)
    }
  }

  function handleSetProject(object: object) {
    const id = object['id' as keyof typeof object]
    if (selectVal === 'courses') {
      setObject({name: 'learningMaterial', id: id});

    } else if (selectVal === 'projects') {
      setObject({name: 'project', id: id})

    } else if (selectVal === 'goals') {
      setObject({name: 'goal', id: id});

    }

    if (document.querySelector('.chosen-object')) {

      const chosenContainer = document.querySelector('.chosen-object') as HTMLDivElement;
      (chosenContainer.querySelector('h3') as HTMLHeadingElement).textContent = object['name' as keyof typeof object];

    } else {
      const chosenContainer: HTMLDivElement = document.createElement('div');
      const h3: HTMLHeadingElement = document.createElement('h3');

      h3.textContent = object['name' as keyof typeof object];

      chosenContainer.classList.add('chosen-object');
      chosenContainer.appendChild(h3)

      chosenContainer.onclick = () => {
        chosenContainer.remove();
      }

      (document.querySelector('.search-container') as HTMLElement).parentElement?.classList.add('object-chosen');
      (document.querySelector('.task-form') as HTMLElement)?.insertBefore(chosenContainer, (document.querySelector('.add-task-btn') as HTMLButtonElement))

    }
  }

  function handleRemoveTask(e: any, content: string) {
    const index = tasks.findIndex((obj) => {
      return obj['content'] === content;
    });

    tasks.splice(index, 1);
    setTasks(tasks);

    e.target.parentElement.remove();
  }

  function handleOpenTaskForm() { 
    setTaskForm(true);
  }
  
  function handleAddTaskItem() {
    const div: HTMLDivElement = document.createElement('div');
    const h2: HTMLHeadingElement = document.createElement('h2');
    const button: HTMLButtonElement = document.createElement('button');


    h2.textContent = content;
    button.type = 'button';
    button.classList.add('remove-task-btn', 'task-btn');
    ReactDOM.createRoot(button).render(<IoIosRemove />)

    button.onclick = (e) => {handleRemoveTask(e, content)}

    div.classList.add('task-item', 'container');
    div.appendChild(h2);
    div.appendChild(button);

    const container = document.querySelector('.tasks-items-container') as HTMLDivElement;
    container.appendChild(div);

    const taskData: taskInterface = {};

    if (object['name'] === 'learningMaterial') {
      taskData['learningMaterial'] = object['id'];
    } else if (object['name'] === 'project') {
      taskData['project'] = object['id']
    } else if (object['name'] === 'goal') {
      taskData['goal'] = object['id']
    }

    taskData['content'] = content;

    tasks.push(taskData);
    setTasks(tasks);

    setContent('');
    setSearchVal('');
    setSelectVal('projects');
    setSearchResults([]);

    setTaskForm(false);

  }

  function handleCancelTaskCreate() {
    setContent('');
    setSearchVal('');
    setSelectVal('projects');
    setSearchResults([]);

    setTaskForm(false);
  }


  async function handleGetRewards() {
    try {
      const response = await api.get('/entertainment/apis/materials/?search=');

      if (response.status === 200) {
        const data = await response.data;
        setRewards(data);
      }

    } catch (error) {
      
    }
  }

  function handleAddReward(e: any, id: number) {
    const newImg = document.createElement('img');
    const container = document.querySelector('.container-reward') as HTMLDivElement;

    newImg.src = e.target.querySelector('img').src;

    container.querySelector('img')?.remove();

    container.appendChild(newImg);


    if (data && data['container']) {
      data['container']['reward'] = id;
      console.log('1 ', data['container']['reward'])
      setData(data);
    
    } else {
      data['container'] = {};
      data['container']['reward'] = id;
      console.log('2 ' , data['container']['reward']);
      setData(data);
    } 
  }

  function handleRemoveReward(e: any) {
    const img = e.target.parentElement.querySelector('img') as HTMLElement;
    const h3 = e.target.parentElement.querySelector('h3') as HTMLElement;
    img.remove()
    h3.remove()

    const newData = data;
    if (newData && newData['container'] && newData['container']['reward']) {
        delete newData['container'].reward;
        setData(newData)
    }

  }

  async function handleFilterRewards() {
    try {
      const response = await api.get(`/entertainment/apis/materials/?search=${rewardRef.current?.value}`)
      
      if (response.status === 200) {
        const data = await response.data;

        setRewards(data);
      }
    
    } catch (error) {
      console.log(error)
    }
  }



  function handleSelectObjectChange(e: any) {
    setSelectVal(e.target.value);

    if (document.querySelector('.selected-result')) {
      document.querySelector('.selected-result')?.classList.remove('selected-result');

      document.getElementById('search-field')?.focus();
    }

  }

  useEffect(() => {
    handleGetRewards();

    document.addEventListener('keydown', (e) => {

      let searchField = document.getElementById('search-field') as HTMLInputElement;
      let selectedResult = document.querySelector('.selected-result') as HTMLSpanElement;

      if (selectedResult) {
        
        let resultsContainer = document.querySelector('.search-results') as HTMLDivElement;
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (selectedResult === resultsContainer.firstElementChild) {
            selectedResult.classList.remove('selected-result');
            searchField.focus();

            return;
          } 

          if (selectedResult.previousElementSibling) {
            selectedResult.classList.remove('selected-result');
            selectedResult.previousElementSibling.classList.add('selected-result');

            return;
          }
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (selectedResult.nextElementSibling) {
            selectedResult.classList.remove('selected-result');
            selectedResult.nextElementSibling.classList.add('selected-result');

            return;
          }
        }

        if (e.key === 'Enter') {
          
          selectedResult.click();

          return;
        }
        return;
      }

      if (searchField && document.activeElement === searchField && searchField.value.length > 0) {
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          let resultsContainer = document.querySelector('.search-results') as HTMLDivElement;

          if (resultsContainer?.childNodes.length > 0) {
            resultsContainer.firstElementChild?.classList.add('selected-result');
            searchField.blur();
            return;
          }
        } 
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          return;
        }
        return;
      }
    })

  }, [])


  function handleInitializeDataAndHandleRequest() {
    if (tasks.length === 0) {
      document.documentElement.scrollTo(0, 0);
      handleAlert('The list must have at least one task.');
      return;
    }
    
    if (!data['container']) {
      data['container'] = {}
      
    }

    data['container']!['title'] = titleRef.current?.value;
    data['container']!['date'] = dateRef.current?.value;
    data['tasks'] = tasks;

    setData(data)

    setTimeout(() => {
      handleCreateTasksList(data);
    }, 250)

  }


  return (
    <div className="new-list-page">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleInitializeDataAndHandleRequest();
      }}>
        <div>
          <input ref={titleRef} type="text" placeholder="List Name" required />
          <input ref={dateRef} type="date" required />
        </div>
        <div className="tasks-items-container">
          <div className="sub-title-flex">
            <h1>Missions</h1>
            <IoIosAdd onClick={handleOpenTaskForm} />
          </div>
          {taskForm && (
            <div className="task-form container">
              <textarea value={content} onChange={(e) => {setContent(e.target.value);}} name="" id=""></textarea>
              <div>
                <div className="search-container">
                  <div>
                    <input value={searchVal} onChange={(e) => {
                      handleSearchObject(e.target.value);
                      setSearchVal(e.target.value);
                    }} type="text" name="search-field" id="search-field" />
                    <select value={selectVal} onChange={handleSelectObjectChange} defaultValue={'projects'} name="object-type" id="object-type">
                      <option value="projects">Projects</option>
                      <option value="courses">Courses</option>
                      <option value="goals">Goals</option>
                    </select>
                  </div>
                  <div className="search-results">
                    {searchResults.map(result => {
                      return (
                        <div onClick={() => {
                          handleSetProject(result)
                        }}>
                          <span>{result['name' as keyof typeof result]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
              </div>
              <button onClick={() => {handleAddTaskItem()}} type="button" className="add-task-btn task-btn">
                <IoIosAdd />
              </button>
              <button onClick={() => {handleCancelTaskCreate()}} type="button" className="remove-form-btn task-btn">
                <IoIosRemove />
              </button>
            </div>
          )}
        </div>
        <div>
          <h1>What's your reward</h1>
          <div className='container'>
              
            <div>
              <input onChange={handleFilterRewards} type="text" placeholder="filter" ref={rewardRef} />
              <div className="container rewards-container">
                  {rewards.map(reward => {
                    return (
                      <div onClick={(e) => {handleAddReward(e, reward['id' as keyof typeof reward])}} className="reward-choice">
                        <img src={reward['image' as keyof typeof reward]} alt={reward['name' as keyof typeof reward]} />
                        <span>{reward['name' as keyof typeof reward]}</span>
                      </div>
                    )
                  })}
                  
              </div>
            </div>
            <div title="remove reward" className="container-reward">
              <IoIosRemove onClick={handleRemoveReward} />
            </div> 
          </div>
        </div>
        {/* Reminders HTML Content
        <div>
          <div className="sub-title-flex">
            <h1>Set Reminder</h1>
            {!reminderForm && (
              <IoIosAdd onClick={() => {setReminderForm(true)}} />
            )}
            {reminderForm && (
              <IoIosRemove onClick={() => {setReminderForm(false)}} />
            )}
          </div>
          <div className="reminders-container">
            {reminderForm && (
            <div className="reminder-form container">
              <input value={timeOne} onChange={(e) => {setTimeOne(e.target.value)}} type="time" name="" id="" />
              <input value={timeTwo} onChange={(e) => {setTimeTwo(e.target.value)}} type="time" name="" id="" />
              <input value={timeThree} onChange={(e) => {setTimeThree(e.target.value)}} type="time" name="" id="" />
                
              <button onClick={() => {handleAddReminder()}} type="button" >Add</button>
            </div>)}
            {reminders.map(reminder => {
              return (
                <div id={`r-${reminder['id']}`} className="reminder container">
                  <h2>{reminder['times']}</h2>
                  <div className="reminder-btns">
                    <button type="button" className="reminder-set-btn" onClick={(e) => {handleSetReminder((reminder['id'] as number), ((e.target as HTMLElement).parentElement?.parentElement as HTMLElement))}}>
                      Set
                    </button>
                    <button type="button" className="reminder-unset-btn none" onClick={(e) => {handleUnSetReminder(((e.target as HTMLElement).parentElement?.parentElement as HTMLElement))}}>
                      Unset
                    </button>
                    <button type="button" className="reminde-delete-btn" onClick={(e) => {handleDeleteReminder((reminder['id'] as number), ((e.target as HTMLElement).parentElement?.parentElement as HTMLElement))}}> 
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div> 
        </div> */}
        <input type="submit" value="Create List" />
      </form>
    </div>
  )
}

export default CreateTasksList;