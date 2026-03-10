const mapContainer = document.getElementById('map-wrapper');
const characterBoard = document.getElementById("sub_base");
const tempNum = 10;

function fillBase() {
    for (let i = 0; i < tempNum; i++) {
        characterBoard.innerHTML += '<div class="character"><img src="../../assets/characters/fish.png"></div>';
    }
}

function updateCharacterOnMap(id, imgSrc, normX, normY) {
    normX = Math.max(0, Math.min(1, normX));
    normY = Math.max(0, Math.min(1, normY));

    let charDiv = document.getElementById(`map-char-${id}`);

    if (!charDiv) {
        charDiv = document.createElement('div');
        charDiv.id = `map-char-${id}`;
        charDiv.className = 'map-character';
        charDiv.innerHTML = `<img src="${imgSrc}" alt="char">`;
        mapContainer.appendChild(charDiv);
    }

    charDiv.style.left = `${normX * 100}%`;
    charDiv.style.top = `${normY * 100}%`;
}

const charPositions = {};

function simulateWebSocketData() {
    const stepSize = 0.05;

    for(let i = 1; i <= tempNum; i++) {

        if (!charPositions[i]) {
            charPositions[i] = { x: Math.random(), y: Math.random() };
        }
        let moveX = (Math.random() * 2 - 1) * stepSize;
        let moveY = (Math.random() * 2 - 1) * stepSize;

        let newX = charPositions[i].x + moveX;
        let newY = charPositions[i].y + moveY;

        charPositions[i].x = Math.max(0, Math.min(1, newX));
        charPositions[i].y = Math.max(0, Math.min(1, newY));

        updateCharacterOnMap(
            i, 
            '../../assets/characters/fish.png', 
            charPositions[i].x, 
            charPositions[i].y
        );
    }
}

function main(){
    fillBase();
    
    simulateWebSocketData();
    setInterval(simulateWebSocketData, 100); 
}

main();