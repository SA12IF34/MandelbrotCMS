import {useRef, useState, useEffect} from 'react';
import { api } from '../App';

function ObjectSearch({setRelatedObjName, objectToSearch, setObjSearchOpen, setRelatedObj}) {

  const [searchPath, setSearchPath] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef();


  async function handleSearch() {
    try {
        const response = await api.get(searchPath+`?search=${searchRef.current.value}`, {
            baseURL: import.meta.env.VITE_API_BASE__URL
        })

        if (response.status === 200) {
            const data = await response.data;

            setSearchResults(data);
        }

    } catch (error) {
        
    }
  }

  function handleSetSearchPath() {
    switch (objectToSearch) {
        case 'project':
            setSearchPath('sessions_manager/apis/projects/');
            break;
    
        case 'learning_material':
            setSearchPath('learning_tracker/apis/materials/');
            break;
        
        case 'tasks_list':
            setSearchPath('tasks/apis/get-containers/')
            break;
        case 'goal':
            setSearchPath('goals/apis/goals/')
            break;

        default:
            break;
    }
  }

  function handleCloseSearch() {
    setObjSearchOpen(false);
  }

  function handleProcessName(name) {
    return name.length < 30 ? name : name.slice(0, 30)+'...';
  }

  useEffect(() => {
    handleSetSearchPath();
  }, [])

  return (
    <div className='obj-search-container'>
        <div>
            <input onChange={handleSearch} type="text" ref={searchRef} placeholder={`search a ${objectToSearch !== 'tasks_list' ? objectToSearch : 'missions list'}`} />
        </div>
        <div>
            {searchResults.map(obj => {
                return (
                    <div onClick={() => {
                        setRelatedObj([objectToSearch, obj.id]);
                        handleCloseSearch();
                        setRelatedObjName(objectToSearch !== 'tasks_list' ? obj.name : obj.title);
                    }}>
                        <span>{handleProcessName(objectToSearch !== 'tasks_list' ? obj.name : obj.title)}</span>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default ObjectSearch