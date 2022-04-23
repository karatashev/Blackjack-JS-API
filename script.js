//DOM
let deckId = ''; //we store our deck in global variable
let playerCardOne, playerCardTwo, dealerClosedCard, dealerCardTwo, totalDealerResult, sumPlayerCards;

//first card of the dealer
let dealerCardOne = document.querySelector('.dealer-card1');


let result = document.querySelector('.result');

const dealerScore = document.querySelector('.dealer-score');
const playerScore = document.querySelector('.player-score');

const hitButton = document.querySelector('.hit');
let addPlayerCards = [];
let sumDealersCards = [];


fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6') //6 decks for blackjack
.then(res => res.json()) //parse response as JSON
.then(data => {
  console.log(data)
  deckId = data.deck_id;
  
})
.catch(err => {
  console.log(`error ${err}`)
});

// document.querySelector('.stand').addEventListener('click', standAction)

document.querySelector('.deal').addEventListener('click', dealCards)

function dealCards() {
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`
  //we are drawing 4 cards from the deck that we store his ID, 2 for the player, 2 for the dealer
  fetch(url)
    .then(res => res.json()) //parse response as JSON
    .then(data => {
      console.log(data)
      console.log(data.remaining)
      // let addPlayerCards = [];
      //images for the Cards
      document.querySelector('.player-card1').src = data.cards[0].image;
      // Dealer first card is hidden from the start!
     
      dealerCardOne.src = 'https://opengameart.org/sites/default/files/card%20back%20red.png';
      document.querySelector('.player-card2').src = data.cards[1].image;
      document.querySelector('.dealer-card2').src = data.cards[2].image;
      //Starting Players cards
      playerCardOne = convertToNum(data.cards[0].value);
      playerCardTwo = convertToNum(data.cards[1].value);
      addPlayerCards.push(playerCardOne, playerCardTwo);
      console.log(addPlayerCards);
      
      //Starting Dealers cards
      // dealerCardOne = convertToNum(data.cards[1].value);
      dealerCardTwo = convertToNum(data.cards[2].value);


      totalDealerResult = dealerCardTwo;
      dealerScore.innerText = dealerCardTwo;
 
      //sum of the first two cards
      sumPlayerCards = addPlayerCards.reduce((prevCard, curCard) => {
        return prevCard + curCard;
      }, 0);
    
      playerScore.innerText = sumPlayerCards;
    
      console.log(sumPlayerCards);
      
      //Check is player has drawn blackjack from the start
      if (sumPlayerCards === 21) {
        result.innerText = ('BLACKJACK PLAYER WINS');
      }

    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}


//HIT BUTTON ACTION
hitButton.addEventListener('click', hitAction)

function hitAction() {
  console.log('hit me');

  //To give player additional card if he don't have blackjack 
 if (sumPlayerCards <= 20) {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`) // 1 card for hit
    .then(res => res.json()) //parse response as JSON
    .then(data => {
      console.log(data)
      deckId = data.deck_id;

    //Create additional card whenever conditions are met
    const playerCards = document.querySelector('.player-cards');
    let cardElement = document.createElement('img');
    playerCards.appendChild(cardElement);

    cardElement.src = data.cards[0].image;
    cardElement.classList.add('.new-player-cards')
    cardElement = convertToNum(data.cards[0].value);
    addPlayerCards.push(cardElement);
    console.log(addPlayerCards);
    
    sumPlayerCards = addPlayerCards.reduce((prevCard, curCard) => {
      return prevCard + curCard;
    }, 0);

    playerScore.innerText = sumPlayerCards;
    console.log(sumPlayerCards)

    //To flip the closed dealer card and sum dealer result because player lost
    if (sumPlayerCards > 21) {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`) //for closed card
    .then(res => res.json()) //parse response as JSON
    .then(data => {
      console.log(data)
      deckId = data.deck_id;
      dealerCardOne.src = data.cards[0].image;
      dealerCardOne = convertToNum(data.cards[0].value);

      totalDealerResult = dealerCardTwo + dealerCardOne;
      dealerScore.innerText = totalDealerResult;

      checkForWinner();
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
  }
    
  
    // checkForWinner();
  })
  .catch(err => {
    console.log(`error ${err}`)
  });
  
    }
  }



//To convert the cards with string Values
function convertToNum(val) {
  if (val === 'ACE') {
    return 11;
  }
  else if (val === 'KING' || val === 'QUEEN' || val === 'JACK') {
    return 10;
  }
  else {
    return Number(val)
  }
}

//Checks who won
function checkForWinner() {
  if (sumPlayerCards > totalDealerResult && sumPlayerCards < 21) {
    result.innerText = ('PLAYER WINS');
  }
  else if (totalDealerResult > 21 && sumPlayerCards <= 20) {
    result.innerText = ('PLAYER WINS');
  }
  else if (sumPlayerCards === 21 && totalDealerResult < 21) {
    result.innerText = ('BLACKJACK PLAYER WINS');
  }
  else if (totalDealerResult > sumPlayerCards && totalDealerResult < 21) {
    result.innerText = ('DEALER WINS');
  }
  else if (sumPlayerCards > 21 && totalDealerResult <= 20) {
    result.innerText = ('DEALER WINS');
  }
  else if (totalDealerResult === 21 && sumPlayerCards <= 20) {
    result.innerText = ('BLACKJACK DEALER WINS');
  }
  else {
    result.innerText = ('DRAW');
  }
}


