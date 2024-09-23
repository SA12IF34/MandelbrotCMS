import {useEffect} from 'react';
import axios from 'axios';
import { api } from '../App';

import MaterialsContainer from './components/MaterialsContainer';

type props = {
  animeRecommendations: Array<object> | undefined,
  setAnimeRecommendations: any
}

function Recommendations({animeRecommendations, setAnimeRecommendations}: props) {
  
  // const [anime, setAnime] = useState<Array<object>>();
  
  async function getAnimeRecommendations(data: object): Promise<Array<object>> {
    try {
      const response = await axios.post('https://api.ml.saifchan.online/recommend-anime/', {
        profile: data['profile' as keyof typeof data],
        seen_animes: data['seen_animes' as keyof typeof data]
      })

      if (response.status === 200) {
        const data = (await response.data as object);

        return data['recommendations' as keyof typeof data] as Array<object> ;
      }

      return []

    } catch(error) {
      console.log(error);
      return [];
    }
  }

  async function handleGetAnimeRecommendations() {
    try {
      const response = await api.get('recommend-anime/');

      if (response.status === 200) {
        const data = await response.data;
        let recommendations: object[] | void[] = await getAnimeRecommendations(data);
        recommendations = recommendations.map(r => {
          var newObj = {
            name: '',
            description: '',
            image: ''
          };
          newObj['name'] = r['title' as keyof typeof r];
          newObj['description'] = r['synopsis' as keyof typeof r];
          newObj['image'] = r['main_picture' as keyof typeof r]['medium'];

          return newObj;
        })
        setAnimeRecommendations(recommendations);
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