import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {FaCaretRight} from 'react-icons/fa';

import { handleAddPart } from './Utilities/partitions';
import { addScreen } from './Utilities/screens';
import { partTransition } from './Utilities/transitions';
import '../Portfolio.css';
import '../PortfolioTablet.css';
import '../PortfolioMobile.css';


// Voices
import introVoice  from '../assets/portfolio/voices/intro.mp3';
import intro2Voice from '../assets/portfolio/voices/intro_2.mp3';

import sessionsManagerVoice from '../assets/portfolio/voices/sessions_manager.mp3';
import learningTrackerVoice from '../assets/portfolio/voices/learning_tracker.mp3';
import entertainmentVoice from '../assets/portfolio/voices/entertainment.mp3';
import goalsVoice from '../assets/portfolio/voices/goals.mp3';
import missionsVoice from '../assets/portfolio/voices/missions.mp3';

// Images 
import mandelbrotImg from '../assets/home/portfolio.png';

import SessionsManagerImg from '../assets/portfolio/Sessions_Manager.png';
import LearningTrackerImg from '../assets/portfolio/Learning_Tracker.png';
import EntertainmentImg from '../assets/portfolio/Entertainment.png';
import MissionsImg from '../assets/portfolio/Missions.png';

import SessionsManagerTabImg from '../assets/portfolio/tablet/Sessions_Manager.png';
import LearningTrackerTabImg from '../assets/portfolio/tablet/Learning_Tracker.png';
import EntertainmentTabImg from '../assets/portfolio/tablet/Entertainment.png';
import MissionsTabImg from '../assets/portfolio/tablet/Missions.png';

import SessionsManagerMobileImg from '../assets/portfolio/mobile/Sessions_Manager.png';
import LearningTrackerMobileImg from '../assets/portfolio/mobile/Learning_Tracker.png';
import EntertainmentMobileImg from '../assets/portfolio/mobile/Entertainment.png';
import MissionsMobileImg from '../assets/portfolio/mobile/Missions.png'

// Videos
import GoalsVideo from '../assets/portfolio/Goals.mp4';
import GoalsTabVideo from '../assets/portfolio/tablet/Goals.mp4';
import GoalsMobileVideo from '../assets/portfolio/mobile/Goals.mp4';

function Portfolio({checkBeforePortfolio}) {

  async function handleCalculateDuration(voice) {

    const audioContext = new AudioContext();

    return await fetch(voice) 
    .then(response => response.arrayBuffer()) 
    .then(buffer => audioContext.decodeAudioData(buffer)) 
    .then(audioBuffer => { 
      var time = `${audioBuffer.duration}`.slice(0, 5);
      time = validateTime(time);

      const duration = parseInt(time.replace('.', '').slice(0, 5)); 
      return duration;
      }); 
  }

  function validateTime(time) {
    var afterDot = time.split('.')[1];

    
    if (afterDot.length === 1) {
      time+= '00';
      return time;
    } else if (afterDot.length === 2) {
      time += '0';
      return time;
    } else if (afterDot.length >= 3) {
      return time;
    }
    
    return time;
  }

  function handleDistributeDuration(time, paragraph) {
    const charTime = parseInt(time / paragraph.length);
  
    return charTime;
  }

  async function handleAnimateParagraph(voice, paragraph, querySelector, otherFunction, otherFunctionParams=null) {
    
    const time = await handleCalculateDuration(voice);
    const timeChunk = handleDistributeDuration(time, paragraph);

    const container = document.querySelector(querySelector);

    const audio = document.createElement('audio');
    audio.src = voice;
    audio.autoplay = true;
    audio.classList.add('audioContainer');

    document.body.appendChild(audio)

    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        container.textContent += paragraph[i];
        let span = document.createElement('span');
        span.classList.add('write-line');
        container.appendChild(span);
        i+=1;
        if (i === paragraph.length) {
          setTimeout(() => {
            if (otherFunction) {
              if (otherFunctionParams) {
                otherFunction(...Object.values(otherFunctionParams))
              } else {
                otherFunction();
              }
            }
  
          }, 500);
          clearInterval(interval)
        }
  
      }, parseInt(timeChunk));
    }, 300)
  }

  function handleStartCount() {
    let container = document.querySelector('#Phase-1 .golden-1 > div');
    let span1 = document.createElement('span');
    let span2 = document.createElement('span');
    let span3 = document.createElement('span');

    span1.textContent = '1';
    span2.textContent = '2';
    span3.textContent = '3';

    let spansArr = [span3, span2, span1];
    let i = 0;

    const interval = setInterval(() => {
      
      if (i === 3) {
        startSecondPhase();
        clearInterval(interval)
      }
      spansArr[i].classList.add('appear');
      container.appendChild(spansArr[i]);
      setTimeout(() => {
        if (i < 2) {
          spansArr[i].classList.add('disappear');
        }
        i+=1;
      }, 800)
      
      
    }, 1000)


  }

  function startSecondPhase() {
    const mandelbrotContainer = document.createElement('div');
    const mandelbrotImgContainer = document.createElement('img');

    mandelbrotContainer.classList.add('MandelbrotContainer');
    mandelbrotImgContainer.src = mandelbrotImg;

    mandelbrotContainer.appendChild(mandelbrotImgContainer);;

    const parent = document.querySelector('.PortfolioPage');

    parent.appendChild(mandelbrotContainer);
    parent.classList.add('ChangePerspective')

    const phaseContainer = document.getElementById('Phase-1');
    phaseContainer.classList.add('StartSecond');

    setTimeout(() => {
      document.getElementById('Phase-2').classList.remove('deactivate');
      document.getElementById('Phase-1').classList.add('deactivate');
      document.querySelector('.MandelbrotContainer').remove()
      secondPhase();
    }, 3550)

  }

  function secondPhase() {
    const paragraphValue = `MandelbrotCMS, a project enables you to track different aspects of your life.`;

    const paragraphContainer = document.createElement('div');
    const paragraph = document.createElement('p');

    paragraphContainer.classList.add('ParagraphContainer');
    paragraph.classList.add('Paragraph');
    
    paragraphContainer.appendChild(paragraph);


    const container = document.querySelector('#Phase-2 > div');
    container.classList.add('phase-2-intro');

    container.appendChild(paragraphContainer);

    handleAnimateParagraph(intro2Voice, paragraphValue, '.Paragraph', handleTransition, {identifier: 'SessionsManager'});

  }



  function handleTransition(identifier) {
    const parent = document.querySelector("#Phase-2");
    const container = document.querySelector('#Phase-2 > div');
    switch (identifier) {
      case 'SessionsManager':
        partTransition(parent, container, handleSetPart, 'SessionsManagerTransition');
        
        break;
      
      case 'LearningTracker':
        partTransition(parent, container, handleSetPart, 'LearningTrackerTransition');

        break;
      
      case 'Entertainment':
        partTransition(parent, container, handleSetPart, 'EntertainmentTransition')

        break;
      
      case 'Goals':
        partTransition(parent, container, handleSetPart, 'GoalsTransition');

        break;
      
      case 'Missions':
        partTransition(parent, container, handleSetPart, 'MissionsTransition')

        break
    
      default:
        console.log('soso')
        
        break;
    }
  }

  

  function handleSetPart(identifier) {
    handleAddPart();
    switch (identifier) {
      case 'SessionsManager':
        var paragraphValue = `You can add, manage, and track the projects you are working on with Sessions Manager.`
        setTimeout(() => {
          handleAnimateParagraph(sessionsManagerVoice, paragraphValue, '#Phase-2.SessionsManagerTransition p', handleTransition, {identifier: 'LearningTracker'});
          handleAddScreen(identifier);
        }, 200)
        break;

      case 'LearningTracker':
        var paragraphValue = `Also, you can add the current courses you are taking, the courses you have done, and the ones you want to take in future either from coursera or youtube with Learning Tracker.`;
        
        setTimeout(() => {
          handleAnimateParagraph(learningTrackerVoice, paragraphValue, '#Phase-2.LearningTrackerTransition p', handleTransition, {identifier: 'Entertainment'})
          handleAddScreen(identifier);
        }, 200);
        break;
      
      case 'Entertainment':
        var paragraphValue = `You can list the animes, games, or any entertainment material you love, and mark the special ones. All of that and more in Entertainment Section.`;

        setTimeout(() => {
          handleAnimateParagraph(entertainmentVoice, paragraphValue, '#Phase-2.EntertainmentTransition p', handleTransition, {identifier: 'Goals'})
          handleAddScreen(identifier);
        }, 200)
        break;
      
      case 'Goals':
        var paragraphValue = `Not only that, you can also set goals and connect them with projects, courses, and any kind of work you want, and track the progress of your goals. And when you finish it, there is a reward waiting you you have set.`;

        setTimeout(() => {
          handleAnimateParagraph(goalsVoice, paragraphValue, '#Phase-2.GoalsTransition p', handleTransition, {identifier: 'Missions'});
          handleAddScreen(identifier);
        }, 200)
        break;
      
      case 'Missions':
        var paragraphValue = `We're not done yet. Of course we have a section where you set your daily missions, and you will be able to track them over the browser extension which will be available soon, isn't it great?!`;
        setTimeout(() => {
          handleAnimateParagraph(missionsVoice, paragraphValue, '#Phase-2.MissionsTransition p', handleStartThirdPhase);
          handleAddScreen(identifier);
        }, 200)
        break
    
      default:
        break;
    }
  }

  function handleAddScreen(identifier) {
    let img;
    switch (identifier) {
      case 'SessionsManager':
        if (window.matchMedia('(max-width: 912px) and (min-width: 768px)').matches) {
          img = SessionsManagerTabImg;
        } else if (window.matchMedia('(max-width: 600px)').matches) {
          img = SessionsManagerMobileImg;
        } else if (window.matchMedia('(min-width: 1000px)').matches) {
          img = SessionsManagerImg;
        }

        addScreen('SessionsManagerScreen', img);

        break;
      
      case 'LearningTracker':
        if (window.matchMedia('(max-width: 912px) and (min-width: 768px)').matches) {
          img = LearningTrackerTabImg;
        } else if (window.matchMedia('(max-width: 600px)').matches) {
          img = LearningTrackerMobileImg;
        } else if (window.matchMedia('(min-width: 1000px)').matches) {
          img = LearningTrackerImg;
        }

        addScreen('LearningTrackerScreen', img);
        break;
      
      case 'Entertainment':
        if (window.matchMedia('(max-width: 912px) and (min-width: 768px)').matches) {
          img = EntertainmentTabImg;
        } else if (window.matchMedia('(max-width: 600px)').matches) {
          img = EntertainmentMobileImg;
        } else if (window.matchMedia('(min-width: 1000px)').matches) {
          img = EntertainmentImg;
        }

        addScreen('EntertainmentScreen', img);
        break;
      
      case 'Goals':
        let video;
        if (window.matchMedia('(max-width: 912px) and (min-width: 768px)').matches) {
          video = GoalsTabVideo;
        } else if (window.matchMedia('(max-width: 600px)').matches) {
          video = GoalsMobileVideo;
        } else if (window.matchMedia('(min-width: 1000px)').matches) {
          video = GoalsVideo;
        }
        addScreen('GoalsScreen', video, true);
        break;
      
      case 'Missions':
        if (window.matchMedia('(max-width: 912px) and (min-width: 768px)').matches) {
          img = MissionsTabImg;
        } else if (window.matchMedia('(max-width: 600px)').matches) {
          img = MissionsMobileImg;
        } else if (window.matchMedia('(min-width: 1000px)').matches) {
          img = MissionsImg;
        }
        addScreen('MissionsScreen', img);
        break

      default:
        break;
    }
  }

  function handleStartThirdPhase() {

    if (document.querySelector('.audioContainer')) {
      document.querySelector('.audioContainer').remove();
    }

    if (!document.getElementById('Phase-2').classList.contains('deactivate')) {
      document.getElementById('Phase-2').classList.add('deactivate');
    }

    if (document.querySelector('.SkipBtn')) {
      document.querySelector('.SkipBtn').remove();
    }

    const parent = document.querySelector('#Phase-3');

    parent.classList.remove('deactivate');

    const container = document.createElement('div');
    const p = document.createElement('p');

    const one = document.createElement('div');
    const two = document.createElement('div');

    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');

    container.classList.add('AccountContainer');

    one.classList.add('One');
    two.classList.add('Two');

    btn1.classList.add('Create');
    btn2.classList.add('Login');

    p.textContent = 'You can start using CMS, or logIn if you already have an account';

    btn1.textContent = 'Create Account';
    btn2.textContent = 'Log In';

    one.appendChild(p);
    two.append(btn1, btn2);

    container.append(one, two);

    parent.appendChild(container)

    btn1.onclick = () => {
      window.location.assign('/sign-up/');
    };

    btn2.onclick = () => {
      window.location.assign('/log-in/');
    }



  };



  var num = 0;

  function handleStartPage() {
    const p = `Here, Saif has as his portfolio a CMS he built, it's name is MandelbrotCMS.`;

      setTimeout(() => {
        handleAnimateParagraph(introVoice, p, '#Phase-1 p', handleStartCount);  
      }, 800);  

      setTimeout(() => {
        var btn = document.createElement('button');
        btn.textContent = 'Skip';
        btn.classList.add('SkipBtn');
        document.querySelector('.PortfolioPage').appendChild(btn);
        
        btn.addEventListener('click', () => {
          var phaseOneParent = document.getElementById('Phase-1');
          var phaseTwoParent = document.getElementById('Phase-2');
          
          var mandelbrotContainer = document.querySelector('.MandelbrotContainer');

          if (mandelbrotContainer) {
            mandelbrotContainer.remove();
          }

          var voices = document.querySelectorAll('audio');

          if (voices.length > 0) {
            voices.forEach(voice => {
              voice.remove();
            }) 
          }

          phaseOneParent.classList.add('deactivate');
          phaseTwoParent.classList.add('deactivate');
          setTimeout(() => {
            phaseOneParent.remove();
            phaseTwoParent.remove();
          }, 100)

          handleStartThirdPhase();

        })

      }, 1300)
  }

  function handleAskStartPage() {
    const rootElement = document.querySelector('#root');
    const ground = document.createElement('div');
    const button = document.createElement('button');

    button.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 192 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"></path></svg>`;

    rootElement.appendChild(ground);
    ground.appendChild(button);

    ground.classList.add('beforeStartGround');

    button.onclick = () => {
      ground.remove();
      handleStartPage();
    }
    
  }

  useEffect(() => {
    if (num < 1) {
      const beforePortfolio = checkBeforePortfolio();

      if (beforePortfolio) {
        handleStartPage();
      } else {
        handleAskStartPage();
      }

      num = 1;
    }
  }, [])

  return (
    <div className='PortfolioPage'>
      <div id='Phase-1' className=''>
        <div className="golden-1">
          <div>

          </div>
        </div>
        <div className="golden-2">
          <p>
            <span className="write-line"></span>
          </p>
        </div>
      </div>

      <div id="Phase-2" className='deactivate'>
        <div className="PartContainer">

        </div>
      </div>

      <div id="Phase-3" className='deactivate'>

      </div>
    </div>
  )
}

export default Portfolio;