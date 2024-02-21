import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { api } from "../App";

function Edit() {

  const {id} = useParams();

  async function handleGetMissions() {
    try {
        const response = await api.get(`tasks/apis/get-tasks/${id}/`);

        if (response.status === 200) {
            const data = await response.data;

            console.log(data);
        }

    } catch (error) {
        window.location.assign(`/missions/${id}/`);
    }
  }

  useEffect(() => {
    handleGetMissions();
  }, [])

  return (
    <div>Edit</div>
  )
}

export default Edit;