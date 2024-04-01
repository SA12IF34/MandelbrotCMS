import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TbPointFilled } from "react-icons/tb";
// import { FiEdit } from "react-icons/fi";
import { api } from "../App";

import TasksNav from "./components/TasksNav";

function Tasks() {

  const {id} = useParams();

  const [list, setList] = useState<object>();
  const [pageMsg, setPageMsg] = useState<string>('');

  async function handleGetTasks() {
    try {
      const response = await api.get(`tasks/apis/get-tasks/${id}/`);

      if (response.status === 200) {
        const data = await response.data;

        setList(data);
      }

    } catch (error) {
      var response = error!['response' as keyof typeof error];
      var status = response['status' as keyof typeof response];
      if (status === 404) {
        setPageMsg('The page does not exist.');
      
      } else if (status === 500) {
        setPageMsg('There is a problem on the server side.');
      
      } else if (status === 403) {
        window.location.assign('/');
      } 
      
    }
  }

  async function handleDeleteContainer(containerID: number) {
    try {
      const response = await api.delete(`tasks/apis/delete-container/${containerID}/`);

      if (response.status === 204) {
        window.location.assign('/');
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetTasks();
  }, [])

  return (
    <>
      {list && (<TasksNav id={parseInt(id as string)} />)}  
      <div className="tasks-page">
        {list ? (
          <>
            <div>
              <h1>{list && list['title' as keyof typeof list]}</h1>
              <div>
                <h1>{list && list['date' as keyof typeof list]}</h1>
                {/* <FiEdit /> */}
              </div>
            </div>
            <div className="tasks-list list tasks">
              {list && (list['tasks' as keyof typeof list] as Array<object>).map(task => {
                return (
                  <div>
                    <TbPointFilled />
                    <h2>{task['content' as keyof typeof task]}</h2>
                  </div>
                )
              })}
            </div>
            <button onClick={() => {
              handleDeleteContainer(list!['id' as keyof typeof list])      
            }}>Delete</button>
          </>
        ) : (
          <h1>{pageMsg}</h1>
        )}
      </div>
    </>
  )
}

export default Tasks