
function addScreen(className, img, isVideo=false) {
    const container = document.querySelector('.ScreenContainer');

    const screen = document.createElement('div');
    screen.classList.add('Screen', className);

    if (!isVideo) {
        const imgElement = document.createElement('img');
        imgElement.src = img;
        screen.appendChild(imgElement);
    } else {
        const videoElement = document.createElement('video');
        videoElement.controls = false;
        videoElement.autoplay = true;
        videoElement.src = img;
        screen.appendChild(videoElement);
    }

    
    container.appendChild(screen);
}


export {addScreen};