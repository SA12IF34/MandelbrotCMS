import React, {useState, useRef, useEffect} from 'react';
import {createRoot} from 'react-dom/client'
import { MdDraw, MdOutlineFormatBold, MdOutlineClose, MdDone } from 'react-icons/md';
import {IoReturnUpBack} from 'react-icons/io5';
import {api} from '../App';

import ObjectSearch from '../components/ObjectSearch';

function CreateNote() {

  // Data to be sent to server
  const [relatedObj, setRelatedObj] = useState([]);
  const [drawnContent, setDrawnContent] = useState(null);
  const nameRef = useRef();
  const contentRef = useRef();
  
  const data = {}

  // Variables
  var isMouseDown=false;
  var canvasContainer = document.createElement('div')
	var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var imgContainer = document.createElement('div');
  var canvasCreated = false;
  var currentSize = 5;
	var currentColor = "rgb(25, 25, 25)";
	var currentBg = "white";
  var canvasHistory = [];
  
  var boldOn = false;

  const [relatedObjName, setRelatedObjName] = useState('');
  const [objSearchValue, setObjSearchValue] = useState('');
  const [objSearchOpen, setObjSearchOpen] = useState(false);


  // Functions
  function createCanvas() {
    const paper = document.querySelector('.create-note-page .paper');

    if (paper.contains(imgContainer)) {
      handleDelDraw();
    }

		canvas.width = parseInt(paper.clientWidth*0.8);
		canvas.height = parseInt(250);
		ctx.fillStyle = currentBg;

    canvasContainer.id = 'canvas';

    var finishBtn = document.createElement('button');
    var cancelBtn = document.createElement('button');
    var backBtn = document.createElement('button');

    finishBtn.id = 'finish';
    cancelBtn.id = 'cancel';
    backBtn.id = 'back';

    createRoot(finishBtn).render(<MdDone />);
    createRoot(cancelBtn).render(<MdOutlineClose />);
    createRoot(backBtn).render(<IoReturnUpBack />);

    finishBtn.onclick = handleFinishDraw;
    cancelBtn.onclick = handleCancelDraw;
    backBtn.onclick = handleBackStepDraw;

    canvasContainer.append(finishBtn, cancelBtn, backBtn);

    canvasContainer.appendChild(canvas);
    paper.appendChild(canvasContainer);
    canvasCreated = true;
    canvasHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

  }


  function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
	}

  function mousedown(canvas, evt) {
			isMouseDown=true
			var currentPosition = getMousePos(canvas, evt);
			ctx.moveTo(currentPosition.x, currentPosition.y)
			ctx.beginPath();
			ctx.lineWidth  = currentSize;
			ctx.lineCap = "round";
			ctx.strokeStyle = currentColor;

	}

  function mousemove(canvas, evt) {

			if(isMouseDown){
				var currentPosition = getMousePos(canvas, evt);
				ctx.lineTo(currentPosition.x, currentPosition.y)
				ctx.stroke();
				// store(currentPosition.x, currentPosition.y, currentSize, currentColor);
			}
	}

  function mouseup() {
			isMouseDown=false;
      var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvasHistory.push(canvasData);
      console.log(n)
	}

  function handleFinishDraw() {
    
    if (canvasHistory.length === 1) {
      alert('Please draw/write something or cancel it.');
      return;
    }
    
    var dataUrl = canvas.toDataURL('image/png');
    
    // var imgContainer = document.createElement('div');
    imgContainer.id = 'img';
    
    var delBtn = document.createElement('button');
    delBtn.id = 'del';
    createRoot(delBtn).render(<MdOutlineClose />);
    delBtn.onclick = handleDelDraw;

    imgContainer.appendChild(delBtn);
    
    var imgEle = document.createElement('img');
    imgEle.src = dataUrl;

    imgContainer.appendChild(imgEle);
  
    var paper = document.querySelector('.create-note-page .paper');
    paper.removeChild(canvasContainer);

    paper.appendChild(imgContainer);


    setDrawnContent(dataUrl);
    canvasCreated = false;
    canvasHistory = [];

    var sel = window.getSelection();
    sel.selectAllChildren(document.querySelector('.paper > div'));
    sel.collapseToEnd();
  }

  function handleDelDraw() {
    var paper = document.querySelector('.create-note-page .paper');
    paper.removeChild(imgContainer);

    imgContainer.innerHTML = ``;

    setDrawnContent(null);

    var sel = window.getSelection();
    sel.selectAllChildren(document.querySelector('.paper > div'));
    sel.collapseToEnd();
  }

  function handleCancelDraw() {
    var paper = document.querySelector('.create-note-page .paper');
    paper.removeChild(canvasContainer);

    canvasCreated = false;
    canvasHistory = [];

    var sel = window.getSelection();
    sel.selectAllChildren(document.querySelector('.paper > div'));
    sel.collapseToEnd();
  }

  function handleBackStepDraw() {
    if (canvasHistory.length === 0) {
      return;

    } else if (canvasHistory.length === 1) {
      ctx.putImageData(canvasHistory[0], 0, 0)

    } else if (canvasHistory.length > 1) {
      var prevData = canvasHistory[canvasHistory.length-2];
      ctx.putImageData(prevData, 0, 0);
      canvasHistory.pop()

    }
  }

  canvas.addEventListener('mousedown', (e) => {mousedown(canvas, e)});
  canvas.addEventListener('mousemove', (e) => {mousemove(canvas, e)});
  canvas.addEventListener('mouseup', mouseup);

  function handleSetBold(arbitrary) {
    var boldBtn = document.querySelector('.create-note-page .tools > button:nth-child(2)');


    if (arbitrary===true) {
      boldOn = false;
      boldBtn.classList.remove('bold-on');
      return;
    }

    if (boldOn) {
      boldOn = false;
      boldBtn.classList.remove('bold-on');

    } else {
      boldOn = true;
      boldBtn.classList.add('bold-on');
    }

    document.execCommand('bold');

    return;

  }

  function handleRemoveRelatedObj() {
    setRelatedObj([]);
    setRelatedObjName('');
  }

  async function handleSubmitData() {
    try {
      var nameVal = nameRef.current.value;
      var contentVal = contentRef.current.innerHTML;
      
      if (nameVal === '' || contentVal === '') {
        alert('Please enter note name and content.');
        return;
      }
      data['name'] = nameVal;
      data['content'] = JSON.stringify(contentVal);
      data['drawn_content'] = drawnContent;
      relatedObj.length === 2 ? data[relatedObj[0]] = relatedObj[1] : '';
      
      const response = await api.post('create/', data);

      if (response.status === 201) {
        const {id} = await response.data;

        window.location.assign(`/notes/notes/${id}/`)
      }


    } catch (error) {
      
    }
  }


  // Initialization
  let n = 0;
  useEffect(() => {
    if (n < 1) {

      if (window) {
        document.querySelector('title').textContent = 'Create Note';

        var drawBtn = document.querySelector('.create-note-page .tools > button:nth-child(1)');
        var boldBtn = document.querySelector('.create-note-page .tools > button:nth-child(2)');

        drawBtn.onclick = createCanvas;
        boldBtn.onclick = handleSetBold;

        document.querySelector('.paper > div').addEventListener('input', (e) => {
          if (e.data === null) {
            if (e.target.textContent.length === 1 && !(e.target.firstElementChild && e.target.firstElementChild.tagName === 'B')) {
              handleSetBold(true);
            }   
          }
        })
      }
      n=1;
    }
  }, [])

  useEffect(() => {
    if (window) {
      var objRelationsBtns = document.querySelectorAll('.create-note-page .relation > div > button');
      
      objRelationsBtns.forEach(btn => {
        btn.onclick = () => {
          setObjSearchValue(btn.id);
          var condition = btn.parentElement.classList.contains('search-opened');
          setObjSearchOpen(!condition);
          btn.parentElement.classList.toggle('search-opened')
        }
      })

    }
  }, [relatedObj])


  // Rendering
  return (
    <div className='create-note-page page'>
      <div className='play-ground'>
        <div className="tools">
          <button>
            <MdDraw />
          </button>
          <button>
            <MdOutlineFormatBold />
          </button>
        </div>
        <div className="paper">
          <input ref={nameRef}  multiple={false} placeholder='Note Name' maxLength={100} />
          <div ref={contentRef} contentEditable>

          </div>
        </div>
        <div className="relation">
          {relatedObj.length !== 2 ? (
            <>
              <h3>Relate to</h3>
              <div className='obj-btns'>
                <button id='project' >Project</button>
                <button id='learning_material' >Course</button>
                <button id='tasks_list' >Missions List</button>
                <button id='goal' >Goal</button>
              </div>
              {objSearchOpen && (
                  <ObjectSearch setRelatedObjName={setRelatedObjName} objectToSearch={objSearchValue} setObjSearchOpen={setObjSearchOpen} setRelatedObj={setRelatedObj} data={data} />
              )}

            </>
          ): (
            <>
              <h3>Related to</h3>
              <div className='related-obj'>
                {relatedObjName}
              </div>
              <button onClick={handleRemoveRelatedObj}>
                <MdOutlineClose />
              </button>
            </>
          )}
        </div>
      </div>
      <button onClick={handleSubmitData} className='create-note-btn btn-main-style'>Create</button>
    </div>
  )
}

export default CreateNote;