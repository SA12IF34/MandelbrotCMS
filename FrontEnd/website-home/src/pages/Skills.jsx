import React from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import portfolioImg from '../assets/home/portfolio.png';
import '../Skills.css';
import '../App.css';

function Skills() {
  return (
    <div className='SkillsPage skills-golden'>
      <Header title={'Skills in a Nutshell'} />
      <main>
        <div className="FrontendContainer golden">
          <div className='Frontend Skills'>
            <h2>Frontend</h2>
            <ul>
              <li>
                As you can see, I can <a href="/MandelbrotCMS/">build professional and 
                complicated UIs</a> using different web dev 
                tools.
              </li>
              <li>
                I’m able to build complicated forms and 
                capture data from them.
              </li>
              <li>
                I’m able to bring 3D content and animation 
                into the web.
              </li>
              <li>
                I use different JS libraries, frameworks, and 
                utilities to build web apps depending on 
                their type and priorities.
              </li>
              <li>
                I use <a target='_blank' href='http://en.wikipedia.org/wiki/TypeScript'>Typescript</a> for building professional 
                web apps .
              </li>
            </ul>
          </div>
        </div>
        
        <div className="BackendContainer golden">
          <div className='Backend Skills'>
            <h2>Backend</h2>
            <ul>
              <li>
                I use Django framework to build the backends of my projects.
              </li>
              <li>
                I build apis using <a target='_blank' href='http://django-rest-framework.org'>DRF</a> and I can implement  
                CRUD, Search, and complicated DB queries. 
              </li>
              <li>
                I design the Database and use either Sqlite or 
                Postgresql.
              </li>
              <li>
                I’m able to implement <a target='_blank' href='http://roadmap.sh/guides/session-based-authentication'>Session</a>, <a target='_blank' href='http://en.wikipedia.org/wiki/JSON_Web_Token'>JWT</a>, 
                and <a target='_blank' href='http://en.wikipedia.org/wiki/OAuth'>Oauth</a> based authentications.
              </li>
              <li>
                I make sure to apply security best practices 
                like storing tokens in <a target='_blank' href="http://en.wikipedia.org/wiki/HTTP_cookie#Http-only_cookie">Http-only cookies</a>.
              </li>
              <li>
                I use different Python libraries to operate 
                various tasks.
              </li>
            </ul>
            </div>
        </div>
        
        <div className='MainContainer golden'>
          <h2>Full-Stack</h2>
          <svg className='RightPartSVG' width="335" height="87" viewBox="0 0 335 87" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 0.5C10.7595 23.1765 22.4704 30.7598 51 38L259 63C301.596 65.3923 319.057 70.0561 334.5 86.5" stroke="black"/>
          </svg>
          <svg className='LeftPartSVG' width="335" height="88" viewBox="0 0 335 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M334.5 1C324.74 23.6765 313.03 31.2598 284.5 38.5L76.5 63.5C33.9042 65.8923 16.4429 70.5561 1 87" stroke="black"/>
          </svg>
        </div>
      </main>
      
      
      <div className='OtherContent'>
        <div className='Paragraphs'>
          <p>
            I will deliver you a tested and almost free bugs app as <span className='Underlined'>this serves towards your business goals and your project’s user experience</span>.
          </p>
          <p>
            I have no problem using AI in my work, or integrating it into the projects I build.
          </p>
          <p>
            I will use SDLC  approaches depending on client requirements and the scale of the project; <span className='Bold'>to make sure of the success of the project</span>.
          </p>
        </div>
        <div className='PortfolioNav'>
          <Link to={'/mandelbrotCMS/'}>
            <div className='PortfolioBtn'>
              <img src={portfolioImg} alt="Saif Chan Portfolio, MandelbrotCMS" />
              <h2>move to the portfolio</h2>
            </div> 
          </Link>
        </div>
        <div className="bg">
          <div className='RightBg'></div>
          <div className='LeftBg'></div>
        </div>
      </div>
      
    </div>
  )
}

export default Skills;