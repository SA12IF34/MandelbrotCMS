function handleAddPart() {
    const paragraphContainer = document.createElement('div');
    const screenContainer = document.createElement('div');

    paragraphContainer.classList.add('ParagraphContainer');
    screenContainer.classList.add('ScreenContainer');

    const p = document.createElement('p');
    p.classList.add('Paragraph');
    paragraphContainer.appendChild(p)

    document.querySelector('.PartContainer').append(paragraphContainer, screenContainer);

}


export {handleAddPart};