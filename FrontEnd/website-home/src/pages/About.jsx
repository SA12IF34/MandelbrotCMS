import React from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import personalImg from '../assets/about/personal.jpg';
import '../About.css';
import '../App.css';

function About() {
  return (
    <div className='AboutPage about-golden'>
      <Header title={'About'} />
      <div className='GrandContainer'>
        <div className='ParentContainer'>
          <main>
            <div>
              <p>
                Hello again, I'm Saif Ayesh, a full stack developer and a software engineer. My tech stack includes  Python/Django for backend, and React.js/Next.js and vanilla Javascript for frontend. 
                <br />
                I have my experience building numerous projects for myself (most of them are not online currently; the source code is <a target='_blank' href='http://github.com/SA12IF34/'>here</a>). (<Link to={'/mandelbrotCMS/'}>my portfolio</Link>)
              </p>
              <p>
                I have been using my skills, honing them, and building various <a target='_blank' href="http://github.com/SA12IF34/">projects</a> (e.g., social media, ecommerce, etc...) for more than two years. 
                <br />
                I have gained much experience throughout this time by building new and advanced things, and overcoming errors.
              </p>
              <p>
                I always want to keep learning, improving, and gaining experience. Now, I'm currently studying machine learning.
              </p>
              <p>
                From the events and trends in the last year, I can see that the discipline and adaptability are important to have, and fortunately, I think I have these traits.
              </p>
              <p>
                Now, I have no problem building projects from any scale as long as the project is web related.
              </p>
              <p>
                You can reach me, and contact me 
                via the ways <Link style={{color: 'black', fontWeight: 'bold'}} to='/contact/'>here</Link>.
              </p>
            </div>
            <div>
              
            </div>
          </main>
          <div className='Image'>
              <img src={personalImg} alt="saif chan about" />
          </div>
        </div>
        <div className='bg'> 
          <div className='RightBg'></div>
          <div className='LeftBg'></div>
        </div>
      </div>
    </div>
  )
}

export default About;