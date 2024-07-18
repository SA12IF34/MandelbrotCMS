import {useEffect} from 'react'

function Paper({write, noteName, noteContent, noteDrawnContent, nameRef, contentRef}) {

  var num = 0;
  useEffect(() => {
    if (num < 1) {
        noteContent ? document.querySelector('.paper > div').innerHTML = JSON.parse(noteContent) : '';
        document.querySelector('.paper > input') 
        ? document.querySelector('.paper > input').value = noteName 
        : document.querySelector('.paper > h1').textContent = noteName;
        
        if (write) {
          var sel = window.getSelection();
          sel.selectAllChildren(document.querySelector('.paper > div'));
          sel.collapseToEnd();
        }

        num = 1;
    }
  })

  return (
    <div className='paper'>
        {write ? (<input ref={nameRef} multiple={false} maxLength={100}/>) : (<h1>Note Name</h1>)}
        <div ref={contentRef} contentEditable={write ? true: false} autoFocus={write ? true: false}>
            
        </div>
        {noteDrawnContent && (
            <div id='img'>
                <img src={noteDrawnContent} alt={noteName} />
            </div>
        )}
    </div>
  )
}

export default Paper;