
function partTransition(parent, container, handleSetPart, className) {
    parent.classList.add(className);
    container.classList.add(className);
    
    setTimeout(() => {
      container.replaceChildren();

      container.classList.remove(className);
      handleSetPart(className.replace('Transition', ''));
    }, 1050)
}



export {partTransition};
