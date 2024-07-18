import {useState, useRef, useEffect, RefObject} from 'react';
import { Link } from 'react-router-dom';
import { api } from "../App";


function MaterialsSearch() {

  const [materials, setMaterials] = useState<Array<object>>([]);

  const nameRef = useRef() as RefObject<HTMLInputElement>;
  const typeRef = useRef() as RefObject<HTMLSelectElement>;
  const statusRef = useRef() as RefObject<HTMLSelectElement>; 

  async function handleSearch() {
    var nameVal = nameRef.current?.value;
    var typeVal = typeRef.current?.value;
    var statusVal = statusRef.current?.value;

    const response = await api.get(`materials/search/?type=${typeVal}&status=${statusVal}&name__contains=${nameVal}`);
    if (response.status === 200) {
      const data = await response.data;
      setMaterials(data);
    }
  }

  async function handleFirstSearch(searchQuery: string) {
    const response = await api.get(`materials/search/${searchQuery}`);
    if (response.status === 200) {
      const data = await response.data;

      setMaterials(data);
    }
    
  }

  var n =0;
  useEffect(() => {

    if (n < 1) {    

      const params = new URLSearchParams(window.location.search);
      const paramKeys = Array.from(params.keys());
      const paramVals = Array.from(params.values());
      var searchQuery = '?';
      
      for (let i=0; i < paramKeys.length; i++) {
        if (i === paramKeys.length-1) {
          searchQuery += `${paramKeys[i]}=${paramVals[i]}`;
        }else {
          searchQuery += `${paramKeys[i]}=${paramVals[i]}&`;
        }
      }

      handleFirstSearch(searchQuery);      

      n = 1;
    }

  }, [])

  return (
    <div className='search-page'> 
      <div className="search-container">
        <input onChange={handleSearch} ref={nameRef} type="text" placeholder="search by name" />
        <div className="filter">
          <span>Filter by</span>
          <div>
            <select onChange={handleSearch} ref={typeRef} defaultValue={'Type'} id="type-filter">
              <option value="">Type</option>
              <option value="anime">Anime</option>
              <option value="game">Games</option>
              <option value="shows">Shows & Movies</option>
              <option value="other">Other</option>
            </select>
            <select onChange={handleSearch} ref={statusRef} defaultValue={'Status'} name="" id="">
              <option value="">Status</option>
              <option value="current">Current</option>
              <option value="done">Done</option>
              <option value="later">Later</option>
            </select>
          </div>
        </div>
      </div>
      <div className="search-content">
        {materials && materials.length > 0 ? materials.map(material => {
          return (
            <Link to={`/entertainment/materials/${material['id' as keyof typeof material]}`}>
              <div>
                <div className='image'>
                  <img src={material['image' as keyof typeof material]} alt="" />
                </div>
                <span>{material['name' as keyof typeof material]}</span>
              </div>
            </Link>
          )
        }) : (
          <>
            <h2>No materials..</h2>
          </>
        )}
      </div>
    </div>
  )
}

export default MaterialsSearch;