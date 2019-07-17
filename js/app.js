const body = document.querySelector("body");

const cards = document.querySelectorAll(".card");
const cardsArr = Array.from(cards);

const header = document.querySelector("header");
  
const scorePanel = document.querySelector(".score-panel");
const stars = document.querySelector(".stars");

const deck = document.querySelector(".deck");

const gamePage = document.querySelector(".game");
const winningPage = document.querySelector(".win");

let timer;

openedCards = [];

function reshuffleDeck() {
  /* reshuffle the deck of cards */
  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  }
  const shuffledCardsArr = shuffle(cardsArr);
  for (card of shuffledCardsArr) {
    card.classList = ["card"];
    deck.appendChild(card);
  }
}

function resetScorePanel() {
  document.querySelector(".seconds").textContent = 0;
  document.querySelector(".moves").textContent = 0;
  for (s of stars.children) {
    /* add back all the stars */
    s.children[0].classList.add("fa-star");
  }
}


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
    if (!openedCards.includes(evt.target)) {
      openedCards.push(evt.target);

      incMoves();
    }

    if (openedCards.length > 1) {
      // temporarily stop responding to additional clicks 
      deck.removeEventListener('click', flipCard);

      if (cardsMatch(openedCards)) {
        openedCards.forEach(markAsMatched);
        if (allCardsMatch()) {
          winTheGame();
        }
        openedCards = [];
        deck.addEventListener('click', flipCard);
      } else {
        openedCards.forEach(markAsMisMatched);
        // Give player chance to see mismatched cards before flipping them back
        setTimeout(function() {
          openedCards.forEach(resetCard);
          openedCards = [];
          deck.addEventListener('click', flipCard);
        }, 750);
      }
      
    }
  }
}

function winTheGame() {
  clearInterval(timer);

  gamePage.remove();

  body.appendChild(winningPage);
  winningPage.appendChild(scorePanel);
}

function reloadTheGame() {
  // Refresh the page to reload the game
  winningPage.remove();
  body.appendChild(gamePage);
  header.insertAdjacentElement("afterend", scorePanel);
  reshuffleDeck();
  resetScorePanel();
  clearInterval(timer);
  deck.addEventListener('click', startTimer);
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

function startTimer() {
  timer = setInterval(incSeconds, 1000);
  deck.removeEventListener('click', startTimer);
}

function checkAndUpdateScore(moves) {
  // Deduct to two stars if > 20 moves. Deduct again if > 40.
  if (moves > 20) {
    stars.children[0].children[0].classList.remove("fa-star");
  }
  if (moves > 40) {
    stars.children[1].children[0].classList.remove("fa-star");
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
deck.addEventListener('click', flipCard);
document.querySelector(".restart").addEventListener('click', reloadTheGame);

reloadTheGame();
