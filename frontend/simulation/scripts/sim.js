const mapContainer = document.getElementById('map-wrapper');
const characterBoard = document.getElementById("sub_base");
const leaderboard = document.getElementById('leader');
const popup = document.getElementById('popup');
const tempNum = 20;
let img_size = document.getElementById('m_image');

//debug list
let characters_debug = ["ayna", "apa", "gyerekek","minőségtelen lacika","mákos tészta","MAMA"];


var width
var height

let characters = []

// function fillBase() {
//     for (let i = 0; i < tempNum; i++) {
//         characterBoard.innerHTML += '<div class="character"><img src="../../assets/characters/fish.png"></div>';
//     }
// }


// az inspectorhoz hozzáadni a karaktert
function add_character_board(id, imgSrc) {
    const characterLooker = document.createElement('div');
    characterLooker.id = `character-char-${id}`;
    characterLooker.className = 'character';
    characterLooker.innerHTML = `<img src="${imgSrc}" alt="char">`;

    characterBoard.appendChild(characterLooker);

    return characterLooker;
}

function normalizeToImage(rawX, rawY) {
    const normX = Math.max(0, Math.min(1, rawX / width));
    const normY = Math.max(0, Math.min(1, rawY / height));
    return { normX, normY };
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
    popup.style = "visibility: visible";
    listWinners(characters_debug);
}


// kiszedjük a karaktereket a mappokról, szóval megmurdáltak
function remove_character(id) {
    const index = characters.findIndex(charArr => charArr[1].id === `character-char-${id}`);
    
    if (index !== -1) {
        characters[index][0].remove();
        characters[index][1].remove();
        characters.splice(index, 1);
    }
}

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

    console.log(characters)
    }

    charDiv.style.left = `${normX * 100}%`;
    charDiv.style.top = `${normY * 100}%`;
}

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

function main(){

    width = img_size.clientWidth;
    height = img_size.clientHeight;
    simulateWebSocketData();
    setInterval(simulateWebSocketData, 100); 
}

main();