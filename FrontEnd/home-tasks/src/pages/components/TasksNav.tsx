import {useState, useEffect} from 'react';
import {FaArrowRightLong, FaArrowLeftLong} from 'react-icons/fa6';
import { api } from '../../App';

function TasksNav({id}: {id: number}) {

  const [nextList, setNextList] = useState<number | null>(null);
  const [prevList, setPrevList] = useState<number | null>(null);


  async function nextExists() {
    try {
        const response = await api.get(`tasks/apis/get-tasks/${id}/next/`);

        if (response.status === 200) {
            setNextList(await response.data['id'])
        }
    } catch (error) {
        var response = error!['response' as keyof typeof error];
        var status = response['status' as keyof typeof response];
        if (status === 404) {
            setNextList(null);
        }
    }
  }

  async function prevExists() {
    try {
        const response = await api.get(`tasks/apis/get-tasks/${id}/prev/`);

        if (response.status === 200) {
            setPrevList(await response.data['id'])
        }
    } catch (error) {
      var response = error!['response' as keyof typeof error];
      var status = response['status' as keyof typeof response];
      if (status === 404) {
        setPrevList(null);
      }
    }
  }

  useEffect(() => {
    nextExists();
    prevExists();
  })

  return (
    <div className='missions-nav'>
        {prevList !== null && (
            <button onClick={() => {location.assign(`/missions/${prevList}/`)}}><FaArrowLeftLong /></button>
        )}
        {nextList !== null && (
            <button onClick={() => {location.assign(`/missions/${nextList}/`)}}><FaArrowRightLong /></button>
        )}
    </div>
  )
}

export default TasksNav;