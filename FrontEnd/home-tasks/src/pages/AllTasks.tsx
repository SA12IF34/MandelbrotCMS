import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../App";

function AllTasks() {

  const [data, setData] = useState<Array<object>>([]);

  async function handleGetAllTasks() {
    try {
      const response = await api.get('tasks/apis/get-containers/');

      if (response.status === 200) {
        const data = await response.data;

        setData(data);
      }

    } catch (error) {
      console.error(error);
    
    }
  }

  async function handleDeleteContainer(containerID: number) {
    try {
      const response = await api.delete(`tasks/apis/delete-container/${containerID}/`);

      if (response.status === 204) {
        window.location.reload();
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetAllTasks();
  }, [])

  return (
    <div className="all-tasks-page">
      <div className="all-tasks">
        {data && data.length > 0 ? data.map(container => {
          return (
            <Link style={{textDecoration: 'none'}} to={`/missions/${container['id' as keyof typeof container]}/`}>
              <div className="tasks-container">
                <div>
                  <h2>{container['title' as keyof typeof container]}</h2>
                  <h2>{container['date' as keyof typeof container]}</h2>
                </div>
                <button onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeleteContainer(container['id' as keyof typeof container]);
                }}>Delete</button>
              </div>
            </Link>
          )
        }): (
          <h1>There are no created missions lists.</h1>
        )}
      </div>
    </div>
  )
}

export default AllTasks