import React from 'react'

function Popup({handleDeleteGoal, setHandleDelete}) {

  function handleRemovePopup() {
    setHandleDelete(false);
  }

  return (
    <div className='popup'>
        <span>
            Are you really sure you want to delete this Goal?
        </span>
        <div className='popup-btns'>
            <button onClick={handleDeleteGoal}>Yes</button>
            <button onClick={handleRemovePopup}>No</button>
        </div>
    </div>
  )
}

export default Popup;