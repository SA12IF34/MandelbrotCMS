import {useState, useEffect} from 'react'
import MaterialsContainer from './components/MaterialsContainer';
import {api} from '../App';

function Special() {

  const [anime, setAnime] = useState<Array<object>>();
  const [games, setGames] = useState<Array<object>>();
  const [other, setOther] = useState<Array<object>>();

  async function handleGetData() {
    try {
      const response = await api.get('materials/special/');

      if (response.status === 200) {
        const data = await response.data;

        setAnime(data['anime']);
        setGames(data['game']);
        setOther(data['other']);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetData();
  }, [])

  return (
    <div className='special-page page flex-page'>
      <section>
        <h2>Anime</h2>
        <br />
        <br />
        {anime && (<MaterialsContainer dual={false} data={anime} />)}
      </section>
      <section>
        <h2>Games</h2>
        <br />
        <br />
        {games && (<MaterialsContainer dual={false} data={games} />)}
      </section>
      <section>
        <h2>Other Stuff</h2>
        <br />
        <br />
        {other && (<MaterialsContainer dual={false} data={other} />)}
      </section>
    </div>
  )
}

export default Special