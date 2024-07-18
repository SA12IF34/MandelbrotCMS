import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Link } from "react-router-dom";
import { PiList } from 'react-icons/pi';
import { MdArrowRight, MdArrowLeft } from 'react-icons/md';
import '../../App.css';

import { api } from '../../App';

function Header({setClassName, authenticated}: {setClassName: any, authenticated: boolean}) {

  const [partLinks, setPartLinks] = useState<Array<object>>([]);

  async function handleGetParts() {
    try {
      const response = await api.get('saifchan/part-links/');

      if (response.status === 200) {
        const data = await response.data;

        setPartLinks(data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    

    if (window && partLinks.length > 0) {
      console.log('hello')
      var nav = document.querySelector('nav') as HTMLElement;
      var linksContainer = document.querySelector('nav > div') as HTMLDivElement;

      if (linksContainer.offsetWidth > nav.offsetWidth) {
        let translateVal: number = 0;
        let leftWidth = linksContainer.offsetWidth - nav.offsetWidth;

        var slider = document.createElement('div');
        slider.classList.add('slider');

        ReactDOM.createRoot(slider).render(<MdArrowRight onClick={() => {
          var transitionWidth = 0;
          var links = [...linksContainer.childNodes].reverse();
          
          if (leftWidth <= 0) {
            return;
          }

          if ((links[0] as HTMLElement).offsetWidth <= leftWidth) {
            leftWidth -= (links[0] as HTMLElement).offsetWidth;
            transitionWidth = (links[0] as HTMLElement).offsetWidth;
          }
          else if ((links[0] as HTMLElement).offsetWidth >= leftWidth) {
            transitionWidth = leftWidth+40;
            leftWidth = 0;

            var reverseSlider: HTMLElement | null = document.createElement('div') as HTMLElement;
            reverseSlider.classList.add('reverse-slider');

            ReactDOM.createRoot(reverseSlider).render(<MdArrowLeft onClick={() => {
              translateVal = 0;
              leftWidth = linksContainer.offsetWidth - nav.offsetWidth;
              
              linksContainer.style.cssText = `transform: translateX(${translateVal}px)`;
              reverseSlider?.remove();
              reverseSlider = null;
            }} />)

            nav.appendChild(reverseSlider);
            
          }
          
          translateVal += transitionWidth;
          linksContainer.style.cssText = `transform: translateX(-${translateVal}px)`
        }} />);

        nav.appendChild(slider);

      }

    }
  }, [partLinks])

  useEffect(() => {
    handleGetParts();
  }, [])

  return (
    <header>
      <div>
        <Link to={'/home/'}>
          <h1>MandelbrotCMS</h1>
        </Link>
        {authenticated ? (
          <PiList onClick={() => {setClassName('SideBar');}} />
        ): (
          <div style={{display: 'flex', columnGap: '20px'}}> 
            <Link to={'/sign-up/'}> 
              <button className='profile'>Sign Up</button>
            </Link>
            <Link to={'/log-in/'}> 
              <button className='profile'>Log In</button>
            </Link>
          </div>
        )} 
      </div>

      <nav>
        <div>
          {partLinks && partLinks.map(link => {
            return (
              <a href={link['link' as keyof typeof link]}>{link['name' as keyof typeof link]}</a>
            )
          })}
          {/* <a href={'/sessions_manager/'}>
            <span>Sessions Manager</span>
          </a>
          <a href={'/learning_tracker'}>
            <span>Learning Tracker</span>
          </a>
          <a href={'/entertainment/'}>
            <span>Entertainment</span>
          </a>
          <a href={'/goals/'}>
            <span>Goals</span>
          </a>
          <a href={'/all-missions/'}>
            <span>All Missions</span>
          </a>
          <a href={'/create-missions-list/'}>
            <span>New Missions List</span>
          </a> */}
        </div>
      </nav>
    </header>
  )
}

export default Header;