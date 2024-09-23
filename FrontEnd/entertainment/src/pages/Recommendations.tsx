import {useEffect} from 'react';
import { api } from '../App';

import MaterialsContainer from './components/MaterialsContainer';

type props = {
  animeRecommendations: Array<object> | undefined,
  setAnimeRecommendations: any
}

function Recommendations({animeRecommendations, setAnimeRecommendations}: props) {
  
  // const [anime, setAnime] = useState<Array<object>>();
  

  async function handleGetAnimeRecommendations() {
    try {
      const response = await api.get('recommend-anime/');

      if (response.status === 200) {
        const data = await response.data;
        console.log(data);
        setAnimeRecommendations(data['recommendations'])
      }

    } catch (error) {
      console.log(error);

      var response = error!['ressponse' as keyof typeof error];

      if (response && response['status' as keyof typeof response] === 500) {
        alert('Encountered some problems, try again later.')
      }
    }
  }

  useEffect(() => {
    if (!animeRecommendations) {
      handleGetAnimeRecommendations();
    }
  }, [])


  return (
    <div className='page flex-page'>
      <section>
        <h2>Anime Recommendations</h2>
        <br /><br />
        {(<MaterialsContainer dual={false} pageLink='' setPageLink={false} data={animeRecommendations} setLoading={true} clickable={false} />)}
      </section>
    </div>
  )
}

export default Recommendations;