import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';

function Header() {

  const params = useParams()['*'];
  
  useEffect(() => {
    let links = document.querySelectorAll('nav ul li a') as NodeListOf<HTMLAnchorElement>;
    links.forEach(link => {
      if (link.pathname.replace('/', '') === params) {
        link.parentElement?.classList.add('current')
      }
    })
  },[])

  function handleChangePage(e: any) {
    let links = document.querySelectorAll('nav ul li a');
    let target = e.target as HTMLLIElement;
    links.forEach(link => {
      if (link === target) {
        target.parentElement?.classList.add('current');
      } else {
        link.parentElement?.classList.remove('current');
      }
    }) 
  }

  return (
    <header>
      <h1 className='title'>
        <Link style={{color: 'black', textDecoration: 'none'}} to={'/entertainment/'}>Entertainment</Link>
      </h1>
      <a href="/home/">
        <button>Go Home</button>
      </a>
      <nav>
        <ul>
          <li onClick={handleChangePage}>
            <Link to={'/entertainment/'}>Home</Link>
          </li>
          <li onClick={handleChangePage}>
            <Link to={'/entertainment/add-material/'}>Add New</Link>
          </li>
          <li>
            <Link onClick={handleChangePage} to={'/entertainment/special/'}>Special</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header