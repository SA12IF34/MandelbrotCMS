import React, {useEffect, useState} from 'react';
import '../../../Portfolio.css';

function Paragraph({content, voice, nextValue, handleChangeParagraph}) {

  const [time, setTime] = useState(null);

  function animateContent() {
    
    

  }

  useEffect(() => {
    

    if (time && voice) {

        let contentContainer = document.getElementById('content');

        let audioEle = document.createElement('audio');
        audioEle.src = voice;

        audioEle.autoplay = true;
        document.body.appendChild(audioEle);    


        let i = 0;
        const interval = setInterval(() => {
                
            contentContainer.textContent += content[i];
            i+=1;
            if (i === content.length) {

                setTimeout(() => {
                    handleChangeParagraph(nextValue);
                    contentContainer.textContent = '';
                }, 1000)
                clearInterval(interval);
            }
        }, time)

        interval;
    } else {
        if (voice) {
            animateContent();
        }
    }
  }, [content, time])


  return (
    <div className='Paragraph'>
        <p id='content'>
        </p>
    </div> 
  )
}

export default Paragraph;