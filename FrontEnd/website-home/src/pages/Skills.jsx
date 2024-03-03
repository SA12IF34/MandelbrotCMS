import React from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import portfolioImg from '../assets/skills/mandelbrot.png';
import '../Skills.css';
import '../App.css';

function Skills() {
  return (
    <div className='SkillsPage skills-golden'>
      <Header title={'Skills in a Nutshell'} />
      <main>
        <div className='MainContainer golden'>
          <h1>Full-Stack</h1>
        </div>
        <div>

          <div className="FrontendContainer SkillsContainer golden">
            <div className='Frontend Skills'>
              <h2>Frontend</h2>
              <ul>
                <li>
                  I can <a href="/mandelbrotCMS/">build professional and 
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
          
          <div className="BackendContainer SkillsContainer golden">
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
        </div>
      </main>
      
      
      <div className='OtherContent'>
        <div className='Paragraphs'>
          <h2>
            I will deliver you a tested and almost free bugs app as <span className='Underlined'>this serves towards your business goals and your project’s user experience</span>.
          </h2>
          <h2>
            I have no problem using AI in my work, or integrating it into the projects I build.
          </h2>
          <h2>
            I will use SDLC  approaches depending on client requirements and the scale of the project; <strong>to make sure of the success of the project</strong>.
          </h2>
        </div>
        <div className='PortfolioNav'>
        <Link to={'/mandelbrotCMS/'}>
          <div className='PortfolioBtn'>
          <h2>move to the portfolio</h2>
            <img src={portfolioImg} alt="Saif Chan Portfolio, MandelbrotCMS" />
            
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