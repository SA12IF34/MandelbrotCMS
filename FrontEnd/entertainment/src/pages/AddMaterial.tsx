import {RefObject, useRef, useState} from 'react';
import '../App.css';

import { api } from '../App';

function AddMaterial({handleAlert}: {handleAlert: any}) {

  const [image, setImage] = useState<string>();

  const mainUrlRef = useRef() as RefObject<HTMLInputElement>;
  const typeRefOne = useRef() as RefObject<HTMLSelectElement>;
  const statusRefOne = useRef() as RefObject<HTMLSelectElement>;

  const typeRefTwo = useRef() as RefObject<HTMLSelectElement>;
  const statusRefTwo = useRef() as RefObject<HTMLSelectElement>;
  const nameRef = useRef() as RefObject<HTMLInputElement>;
  const urlRef = useRef() as RefObject<HTMLInputElement>;
  const imageUrlRef = useRef() as RefObject<HTMLInputElement>;
  const descriptionRef = useRef() as RefObject<HTMLTextAreaElement>;
  const specialRef = useRef() as RefObject<HTMLInputElement>;


  async function handleAddMaterialMain() {

    try {
      const response = await api.post('materials/url/', {
        url: mainUrlRef.current?.value,
        type: typeRefOne.current?.value,
        status: statusRefOne.current?.value
      })

      if (response.status === 201) {
        const {id} = await response.data;
        window.location.assign(`/entertainment/materials/${id}/`)
      }
    } catch (error) {
      var response = error!['response' as keyof typeof error];
      var status = response['status' as keyof typeof response];
        
      if (status === 500) {
        handleAlert('There is a problem on server side.');
      };
    }
  }

  async function handleAddMaterial() {
    try {
      const data = {
        name: nameRef.current?.value,
        description: descriptionRef.current?.value,
        url: urlRef.current?.value,
        image: imageUrlRef.current?.value,
        type: typeRefTwo.current?.value,
        status: statusRefTwo.current?.value,
        special: specialRef.current?.checked
      }

      const response = await api.post(`materials/`, data);

      if (response.status === 201) {
        const {id} = await response.data;
        window.location.assign(`/entertainment/materials/${id}/`)
      }
    } catch (error) {
      var response = error!['response' as keyof typeof error];
      var status = response['status' as keyof typeof response];
        
      if (status === 500) {
        handleAlert('There is a problem on server side.');
      };
    }
  }

  return (
    <div className='add-material-page page flex-page'>
      <div className='url-field-container'>
        <h2>Enter Material URL</h2>
        <br />
        <div>
          <input ref={mainUrlRef} type="text" name="url-field" id="url-field" placeholder='material url' />
          <div className='material-info'>
            <select ref={typeRefOne} defaultValue={'type'} id="material-source">
              <option value="type">type</option>
              <option value="anime">anime(mal or anilist)</option>
              <option value="game">game(steam)</option>
            </select>
            <select ref={statusRefOne} defaultValue={'status'} id="material-category">
              <option value="status">status</option>
              <option value="current">current</option>
              <option value="done">done</option>
              <option value="later">later</option>
            </select>
          </div>
        </div>
        <button onClick={handleAddMaterialMain} className='add-material-btn'>Add Mateial</button>

      </div>
      <div className='form-container'>
        <h2>Or fill material information yourself</h2>
        <br />
        <br />
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddMaterial();
        }}>
          <div>
            <select ref={typeRefTwo} name="type" id="type">
              <option value="type">type</option>
              <option value="anime">anime</option>
              <option value="game">game</option>
              <option value="other">other</option>
            </select>
            <select ref={statusRefTwo} name="status" id="status">
              <option value="status">status</option>
              <option value="current">current</option>
              <option value="done">done</option>
              <option value="later">later</option>
            </select>
          </div>
          <br />
          <br />
          <input ref={nameRef} type="text" name="name" id="name-npt" placeholder='Name' />
          <br />
          <br />
          <input ref={urlRef} type="url" name="url" id="url-npt" placeholder='Material url (any)' />
          <br />
          <br />
          <input onChange={() => {setImage(imageUrlRef.current?.value)}} ref={imageUrlRef} type="text" name="image-url" id="image-url-npt" placeholder='Image url' />
          <br />
          {image && (
            <><img style={{width: '200px', borderRadius: '5px', margin: '10px 0px'}} src={image} /><br/></>
          )}
          <br />
          <textarea ref={descriptionRef} name="description" id="description-npt" placeholder='Description' />
          <br />
          <br />
          <div className='special-input'>
            <input ref={specialRef} type="checkbox" name="special" id="special-npt" />
            <label htmlFor="special-npt">Special</label>
          </div>
          <br />
          <br />
          <input type="submit" value="Add Material" />
        </form>
      </div>
    </div>
  )
}

export default AddMaterial