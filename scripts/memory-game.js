"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);

let gameStarted = false;
let lowestScore = localStorage.getItem('lowestScore');
if(lowestScore === null || isNaN(parseInt(lowestScore))) {
  lowestScore = Infinity;
}

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

//create new div for card
//add respective color class to each card
//add event listener that calls the handleCardFunction when card is clicked
//append card to gameBoard

function createCards(colors) {
  let gameBoard = document.getElementById("game");

  for (let color of colors) {
    let card = document.createElement('div');
    card.classList.add(color, 'card-item');
    card.addEventListener('click', handleCardClick);
    gameBoard.appendChild(card);
  }
}

/** Flip a card face-up. */

//sets card background color to its first class, which is the color

function flipCard(card) {
  card.style.backgroundColor = card.classList[0];
}

/** Flip a card face-down. */

//remove background color by giving it a value of ''
//set first and second card to null
//set canFlip to true

function unFlipCard(card) {
  card.style.backgroundColor = '';
}

let firstCard = null;
let secondCard = null;
let canFlip = true;

/** Handle clicking on a card: this could be first-card or second-card. */

//declare var for current card that is being clicked
//if canFlip is false or currentCard is the first card,
  //function returns and nothing happens further
//else,
  //flip apply flipCard function to the currentCard
//if firstCard is not set,
  //set currentCard as the firstCard
//else, firstCard has been set/flipped
  //set secondCard equal to currentCard
  //set canFlip to false since we already flipped 2 cards
  //apply setTimeout function

function handleCardClick(evt) {
  let currentCard = evt.target;
  if(!canFlip || currentCard === firstCard){
    return;
  }
  flipCard(currentCard);

  if(!firstCard){
    firstCard = currentCard;
  }
  else{
    secondCard = currentCard;
    canFlip = false;
    setTimeout(checkForMatch, FOUND_MATCH_WAIT_MSECS);
  }
}

/** Check if the two flipped cards are a match. */

//if first and second card color are the same,
  //remove click event listeners for both
//else,
  //apply unFlipCard functions to both cards --> not a match
//increment score
//apply updateScore function
//reset cards
//set canFlip to true


function checkForMatch(){
  if(firstCard.classList[0] === secondCard.classList[0]){
    firstCard.removeEventListener('click', handleCardClick);
    secondCard.removeEventListener('click', handleCardClick);
  }
  else {
    unFlipCard(firstCard);
    unFlipCard(secondCard);
  }
  score++
  updateScore();
  //Reset
  firstCard = null;
  secondCard = null;
  canFlip = true;
  let unmatchedCards = document.querySelectorAll(".card-item:not(.matched)");
  if(unmatchedCards.length === 0) {
    updateLowest();
  }
}

//Restart button to reset game

//retrieve restart button from DOM
//add event listener to restart btn
  //get gameBoard var by id
  //set gameStarted to false
  //clear gameboard
  //shuffle colors arr for new cards
  //create cards based on the shuffle
  //reset score to 0
  //apply updateScore function

let initialColors = colors.slice();
let restartBtn = document.getElementById('restart');
restartBtn.addEventListener('click', function(){
  gameStarted = false;
  let gameBoard = document.getElementById('game');
  gameBoard.innerHTML = '';
  initialColors = shuffle(initialColors);
  createCards(initialColors);
  score = 0;
  updateScore();
});

//Start button to start game
document.getElementById('start').addEventListener('click', function(){
  if(!gameStarted){
    gameStarted = true;
    createCards(colors);
  }
});

//Score board

//declare score var
//create function
  //create scoreDisplay var based on html elem
  //update score

let score = 0;
function updateScore(){
  let scoreDisplay = document.getElementById('score-display');
  scoreDisplay.textContent = `Score: ${score}`;
}

//updating localStorage
//if score is greater than 0 and less than lowestScore,
  //set lowestScore to score
  //set lowetsScore to localStorage using setItem
function updateLowest(){
  if(score > 0 && score < lowestScore){
    lowestScore = score;
    localStorage.setItem('lowestScore', lowestScore);
  }
}