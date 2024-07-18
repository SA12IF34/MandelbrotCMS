import {useEffect} from 'react';

function NotExist() {

  useEffect(() => {
    if (window) {
      document.querySelector('title').textContent = 'Does Not Exist'
    }
  }, [])

  return (
    <div style={{padding: '30px'}}>
      <h2 style={{fontWeight: 500}}>The page does not exist</h2>
      <br />
      <a style={{textDecoration: 'underline', color: 'blue'}} href="/notes/">
        <h3 style={{fontWeight: 500}}>Back to home page</h3>
      </a>
    </div>
  )
}

export default NotExist