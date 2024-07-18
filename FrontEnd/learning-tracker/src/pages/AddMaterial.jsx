import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import { api } from '../App';

function AddMaterial() {

  const urlRef = useRef();
  const sourceRef = useRef();
  const categoryRef = useRef();

  const [material, setMaterial] = useState({})
  const [sections, setSections] = useState([]);

  const navigator = useNavigate();

  async function handleGetMaterialData(url, source) {
    try {
      const response = await api.post('material-data/', {
        url: url,
        source: source
      }) ;

      if (response.status === 200) {
        const data = await response.data;

        setMaterial(data[0]);
        setSections(data[1]);
      }      

    } catch (error) {
      var response = error['response'];
      var status = response['status']
      if (status === 500) {
        alert('Internal Server Problem, try again later.');
      } else if (status === 400) {
        alert(response['data']['data']);
      }
    }
  }

  async function handleAddMaterial() {
    try {
      const response = await api.post('materials/', {
        url: urlRef.current.value, 
        source: sourceRef.current.value,
        category: categoryRef.current.value
      });

      if (response.status === 201) {
        const data = await response.data;
    
        window.location.assign(`/learning_tracker/materials/${data['id']}/`)
      }
    
    } catch (error) {
      var response = error['response'];
      var status = response['status'];
      if (status === 500) {
        alert('Internal Server Problem, try again later.');
      } else if (status === 400) {
        alert(response['data']['data']);
      }
    }
  }

  return (
    <div className='add-material-page'>
      <div className='url-field-container'>
        <h2>Add Material URL</h2>
        <br />
        <div>
          <input ref={urlRef} type="text" name="url-field" id="url-field" placeholder='youtube video/playlist, or coursera course url only' />
          <button onClick={() => {
          urlRef.current.value.length > 0 ? handleGetMaterialData(urlRef.current.value, sourceRef.current.value) : alert("please enter a url");
          }} className='get-material-btn'>Get Mateial</button>
        </div>
        <div className='material-source'>
          <select defaultValue={'coursera'} ref={sourceRef} id="material-source">
            <option value="coursera">coursera</option>
            <option value="youtube">youtube</option>
          </select>
          <select defaultValue={'in progress'} ref={categoryRef} id="material-category">
            <option value="in progress">for now</option>
            <option value="future material">will take later</option>
            <option value="done">already done</option>
          </select>
        </div>
      </div>
        {material && (
          <div className='material-content'>
            <div className='image'>
              <img src={material['image']} alt={material['name']} />
            </div>
            <br />
            <h2>{material['name']}</h2>
            <br />
            <p>
              {material['description']}
            </p>
            <br />
            <div className='sections'>
              {sections.length > 0 && sections.map(section => {
                return (
                  <div className='material-section'>
                    <div>
                      {section['name']}
                    </div>
                  </div>                
                )
              })}
            </div>
            <br />
            <button onClick={() => {
              handleAddMaterial()
            }} className='add-material-btn'>Add Material</button>
          </div>
        )}
    </div>
  )
}

export default AddMaterial