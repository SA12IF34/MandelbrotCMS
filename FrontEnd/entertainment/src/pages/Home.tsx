import {useEffect, useState} from 'react';
import MaterialsContainer from './components/MaterialsContainer';
import '../App.css';

import { api } from '../App';

interface materialsData {
  'anime': Array<object>,
  'game': Array<object>,
  'shows & movies': Array<object>,
  'other': Array<object>
}

function Home() {

  const [current, setCurrent] = useState<materialsData>();
  const [done, setDone] = useState<materialsData>();
  const [later, setLater] = useState<materialsData>();

  const [currentType, setCurrentType] = useState<string>('anime');
  const [doneType, setDoneType] = useState<string>('anime');
  const [laterType, setLaterType] = useState<string>('anime');

  async function handleGetData() {
    try {
      const response = await api.get('materials/');

      if (response.status === 200) {
        const data = await response.data;

        setCurrent(data['current']);
        setDone(data['done'])
        setLater(data['later'])
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetData();
  }, [])

  return (
    <div className='home-page page flex-page'>
      <section>
        <h2>Your current animes & games</h2>
        <br />
        <br />
        {current && (
          <MaterialsContainer 
          dual={true}
          setPageLink={true}
          pageLink={`/entertainment/search/?type=${currentType}&status=current`}
          setType={setCurrentType}
          data={current} />
        )}
      </section>
      <section>
        <h2>What you have done</h2>
        <br />
        <br />
        {done && (
          <MaterialsContainer 
          dual={true} 
          setPageLink={true}
          pageLink={`/entertainment/search/?type=${doneType}&status=done`}
          setType={setDoneType}
          data={done} />
        )}
      </section>
      <section>
        <h2>What you have next</h2>
        <br />
        <br />
        {later && (
          <MaterialsContainer 
          dual={true}
          setPageLink={true} 
          pageLink={`/entertainment/search/?type=${laterType}&status=later`}
          setType={setLaterType}
          data={later} />
        )}
      </section>
    </div>
  )
}

export default Home