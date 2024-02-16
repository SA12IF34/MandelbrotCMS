import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import '../App.css';
import { api } from '../App';

function Material() {
  
  const {id} = useParams();
  const navigator = useNavigate();

  const [material, setMaterial] = useState({})
  const [sections, setSections] = useState([])
  async function handleGetMaterial() {
    try {
      const response = await api.get(`materials/${id}/`);

      if (response.status === 200) {
        const data = await response.data;

        setMaterial(data['material']);
        setSections(data['sections']);
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function handleDoneSection(sectionID) {
    try {
      const response = await api.patch(`sections/${sectionID}/`, {done: true});
      
      if (response.status === 202) {
        console.log('section done');
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function handleDoneMaterial(e=false) {
    try {
      const response = await api.patch(`materials/${id}/`, {category: 'done'});

      if (response.status === 202) {
        console.log('material done');
      }

    } catch (error) {
      console.error(error);

      if (e) {
        e.target.defaultChecked = false;
      }

    }
  }

  async function handleDeleteMaterial() {
    try {
      const response = await api.delete(`materials/${id}/`);

      if (response.status === 204) {
        navigator('/learning_tracker/');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStartMaterial() {
    try {
      const response = await api.patch(`materials/${id}/`, {
        category: 'in progress'
      })

      if (response.status === 202) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    
    document.querySelector("main").style.padding = '0px';

    handleGetMaterial();
    
    var img = document.getElementById("m-img");
    setTimeout(() => {
      if (img.src && img.src.length > 0) {
        getAverageRGB(document.getElementById("m-img"))
      }
    },200)
  }, [])


  
  // async function getRowData(img) { /* FROM STACK OVERFLOW */

  //   let blob = await fetch("https://cors-anywhere.herokuapp.com/"+img.src).then(r => r.blob());
  //   let dataUrl = await new Promise(resolve => {
  //     let reader = new FileReader();
  //     reader.onload = () => resolve(reader.result);
  //     reader.readAsDataURL(blob);
  //   });
  //   img.src =  dataUrl.split("https://cors-anywhere.herokuapp.com/")[0]
  //   return img;
  // }

  
  //   async function getAverageRGB(imgEl) { /* FROM STACK OVERFLOW */
      
  //     var imgEl = await getRowData(imgEl);

      
  //     var blockSize = 5, // only visit every 5 pixels
  //         defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
  //         canvas = document.createElement('canvas'),
  //         context = canvas.getContext && canvas.getContext('2d'),
  //         data, width, height,
  //         i = -4,
  //         length,
  //         rgb = {r:0,g:0,b:0},
  //         count = 0;

  //     if (!context) {

  //         return defaultRGB;
  //     }


  //     height = canvas.height = imgEl.height || imgEl.offsetHeight || 100;
  //     width = canvas.width = imgEl.width || imgEl.offsetWidth || 100;
  //     context.drawImage(imgEl, 10, 10);

  //     try {
  //         data = context.getImageData(0, 0, width, height);
  //     } catch(e) {
  //         /* security error, img on diff domain */

  //         return defaultRGB;
  //     }

  //     length = data.data.length;

  //     while ( (i += blockSize * 4) < length ) {
  //         ++count;
  //         rgb.r += data.data[i];
  //         rgb.g += data.data[i+1];
  //         rgb.b += data.data[i+2];
  //     }

  //     // ~~ used to floor values
  //     rgb.r = ~~(rgb.r/count);
  //     rgb.g = ~~(rgb.g/count);
  //     rgb.b = ~~(rgb.b/count);

  //     document.getElementById('material-page').style.cssText = `  background-image: linear-gradient(to top, rgb(${rgb['r']}, ${rgb['g']}, ${rgb['b']}) 0%, transparent 50%); `;
  //     return rgb;

  // }

  return (
    <div id='material-page' className='material'>
      <section>
        <div className='info'>
          <span>source: {material['source']}</span>
          <span>url: <a href={material['url']} target='_blank'>{material['url']}</a></span>
        </div>
        <div>
        <span>{material['category']}</span>
        </div>
        <div className='image'>
          <img id='m-img'  src={material['image']} alt={material['name']} />
        </div>
        <div className='content'>
          <h2>{material['name']}</h2>
          <br />
          <p>
            {material['description']}
          </p>
        </div>
      </section>
      <section>
        <div>
          {material['category'] === 'future material' ? (
          <>
            <h2 onClick={handleStartMaterial} style={{textDecoration: 'underline', cursor: 'pointer'}} >Start taking material</h2>
          </>
          ): (
            <>
            {sections.length > 0 ? (
              <>
                <h2>Material Sections</h2>
                <div>
                  <ul className='material-sections'>
                    {sections.map(section => {
                      return (
                        <li className='material-section'>
                            <div>{section['name']}</div>
                            <div className='input-container'>
                            {material['category'] === 'done'? (
                              <input checked={section['done']} type="checkbox" name="done-section" id="done-section" />
                            ): (
                              <input defaultChecked={section['done']} type="checkbox" name="done-section" id="done-section" 
                              onClick={() => {
                                handleDoneSection(section['id'])
                              }} />
                            )}
                            </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </>
            ): (
            <>
              <div className='finish-material'>
                <h2>Finished Material</h2> 
                <div className='input-container'>
                {material['category'] === 'done' ? (
                  <input checked={material['category'] && material['category'] === 'done'} type="checkbox" name="finish-material" id="finish-material" />
                ): (
                  <input onClick={(e) => {
                    handleDoneMaterial(e)
                  }} defaultChecked={material['category'] && material['category'] === 'done'} type="checkbox" name="finish-material" id="finish-material" />
                )}
                </div>
              </div>
            </>
            )}
            </>
          )}
        </div>
      </section>
      <button onClick={() => {
        handleDeleteMaterial();
      }} className='material-delete-btn'>Delete</button>
    </div>
  )
}

export default Material;