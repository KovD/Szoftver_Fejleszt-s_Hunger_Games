const mapContainer = document.getElementById('map-wrapper');
const characterBoard = document.getElementById("sub_base");
const leaderboard = document.getElementById('leader');
const popup = document.getElementById('popup');
const prize = document.getElementById('winamount');
const tempNum = 10;
let img_size = document.getElementById('m_image');
const mapContainerElement = document.querySelector('.map');

//debug list
let characters_debug = ["ayna", "apa", "gyerekek","minőségtelen lacika","mákos tészta","MAMA"];


var width
var height
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

let characters = []

// function fillBase() {
//     for (let i = 0; i < tempNum; i++) {
//         characterBoard.innerHTML += '<div class="character"><img src="../../assets/characters/fish.png"></div>';
//     }
// }

//---------------------------------------------------Websocket_is_that_easy-------------------------
const ws = new WebSocket('I_have_babies');

ws.onmessage = (event) => {
    return
};


//---------------------------------------------------Karakter mozgási szimuláció----------------------------------------
// az inspectorhoz hozzáadni a karaktert
function add_character_board(id, imgSrc) {
    const characterLooker = document.createElement('div');
    characterLooker.id = `character-char-${id}`;
    characterLooker.className = 'character';
    characterLooker.innerHTML = `<img src="${imgSrc}" alt="char">`;

    characterBoard.appendChild(characterLooker);

    return characterLooker;
}

//karakter törlése
function remove_character(id) {
    const index = characters.findIndex(charArr => charArr[1].id === `character-char-${id}`);
    
    if (index !== -1) {
        characters[index][0].remove();
        characters[index][1].remove();
        characters.splice(index, 1);
    }
}


mapContainerElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    mapContainerElement.style.cursor = 'grabbing';
    startX = e.pageX - mapContainerElement.offsetLeft;
    startY = e.pageY - mapContainerElement.offsetTop;
    scrollLeft = mapContainerElement.scrollLeft;
    scrollTop = mapContainerElement.scrollTop;
});

mapContainerElement.addEventListener('mouseleave', () => {
    isDragging = false;
    mapContainerElement.style.cursor = 'grab';
});

mapContainerElement.addEventListener('mouseup', () => {
    isDragging = false;
    mapContainerElement.style.cursor = 'grab';
});

mapContainerElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - mapContainerElement.offsetLeft;
    const y = e.pageY - mapContainerElement.offsetTop;
    const moveX = x - startX; 
    const moveY = y - startY;
    mapContainerElement.scrollLeft = scrollLeft - moveX;
    mapContainerElement.scrollTop = scrollTop - moveY;
});

function add_character_sim_face(id, imgSrc) {
    charDiv = document.createElement('div');
    charDiv.id = `map-char-${id}`;
    charDiv.className = 'map-character';
    charDiv.innerHTML = `<img src="${imgSrc}" alt="char">`;
    mapContainer.appendChild(charDiv);

    return charDiv
}

// karakterek mozgásának frissítése.. ide jön majd a kapott koordináta
function updateCharacterOnMap(id, imgSrc, x, y) {
    let { normX, normY } = normalizeToImage(x,y)

    let charDiv = document.getElementById(`map-char-${id}`);

    if (!charDiv) {
    charDiv = add_character_sim_face(id, imgSrc);
    characters.push([charDiv, add_character_board(id, imgSrc)]);
    }

    charDiv.style.left = `${normX * 100}%`;
    charDiv.style.top = `${normY * 100}%`;
}

//normalizóció
function normalizeToImage(rawX, rawY) {
    const normX = Math.max(0, Math.min(1, rawX / width));
    const normY = Math.max(0, Math.min(1, rawY / height));
    return { normX, normY };
}
//-----------------------------------------Win management--------------------------------------------------
function writePrize(prizeWon) {
    if (prizeWon <= 0) {
        prize.innerHTML = `<p>You have won NOTHING!!!4</P>`;
    } else {
        prize.innerHTML = `<p>You have won: ${prizeWon} Ft(?)</P>`;
    }
}

function listWinners(character_list) {

    for (i = 0; i < character_list.length; i++) {
        const characterOnLeaderboard = document.createElement('div');
        characterOnLeaderboard.classList = 'leader_character'
        characterOnLeaderboard.innerHTML += `<p>${character_list[i]}</p>`

        leaderboard.appendChild(characterOnLeaderboard)
    }

}

function activateWinPopup(character_list){
    writePrize(0);
    popup.style = "visibility: visible";
    listWinners(characters_debug);
}
//------------------------------------------------------------------------------------------------------

const charPositions = {};

function simulateWebSocketData() {
    const stepSize = 15;

    for(let i = 1; i <= tempNum; i++) {
        if (!charPositions[i]) {
            charPositions[i] = { x: Math.random() * width, y: Math.random() * height };
        }
        
        let moveX = (Math.random() * 2 - 1) * stepSize;
        let moveY = (Math.random() * 2 - 1) * stepSize;

        let newX = charPositions[i].x + moveX;
        let newY = charPositions[i].y + moveY;

        charPositions[i].x = Math.max(0, Math.min(width, newX));
        charPositions[i].y = Math.max(0, Math.min(height, newY));

        updateCharacterOnMap(
            i, 
            '../../assets/characters/fish.png', 
            charPositions[i].x, 
            charPositions[i].y
        );
    }
}

class EventManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.queue = [];
        this.isShowing = false;
    }

    showEvent(message) {
        this.queue.push(message);
        if (!this.isShowing) {
            this.processNext();
        }
    }

    processNext() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const msg = this.queue.shift();

        const eventEl = document.createElement('div');
        eventEl.className = 'event-message';
        eventEl.innerText = msg;
        this.container.appendChild(eventEl);

        setTimeout(() => eventEl.classList.add('show'), 10);

        setTimeout(() => {
            eventEl.classList.remove('show');

            setTimeout(() => {
                eventEl.remove();
                this.processNext(); 
            }, 500); 
            
        }, 2000);
    }
}

const events = new EventManager('event-container');


function main(){

    width = img_size.clientWidth;
    height = img_size.clientHeight;
    setInterval(simulateWebSocketData, 100);
    events.showEvent("lacika buzi");
    events.showEvent("Magyar Szeksz")
}

main();