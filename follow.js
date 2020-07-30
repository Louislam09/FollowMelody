const grid = document.querySelector('.grid');
const result = document.querySelector('.result');
const level = document.querySelector('.level');
const followPathWrapper = document.querySelector('.follow-path');
const userPathWrapper = document.querySelector('.user-path');
const startMenu = document.querySelector('.start-menu');
const infoMenu = document.querySelector('.game-info');
const playButton = document.querySelector('.play-button');
const continueButton = document.querySelector('.continue-button');
const restartMenu = document.querySelector('.restart-menu');
const playAgainButton = document.querySelector('.play-again');
const scoreDiv = document.querySelector('.best-score');

const width = 4;
let count = 1;
let score = 0;

let paths = [];
let pathWay = [];
let userWay = [];

let canClick = false;

let sounds = [
    'sounds/A4.mp3',
    'sounds/Ab4.mp3',
    'sounds/B4.mp3',
    'sounds/Bb4.mp3',
    'sounds/C4.mp3',
    'sounds/C5.mp3',
    'sounds/D4.mp3',
    'sounds/D5.mp3',
    'sounds/Db4.mp3',
    'sounds/Db5.mp3',
    'sounds/E4.mp3',
    'sounds/E5.mp3',
    'sounds/Eb4.mp3',
    'sounds/Eb5.mp3',
    'sounds/F4.mp3',
    'sounds/G4.mp3',
    'sounds/Gb4.mp3'
];

window.addEventListener('load',()=>{
    score = getScore();
    console.log(score)
});

function createBoard(){
    for(let i=0; i<width*width; i++){
        let path =  document.createElement('div');
        path.classList.add('path');
        path.id = i;
        path.innerText = i;
        paths.push(path);
        grid.appendChild(path);
    }

    paths.forEach(path=> path.addEventListener('click',clickPath));
}

function playSound(id){
    let sound = new Audio(sounds[id]);
    sound.currectTime = 0;
    sound.play()
}

function stopSound(id){
    let sound = new Audio(sounds[id]);
    sound.pause()
}

function randomId(){
    return parseInt(paths[Math.floor(Math.random()*paths.length)].id)
}

async function markPath(){
    let lastNumber = 0;
    for (let i = 0; i < count; i++) {
        
        let randomNumber =  randomId();
        while(randomNumber === lastNumber) randomNumber =  randomId();
        lastNumber = randomNumber;


        pathWay.push(randomNumber);
        paths[randomNumber].classList.add('chose-path');
        playSound(randomNumber);

        
        await new Promise((resolve) => setTimeout(resolve,count*200));
        setTimeout(()=>{
            paths[randomNumber].classList.remove('chose-path');
            stopSound(randomNumber);
        },100)

        if(i + 1 === count) canClick = true;
    }
}

function clickPath(e){
    if(canClick){
        let pathclickedId = parseInt(e.target.id);
        userWay.push(pathclickedId);
        paths[pathclickedId].classList.add('currect-path');
       
        playSound(pathclickedId);
    
        setTimeout(()=>{
            paths[pathclickedId].classList.remove('currect-path');
            stopSound(pathclickedId);
        },600)
    
        if(userWay.length === count){
            correctWay()
        }
    }
}

function correctWay(){
    let match = pathWay.every((id,index)=>pathWay[index] === userWay[index]);

    if(match){
        canClick = false;
        count++;
        saveScore(count);
        result.innerText = 'Status: Nice!';
        level.innerText = `Level ${count}`;
        level.classList.add('pop-level');

        setTimeout(()=>{
            level.classList.remove('pop-level');
            setTimeout(() => {
                result.innerText = 'Status: Wainting!';
                userWay = [];
                pathWay = [];
                markPath();
                
            }, 300);
        },2000)
        
    }else{
        vibrateAtWrong();
        saveScore(count);

        result.innerText = 'Status: Wrong!';
        showResult()
        pathWay.forEach((path,index) => {
            paths[path].classList.add('correct-path');
        })

        userWay.forEach((path,index) => {
            paths[path].classList.add('wrong-path');

        })
        setTimeout(()=>{
            showElement(restartMenu);
        },1000)
    }
}

function showResult(){

    scoreDiv.innerText = `Best Score: ${getScore()}`;
    
    pathWay.forEach((path,index) => {
        let span = document.createElement('span');
        span.innerText = path;
        followPathWrapper.appendChild(span);
    })
    
    userWay.forEach((path,index) => {
        let span = document.createElement('span');
        span.innerText = path;
        userPathWrapper.appendChild(span);
    })
}

function startGame(){
    hideElement(infoMenu);
    showElement(result);
    showElement(level);
    showElement(followPathWrapper);
    showElement(userPathWrapper);
    setTimeout(()=> markPath(),1000);
}

function showInfoMenu(){
    hideElement(startMenu);
    showElement(infoMenu);
}

function restartGame(){
    hideElement(restartMenu);

    count = 1;
    
    level.innerText = `Level: ${count}`;
    result.innerText = 'Status: Wainting!';
    
    paths = [];
    pathWay = [];
    userWay = [];

    grid.innerText = '';
    followPathWrapper.innerText = 'Correct:';
    userPathWrapper.innerText = 'Your:';
    
    createBoard();
    setTimeout(()=> markPath(),1000);
}

function vibrateAtWrong(){
    if(navigator){
        navigator.vibrate([2000])
    }
}

function saveScore(score){
    if(localStorage){
        let scoreStorage = getScore();
        if(score > parseInt(scoreStorage) ){
            localStorage.setItem('followScore',score);
            score = parseInt(count);
        }
    }

}

function getScore(){
    let scoreStorage = localStorage.getItem('followScore');
    if(localStorage){
        if(scoreStorage === null || scoreStorage === undefined){
            scoreStorage = 0;
        }else{
            scoreStorage = parseInt(scoreStorage);
        }
    }
    return scoreStorage
}

function lauchGame(){
    hideElement(infoMenu);
    hideElement(restartMenu);
    hideElement(result);
    hideElement(level);
    hideElement(followPathWrapper);
    hideElement(userPathWrapper);
    showElement(startMenu);
} 

function showElement(element){
    element.style.visibility = 'visible';
}

function hideElement(element){
    element.style.visibility = 'hidden';
}

createBoard()
lauchGame();

playButton.addEventListener('click',showInfoMenu);
continueButton.addEventListener('click',startGame);
playAgainButton.addEventListener('click',restartGame);




















