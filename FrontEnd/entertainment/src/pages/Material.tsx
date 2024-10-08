import {useState, useEffect, useRef, RefObject} from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';

import {api} from '../App';

import MaterialNotes from './components/MaterialNotes';

interface materialData {
  'id'?: number,
  'name': string,
  'description': string,
  'url'?: string,
  'image'?: string,
  'status'?: string,
  'type'?: string,
  'special'?: boolean,
  'user'?: number
}

interface NoteData {
  'id': number,
  'name': string,
  'content': string
}

function Material({handleAlert}: {handleAlert?: any}) {

  const {id} = useParams();
  const [material, setMaterial] = useState<materialData>();
  const [notes, setNotes] = useState<Array<NoteData>>([]);

  const statusRef = useRef() as RefObject<HTMLSelectElement>;

  const [message, setMessage] = useState<string>('');

  async function handleGetMaterial() {
    try {
      const response = await api.get(`materials/${id}/`);
      
      if (response.status === 200) {
        const data = await response.data;
        
        setMaterial(data['material']);
        setNotes(data['notes']);
      }

    } catch (error) {
      if (error!['code' as keyof typeof error] === 'ERR_NETWORK') {
        setMessage('The server is down.');
      } else {
        var response = error!['response' as keyof typeof error];
        var status = response['status' as keyof typeof response];
        
        if (status === 404) {
          setMessage('The material does not exist.');
        }
        else if (status === 500) {
          setMessage('There is a problem on server side.');
        }
      }

    }
  }

  async function handleDeleteMateial() {
    try {
      const response = await api.delete(`materials/${id}/`);

      if (response.status === 204) {
        window.location.assign('/entertainment/');
      }
    } catch (error) {
      var response = error!['response' as keyof typeof error];
      var status = response['status' as keyof typeof response];
        
      if (status === 500) {
        handleAlert('There is a problem on server side.');
      };

    }
  }

  async function handleChangeStatus() {
    try {
      const response = await api.patch(`materials/${id}/`, {status: statusRef.current?.value});

      if (response.status === 202) {
        window.location.reload();
      }

    } catch (error) {
      var response = error!['response' as keyof typeof error];
      var status = response['status' as keyof typeof response];
        
      if (status === 500) {
        handleAlert('There is a problem on server side.');
      };
    }
  }

  async function handleChangeSpecial() {
    try {
      const response = await api.patch(`materials/${id}/`, {special: (material && !material['special'])})
    
      if (response.status === 202) {
        window.location.reload();
      }

    } catch (error) {
      var response = error!['response' as keyof typeof error];
      var status = response['status' as keyof typeof response];
        
      if (status === 500) {
        handleAlert('There is a problem on server side.');
      };
    }
  }

  useEffect(() => {
    if (id) {
      handleGetMaterial();
    } else {
      const data = Object.fromEntries(new URLSearchParams(location.search)) as object as materialData;
      if ((data['image'] as string)[data['image']!.length-1] === '/') {
        data['image'] = (data['image'] as string).slice(0, data['image']!.length-1);
      }
      data['url'] = `https://myanimelist.net/anime/${data['id']}`;

      setMaterial(data);
    }

    
  }, [])

  return (

    <div className='material-page page'>
      {material ? (<>
        <div>
          <div className='data-container'>
            <div className="img-container">
              <img src={material!['image'] 
              ? material!['image']
              : 'https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'} 
              alt={material!['name']} />
            </div>
            <div className='info'>
              <h2>{material!['name']}</h2>
              {material['url'] && (<span className="url"><a target='_blank' href={material!['url']}>{material!['url']}</a></span>)}
              {material['status'] && material['special'] && (
                <div>
                  <select onChange={handleChangeStatus} ref={statusRef} className="status">
                    <option selected={material!['status'] === 'current' ? true : false} value={'current'}>current</option>
                    <option selected={material!['status'] === 'done' ? true : false} value={'done'}>done</option>
                    <option selected={material!['status'] === 'later' ? true : false} value={'later'}>later</option>
                  </select>
                  <span title='change speciality' onClick={handleChangeSpecial} style={{cursor: 'pointer'}} className={material!['special'] ? 'special' : ''}>{(! material!['special'] ? 'not ' : '')}special</span>
                </div>
              )}
            </div>
          </div>
          <div className='material-description'>
            <p className="description">
              {material['description']}
            </p>
          </div>
        </div>
        <br />
        {material['user'] && (<button onClick={handleDeleteMateial} className='delete-btn'>Delete</button>)}
      </>): (<>
        <h1 style={{margin: '30px'}}>{message}</h1>
      </>)}
      {notes.length > 0 && (
        <MaterialNotes notes={notes} layout='horizontal' />
      )}
    </div>
  )
}

export default Material;