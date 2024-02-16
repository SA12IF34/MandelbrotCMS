import {useState, useRef, useEffect} from 'react';
import { api } from '../../App';

function RewardsSearchPopup({
  rewards, 
  setRewards,
  rewardIds, 
  setRewardIds
}) {

  const searchRef = useRef();

  const [rewardsData, setRewardsData] = useState([]);

  async function handleSearchRewards() {
    try {
      const response = await api.get(`entertainment/apis/materials/?search=${searchRef.current.value}`);

      if (response.status === 200) {
        const data = await response.data;

        setRewardsData(data);
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(rewards)
  }, [rewards])

  return (
    <div className='rewards-popup'>
      <div className='search-done'>
      <input ref={searchRef} onChange={handleSearchRewards} type="text" placeholder='Search Rewards' />
      <button>done</button>
      </div>
      <div className="reward-results">
        {rewardsData.map(reward => {
          return (
            <div key={reward['id']} onClick={(e) => {
              var index = rewardIds.indexOf(reward['id']);
              console.log(index)
              if (index === -1) {
                console.log('add')
                rewards.push(reward);
                setRewards(rewards);
                rewardIds.push(reward['id']);
                setRewardIds(rewardIds);
              } else {
                console.log('remove')
                rewards.splice(index, 1);
                setRewards(rewards)
                rewardIds.splice(index, 1);
                setRewardIds(rewardIds)
              }

              
              if (e.target.tagName === 'IMG' || e.target.tagName === 'H3') {
                e.target.parentElement.classList.toggle('chosen');
              } else {
                e.target.classList.toggle('chosen');
              }


            }} className={rewardIds.indexOf(reward['id']) !== -1 ? 'chosen' : ''} >
                <img src={reward['image']} />
                <h3>{reward['name'].length > 10 ? reward['name'].slice(0, 11) + '...' : reward['name']}</h3>
            </div>
          )
        })}
        
      </div>
    </div>
  )
}

export default RewardsSearchPopup;