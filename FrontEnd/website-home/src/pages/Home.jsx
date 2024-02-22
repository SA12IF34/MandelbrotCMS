import React from 'react';
import bg from '../assets/home/bg.png';
import portfolioImg from '../assets/home/portfolio.png';
import skillsImg from '../assets/home/skills.png';
import aboutImg from '../assets/home/about2.png';
import contactImg from '../assets/home/contact.png';
import { Link } from 'react-router-dom';
import '../Home.css';

function Home() {
    
  return (
    <div className='HomePage'>

        <main>
            <div className='IntroParagraph'>
                <p>
                Hello and welcome to my website, 
                this is the personal website of a
                full stack software engineer.
                </p>
            </div>

            <div className='NavContainer'>
                <Link to={'/mandelbrotCMS/'}>
                    <div className='portfolio'>
                        <h2>Portfolio</h2>
                        <div className="Img">
                            <img src={portfolioImg} alt="mandelbrotCMS portfolio" />
                        </div>
                    </div>
                </Link>
                <Link to={'/skills/'}>
                    <div className='skills'>
                        <h2>Skills</h2>
                        <div className="Img">
                            <img src={skillsImg} alt="saifChan skills" />
                        </div>
                    </div>
                </Link>
                <Link to={'/about/'}>
                    <div className='about'>
                        <h2>About</h2>
                        <div className="Img">
                            <img src={aboutImg} alt="saifChan about" />
                        </div>
                    </div>
                </Link>
                <Link to={'/contact/'}>
                    <div className='contact'>
                        <h2>Contact</h2>
                        <div className='Img'>
                            <img src={contactImg} alt="saifChan contact" />
                        </div>
                    </div>
                </Link>
            </div>
        </main>
        <img className='bg' src={bg} alt="" />
    </div>
  )
}

export default Home;