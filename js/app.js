/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// TODO: difficulty levels - length ot time unmacthed cards stay open

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Global variables
const deck = document.querySelector('.deck');
let moves = 0;
let toggledCards =[];
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8; // 8 pairs wins a game - set to lower than 8 for testing

function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

// shuffle the deck
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));       // stores elements to be shuffled as a nodeList
    const shuffledCards = shuffle(cardsToShuffle);        // pass cardsToShuffle as an argument to shuffle and store as shuf
    for (card of shuffledCards) {   // for each card in the shuffledCards array, append this card to the deck element
        deck.appendChild(card);
    }

}
shuffleDeck();

// push the clickTarget , if it passes our conditionals, into the toggledCards array. last, I’m going to call our new function addToggleCard after the toggleCard invocation.
// only push into our array if less than two cards are in that array.
deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickedValid(clickTarget
        )) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) { // every time user toggles two cards, check for match
            checkForMatch(clickTarget);
            addMove();
            checkScore(); // call checkScore after every move

        }
    }
});

function isClickedValid(clickTarget) {
    return (
        clickTarget.classList.contains('card') &&      // is it a card
        !clickTarget.classList.contains('match') &&   //  does the target NOT contain the class match?
        toggledCards.length < 2 &&                    // is array's length less than 2?
        !toggledCards.includes(clickTarget)          // does toggledCards array NOT include clickTarget?
        );
}




function toggleCard(card) {      // toggle the cards
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addToggleCard(clickTarget) { // push the clickTarget into the toggledCards array
    toggledCards.push(clickTarget);
    console.log(toggledCards);
}

// if the list already has another card, check to see if the two cards match. Compare the two cards in the array using their index and className
function checkForMatch() {
    if (
        toggledCards[0].firstElementChild.className ===
        toggledCards[1].firstElementChild.className // check each element in the array against each other's child element's className property. this compares the two icons against each other.

    ) {
        toggledCards[0].classList.toggle('match'); //toggle match class on both elements
        toggledCards[1].classList.toggle('match');
        toggledCards = []; // reset the array
        matched++; // increment global variable
         if (matched === TOTAL_PAIRS) {               // call gameOver if there are 8 pairs of cards open
    gameOver();
}

    } else {                                           // length of time unmatched cards stay open. shorter the time, higher the difficulty.
        // TODO: apply CSS shake animation before
        // toggledCards[0].firstElementChild.className = 'cleared';
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 1000);

    }
}


function checkScore() {
    if (moves === 8 || moves === 16
        ) { hideStar();
    }
}

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display != 'none') { // if the li already has a display set to none, skip it
            star.style.display = 'none';
            break;
        }

    }
}
// hideStar();
// hideStar();

// time and clock
function displayTime() {
    const clock = document.querySelector('.clock'); // store span.clock in clock
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds < 10) {                                // pad seconds with a 0 if less than 10 seconds
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds};`
    }
}


function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

function stopClock() {
    clearInterval(clockId);
}

// modal window
function toggleModal() {
    const modal = document.querySelector('.modal-background');
    modal.classList.toggle('hide');
}

writeModalStats(); // write stats

function writeModalStats() {
    const timeStat = document.querySelector('.modal-time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal-moves');
    const starsStat = document.querySelector('.modal-stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display != 'none') {
            starCount++;
        }
    }
    return starCount;
}


/*
 * Modal Window Buttons
 */
document.querySelector('.modal-cancel').addEventListener('click', () => {
    toggleModal();
});


/*
 *  Reset
 */

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function resetMoves() {       // set global variable moves to 0, change the score display of moves back to 0.
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() { // reset stars to 0, loop through the starList setting each star's display property back to inline from none
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

document.querySelector('.reset-icon').addEventListener('click', resetGame);  // clicking reset button calls resetGame

document.querySelector('.modal-replay').addEventListener('click', replayGame);        // clicking modal replay button calls replayGame


function gameOver() { // stop the clock, write to modal, and toggle modal
    stopClock();
    writeModalStats();
    toggleModal();
    matched = 0;
}

function replayGame() { // resets game and closes modal
    resetGame();
    toggleModal();
}

function resetGame() {     // resets game without closing modal
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
}

/*
 * TODO: create a "Matched Box" that will hold successfully matched pairs of cards.
 * goal: move li after .match id added to it, from ul.deck to ul.cleared. so, i need to cut the li.card and paste it into the other ul.cleared. jsut changing the class will not change its location in the tree.

get and update
 *
 *
 *
 *
 *
 *
 *
 *

*/



// TODO: The game displays a star rating (from 1 to at least 3) that reflects the player's performance. At the beginning of a game, it should display at least 3 stars. After some number of moves, it should change to a lower star rating. After a few more moves, it should change to a even lower star rating (down to 1).

// TODO: when two cards do not match, apply a shake CSS animation. When array contains two cards that !=.