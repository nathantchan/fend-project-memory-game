const cards = document.querySelectorAll(".card");
const cardsArr = Array.from(cards);

/*
 * Create winning page without displaying
 */

const winHeading = document.createElement("span");
winHeading.innerHTML= "<h1>Congratulations! You have won the game!</h1></span>";
const score = document.createElement("p");
const numMoves = document.createElement("span");
const numSeconds = document.createElement("p");
const resetQ = document.createElement("p");
resetQ.textContent = "Reset ?";

const win = document.createElement('body');
win.appendChild(winHeading);
win.appendChild(score);
win.appendChild(numMoves);
win.appendChild(numSeconds);

openedCards = [];

function reshuffleDeck() {
  /* reshuffle the deck of cards */
  const deck = document.querySelector(".deck");
  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  }
  const shuffledCardsArr = shuffle(cardsArr);
  for (card of shuffledCardsArr) {
    card.classList = ["card"];
    deck.appendChild(card);
  }
}

reshuffleDeck();


function cardsMatch(openedCards) {
  /* Check whether two open cards match */
  const first = openedCards[0].firstElementChild.classList;
  const second = openedCards[1].firstElementChild.classList;
  return first.value == second.value;
}

function flipCard(evt) {
  if (evt.target.nodeName == 'LI') {
    evt.target.classList.add("open");
    evt.target.classList.add("show");
    openedCards.push(evt.target);

    incMoves();

    if (openedCards.length > 1) {
      if (cardsMatch(openedCards)) {
        openedCards.forEach(markAsMatched);
        if (allCardsMatch()) {
          winTheGame();
        }
        openedCards = [];
      } else {
        openedCards.forEach(markAsMisMatched);
        // Give player chance to see mismatched cards before flipping them back
        setTimeout(function() {
          openedCards.forEach(resetCard);
          openedCards = [];
        }, 750);
      }
    }
  }
}

function winTheGame() {
  // Generate the win the game page
  let stars = document.querySelector(".stars");
  let moves = document.querySelector(".moves").textContent;
  let seconds = document.querySelector(".seconds").textContent;
  let restart = document.querySelector(".restart");

  const body = document.querySelector('body');

  clearInterval(timer);

  body.remove();

  score.textContent = `Your score is`;
  score.insertAdjacentHTML('beforeend', stars.outerHTML);
  numMoves.textContent = `Your number of moves is ${moves}`;
  numSeconds.textContent = `You completed in ${seconds} seconds`;

  resetQ.appendChild(restart);
  win.appendChild(resetQ);
  document.querySelector("html").appendChild(win);
}

function reloadTheGame() {
  // Refresh the page to reload the game
  location.reload();
}
   
function incMoves() {
  // Increase the move counter
  let moves = document.querySelector(".moves").textContent;
  moves++;
  checkAndUpdateScore(moves);
  document.querySelector(".moves").textContent = moves;
}

function incSeconds() {
  // Use every second to time
  let seconds = document.querySelector(".seconds").textContent;
  seconds++;
  document.querySelector(".seconds").textContent = seconds;
}

let timer = setInterval(incSeconds, 1000);

function checkAndUpdateScore(moves) {
  // Deduct to two stars if > 20 moves. Deduct again if > 40.
  stars = document.querySelector(".stars");
  if (moves > 20 && stars.childElementCount > 2) {
    stars.firstElementChild.remove();
  }
  if (moves > 40 && stars.childElementCount > 1) {
    stars.firstElementChild.remove();
  }
}

function markAsMatched(card) {
  // If the cards match, lock the cards in the open position
  card.classList = ["card"];
  card.classList.add("match");
}

function markAsMisMatched(card) {
  // If they do not, color them temporarily.
  card.classList = ["card"];
  card.classList.add("mismatch");
}

function resetCard(card) {
  card.classList = ["card"];
}

function allCardsMatch() {
  // Check if all cards on the page have the "match" class.
  allCards = document.querySelectorAll('.card');
  for (i =  0; i < allCards.length; i++ ) {
    card = allCards[i];
    if (!card.classList.contains("match")) {
      return false;
    }
  }
  return true;
}

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

// Setup page event listeners
document.querySelector(".deck").addEventListener('click', flipCard);
document.querySelector(".restart").addEventListener('click', reloadTheGame);
