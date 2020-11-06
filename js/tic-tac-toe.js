//////////////////////////
/* Mapped Page Elements */
//////////////////////////
const elMessage = document.getElementById('message'); // The message element
const elResetButton = document.getElementById('resetButton'); // The resetButton element
elResetButton.addEventListener('click', resetGame);

////////////////////
/* Game Variables */
////////////////////
let currentMove; // 0 is 'O' and 1 is 'X'
let winningPlayer = null;
/* A handy list of all of the spot names for adding/removing eventHandlers */
let spotArray = ['r1c1', 'r1c2', 'r1c3', 'r2c1', 'r2c2', 'r2c3', 'r3c1', 'r3c2', 'r3c3'];
/* The total # of moves. We track this since the minimum # of moves to win is 5. */
let numMoves = 0;
/* Initialize an object that stores the state of the board spots */
/* We eventually test the properties in this object against the win conditions below. */
let allSpots = {
  r1c1:null, r1c2:null, r1c3:null,// Row One
  r2c1:null, r2c2:null, r2c3:null,// Row Two
  r3c1:null, r3c2:null, r3c3:null // Row Three
};
/* winConditions[] holds the various ways a player can win. */
/* Each condition holds a reference to three properties in the allSpots object. */
let winConditions = [];

/* Horizontal Win Conditions */
winConditions[0] = ['r1c1', 'r1c2', 'r1c3'];
winConditions[1] = ['r2c1', 'r2c2', 'r2c3'];
winConditions[2] = ['r3c1', 'r3c2', 'r3c3'];
/* Vertical Win Conditions */
winConditions[3] = ['r1c1', 'r2c1', 'r3c1'];
winConditions[4] = ['r1c2', 'r2c2', 'r3c2'];
winConditions[5] = ['r1c3', 'r2c3', 'r3c3'];
/* Diagonal Win Conditions */
winConditions[6] = ['r1c1', 'r2c2', 'r3c3'];
winConditions[7] = ['r1c3', 'r2c2', 'r3c1'];

/////////////////////////
/* Game Play Functions */
/////////////////////////
/* The function that is attached by the setClickHandlers and removeClickHandlers */
function spotClick() {
  clickSpot(this);
}

/* Uses the spotArray to iterate through the spot IDs and adding click eventListeners. */
function setClickHandlers() {
  let spotNow;
  console.log('spotArray:',spotArray);
  spotArray.forEach(function(spot){
    spotNow = document.getElementById(spot);
    spotNow.addEventListener('click', spotClick);
  });
}
setClickHandlers();

/* Uses the spotArray to iterate through the spot IDs and removing click eventListeners. */
function removeClickHandlers() {
  let spotNow;
  spotArray.forEach(function(spot){
    spotNow = document.getElementById(spot);
    spotNow.removeEventListener('click', spotClick);
  });
}

/* getCurrentPlayerName(currentMove) returns 'X' or 'O' based on currentMove value. */
function getCurrentPlayerName(currentMove) { return currentMove ? 'X' : 'O' }

/* chooseFirst() runs on page load (and after a completed game) to determine the first player. */
function chooseFirst() {
  currentMove = Math.round(Math.random());
  elMessage.innerText = `${getCurrentPlayerName(currentMove)} goes first!`;
}
/* We have to randomly determine who goes first when the page loads. */
chooseFirst();

/* changePlayer(attrPlayer) changes the player and updates the message log. */
function changePlayer(attrPlayer) {
  attrPlayer === 1 ? currentMove = 1 : currentMove = 0;
  elMessage.innerText = `The current player is now: ${getCurrentPlayerName(attrPlayer)}`;
}

/* clickSpot fires when a playable area is clicked */
function clickSpot(attrSpot) {
  /* First lets get the element that was clicked... */
  let thisSpot = document.getElementById(attrSpot.id);
  /* Increment up the number of moves that have been made */
  numMoves += 1;
  /* In this if statement we don't actually care if the turn is for 1/"X"              */
  /* We look for 1 simply to know to flip everything to the opposite player            */
  /* Which, now that I think about it, should be abstracted away to it's own function. */
  if (currentMove === 1) {
    // Change the allSpots object
    allSpots[thisSpot.id] = 'X';
    // Change the view
    thisSpot.innerText = 'X';
    // Change the player
    changePlayer(0);
  } else {
    // Change the allSpots object
    allSpots[thisSpot.id] = 'O';
    // Change the view
    thisSpot.innerText = 'O';
    // Change the player
    changePlayer(1);
  }
  /* Removing the eventListener prevents a move in a spot that's already chosen. */
  attrSpot.removeEventListener('click', spotClick);
  /* If 5 or more moves have been made check to see if either player has won. */
  /* This is done mainly to less resource intensive. */
  numMoves >= 5 ? checkWinner() : false;
}

/* compareThings compares the three values within a WinCondition */
/* If all three are equal it returns 'true', otherwise 'false' */
function compareThings(attrSpots) {
  return (
    (allSpots[attrSpots[0]] && allSpots[attrSpots[1]] && allSpots[attrSpots[2]]) ? // Check if the values are 'null'
      (((allSpots[attrSpots[0]] === allSpots[attrSpots[1]]) && (allSpots[attrSpots[1]] === allSpots[attrSpots[2]])) ? // Test equality
        // Remember: if A = B and B = C then A = C
        setWinner(allSpots[attrSpots[0]]) : // 'true' if true
        false) // 'false' if false
      :
      false // If the values are unequal or any of the values were 'null' then return 'false'
  );
}

/* checkWinner() uses the various winConditions to see if a player has won. */
function checkWinner() {
  winConditions.forEach(function(attrCondition) {
    compareThings(attrCondition);
  });
  /* If a winning player has been found we end the game. */
  if (winningPlayer) {
    removeClickHandlers(); // Disable clicks on all of the remaining spots...
    elMessage.innerHTML = `Game Over! ${winningPlayer} is the winner!`; // Display a message with a reset button.
  }
}

/* setWinner() sets winningPlayer to "X" or "O" essentially ending the game in checkWinner() */
function setWinner(attrWinner) {
  winningPlayer = attrWinner;
  return true;
}

/* resetGame() initializes the game on page load and once the game is won. */
// eslint-disable-next-line no-unused-vars
function resetGame() {
  winningPlayer = null;
  /* Reinitialize all of the board spots */
  allSpots = {
    r1c1:null, r1c2:null, r1c3:null,// Row One
    r2c1:null, r2c2:null, r2c3:null,// Row Two
    r3c1:null, r3c2:null, r3c3:null // Row Three
  };

  let spotResetText;
  spotArray.forEach(function(spot){
    spotResetText = document.getElementById(spot);
    spotResetText.innerText = '';
  });

  /* Reset the total # of moves to 0 */
  numMoves = 0;
  /* In theory the 'Game has been reset!' message will never be seen... */
  /* ...but I think it makes the code make more sense, so it stays. */
  elMessage.innerText = 'Game has been reset!';
  /* We have to randomly determine who goes first again. Seems fair. */
  chooseFirst();
  /* Finally, reset all of the click eventListeners. */
  setClickHandlers();
}
