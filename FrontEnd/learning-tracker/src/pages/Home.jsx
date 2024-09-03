import React, {useEffect, useState} from 'react';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import '../App.css';
import { api } from '../App';

function Home() {

  const [inProgressMaterial, setInProgressMaterial] = useState([])
  const [doneMaterial, setDoneMaterial] = useState([])
  const [futureMaterial, setFutureMaterial] = useState([])

  async function handleGetMaterials() {
    try {
      const response = await api.get('materials/');

      if (response.status === 200) {
        const data = await response.data;
        const conditionOne = (inProgressMaterial.length === 0 && doneMaterial.length === 0 && futureMaterial.length === 0);
        const conditionTwo = (data['in_progress'].length > 0 || data['done'].length > 0 || data['future'].length > 0)
        
        if (conditionOne && conditionTwo) {
          setInProgressMaterial(data['in_progress']);
          setDoneMaterial(data['done']);
          setFutureMaterial(data['future']);
        
        }
      }

    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {

    handleGetMaterials();

    if (document.querySelector('section') ){
      document.querySelectorAll('section').forEach(section => {
        if (section.querySelector('.material-container').offsetWidth <= section.offsetWidth) {
          let btn1 = section.querySelector('button.right');
          let btn2 = section.querySelector('button.left');
          
          if (btn1 && btn2) {
            btn1.remove();
            btn2.remove();
          
          }
        }
      })
    }
    
    let rightBtns = document.querySelectorAll('button.right');
    let leftBtns = document.querySelectorAll('button.left')   

    rightBtns.forEach((rightBtn, index) => {
      let translateValue = 0;
      let translateCount = 0;
      
      rightBtn.addEventListener('click', (e) => {
        let container = e.target.parentElement.querySelector('.material-container');
        const fullWidth = document.body.offsetWidth;
        const elementWidth = container.firstElementChild.offsetWidth;
        let gap = 0;
        let limit = 1;
    
        if (fullWidth > 912) {
          gap = 20;
          limit = 4;
        } 
        if (fullWidth <= 912 && fullWidth > 744) {
          gap = 15;
          limit = 3;
        }
        if (fullWidth <= 744 && fullWidth > 500) {
          gap = 30;
          limit = 2;
        }
        
        if (translateCount < container.childNodes.length-limit){
          translateValue -= elementWidth+gap;
          container.style.cssText = `transform: translateX(${translateValue}px)`
          translateCount += 1  
        }
        
      })

      leftBtns[index].addEventListener('click', (e) => {
    
        if (translateCount === 0) {
          return;
        }
    
        let container = e.target.parentElement.querySelector('.material-container');
        const fullWidth = document.body.offsetWidth;
        const elementWidth = container.firstElementChild.offsetWidth;
        let gap = 0;
    
        if ( fullWidth > 912) {
          gap = 20;
        } 
        if (fullWidth <= 912 && fullWidth > 744) {
          gap = 15
        }
        if (fullWidth <= 744 && fullWidth > 500) {
          gap = 30
        }
        
        translateValue += elementWidth+gap;
        translateCount -= 1;
        container.style.cssText = `transform: translateX(${translateValue}px)`;
        
      })
      
    })
  
  }, [inProgressMaterial, doneMaterial, futureMaterial])


  return (
    <div className='page home'>
      <h1>Track your learning</h1>
      <div className='materials'>
        <section id='in-progress'>
          <h2>In progress Material</h2>
          <br />
          <div className='material-container'>
            {inProgressMaterial.length > 0 ? inProgressMaterial.map(material => {
              return (
                <Link to={`/learning_tracker/materials/${material['id']}/`} key={material['id']}>
                  <div>
                    <div className='img-container'>
                      <img src={material['image']} alt={material['name']} fetchpriority="high" />
                    </div>
                    <br />
                    <h3>{material['name']}</h3>
                  </div>
                </Link>
              )
            }): (
            <>
              <div className='no-materials'>
                <h2>There are no materials here yet..</h2>
              </div>
            </>
            )}
          </div>
          {inProgressMaterial.length > 0 && (
            <>
              <button className='right'>
                <IoIosArrowForward />
              </button>
              <button className='left'>
                <IoIosArrowBack />
              </button>
            </>
          )}
        </section>
        <section id='done'>
          <h2>Done Materials</h2>
          <br />
          <div className='material-container'>
            {doneMaterial.length > 0 ?doneMaterial.map(material => {
                return (
                  <Link to={`/learning_tracker/materials/${material['id']}/`} key={material['id']}>
                    <div>
                      <div className='img-container'>
                        <img src={material['image']} alt={material['name']} />
                      </div>
                      <br />
                      <h3>{material['name']}</h3>
                    </div>
                  </Link>
                )
              }): (
                <>
                  <div className='no-materials'>
                    <h2>There are no materials here yet..</h2>
                  </div>
                </>
                )}
          </div>
          {doneMaterial.length > 0 && (
            <>
              <button className='right'>
                <IoIosArrowForward />
              </button>
              <button className='left'>
                <IoIosArrowBack />
              </button>
            </>
          )}
        </section>
        <section id='future'>
          <h2>Future Materials</h2>
          <br />
          <div className='material-container'>
            {futureMaterial.length > 0 ? futureMaterial.map(material => {
                return (
                  <Link to={`/learning_tracker/materials/${material['id']}/`} key={material['id']}>
                    <div>
                      <div className='img-container'>
                        <img src={material['image']} alt={material['name']} />
                      </div>
                      <br />
                      <h3>{material['name']}</h3>
                    </div>
                  </Link>
                )
              }): (
                <>
                  <div className='no-materials'>
                    <h2>There are no materials here yet..</h2>
                  </div>
                </>
                )}
          </div>
          {futureMaterial.length > 0 && (
            <>
              <button className='right'>
                <IoIosArrowForward />
              </button>
              <button className='left'>
                <IoIosArrowBack />
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default Home;