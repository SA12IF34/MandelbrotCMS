import {useEffect, useState} from 'react';
import { api } from '../App';
import { Link } from 'react-router-dom';

function Home() {

  const [goals, setGoals] = useState();

  async function handleGetGoals() {
    try {
      const response = await api.get('goals/apis/goals/');

      if (response.status === 200) {
        const data = await response.data;

        setGoals(data);
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetGoals();
  }, [])

  return (
    <div className='home-page page'>
      <div className='all-goals'>
        {goals && goals.map(goal => {
          return (
            <Link to={`/goals/${goal['id']}/`}>
              <div className='goal'>
                <h2>{goal['name']}</h2>
                <span>
                  {goal['description'].length > 130 ? goal['description'].slice(0, 131): goal['description']}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home