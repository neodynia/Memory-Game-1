/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryVaff
    }

    return array;
}


/*
 * . If a card is clicked:
 *  -
 *  -
 *  -
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


const cards = document.querySelectorAll('.card');

const deck = document.querySelector('.deck');

// set up the event listener for a card
for (card of cards) {
    card.addEventListener('click', () => {
        console.log('Hello i am a card');
    });
}

// add the card to a *list* of "open" cards (put this functionality in another function that you call from this one). we can do this by creating an array variable and pushing our click targets into it.
let toggledCards = [];

// push the clickTarget , if it passes our conditionals, into the toggledCards array. last, I’m going to call our new function addToggleCard after the toggleCard invocation.
// only push into our array if less than two cards are in that array.
deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickedValid(clickTarget
        )) {
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) { // every time user toggles two cards, check for match
            checkForMatch(clickTarget);
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
    } else {
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 1000);

    }
}