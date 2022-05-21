//DOM
let deckId = ""; //we store our deck in global variable
let playerCardOne,
  playerCardTwo,
  dealerClosedCard,
  dealerCardTwo,
  sumPlayerCards,
  sumDealersCards;

//first card for the dealer
let dealerCardOne = document.querySelector(".dealer-card1");

let result = document.querySelector(".result");

const dealerScore = document.querySelector(".dealer-score");
const playerScore = document.querySelector(".player-score");

//Buttons
const dealButton = document.querySelector(".deal");
const hitButton = document.querySelector(".hit");
const standButton = document.querySelector(".stand");

//we store value from the cards here
let addPlayerCards = [];
let addDealersCards = [];

fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2") //2 decks for blackjack
  .then((res) => res.json()) //parse response as JSON
  .then((data) => {
    console.log(data);
    deckId = data.deck_id;
  })
  .catch((err) => {
    console.log(`error ${err}`);
  });

dealButton.addEventListener("click", dealCards);

function dealCards() {
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`;
  //we are drawing 4 cards from the deck that we store his ID, 2 for the player, 2 for the dealer
  fetch(url)
    .then((res) => res.json()) //parse response as JSON
    .then((data) => {
      console.log(data);
      console.log(data.remaining);

      dealButton.classList.toggle("hide");
      hitButton.classList.toggle("hide");
      standButton.classList.toggle("hide");
      dealerScore.classList.toggle("hide");
      playerScore.classList.toggle("hide");

      //images for the Cards
      document.querySelector(".player-card1").src = data.cards[0].image;
      // Dealer first card is hidden from the start!

      dealerCardOne.src =
        "https://opengameart.org/sites/default/files/card%20back%20red.png";
      document.querySelector(".player-card2").src = data.cards[1].image;
      document.querySelector(".dealer-card2").src = data.cards[2].image;
      //Starting Players cards
      playerCardOne = convertToNum(data.cards[0].value);
      playerCardTwo = convertToNum(data.cards[1].value);
      addPlayerCards.push(playerCardOne, playerCardTwo);
      console.log(addPlayerCards);

      //Starting Dealers cards
      dealerCardTwo = convertToNum(data.cards[2].value);

      //push value to the dealers array
      addDealersCards.push(dealerCardTwo);
      console.log(addDealersCards);

      //sum of the dealers cards
      sumDealersCards = addDealersCards.reduce((prevCard, curCard) => {
        return prevCard + curCard;
      }, 0);

      dealerScore.innerText = sumDealersCards;
      console.log(sumDealersCards);

      //sum of the players first two cards
      sumPlayerCards = addPlayerCards.reduce((prevCard, curCard) => {
        return prevCard + curCard;
      }, 0);

      playerScore.innerText = sumPlayerCards;
      console.log(sumPlayerCards);

      //Check is player has drawn blackjack from the start
      if (sumPlayerCards === 21) {
        result.classList.toggle("hide");
        result.innerText = "BLACKJACK! PLAYER WINS";

        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`) //for closed card
          .then((res) => res.json()) //parse response as JSON
          .then((data) => {
            console.log(data);
            deckId = data.deck_id;
            dealerCardOne.src = data.cards[0].image;
            dealerCardOne = convertToNum(data.cards[0].value);
            addDealersCards.push(dealerCardOne);
            console.log(addDealersCards);

            sumDealersCards = addDealersCards.reduce((prevCard, curCard) => {
              return prevCard + curCard;
            }, 0);
            console.log(sumDealersCards);

            dealerScore.innerText = sumDealersCards;
          })
          .catch((err) => {
            console.log(`error ${err}`);
          });
      } else if (sumPlayerCards > 21) {
        result.classList.toggle("hide");
        result.innerText = "BUST! DEALER WINS";
      }
    })

    .catch((err) => {
      console.log(`error ${err}`);
    });
}

//HIT BUTTON ACTION
hitButton.addEventListener("click", hitAction);

function hitAction() {
  console.log("hit me");

  //To give player additional card if he don't have blackjack
  if (sumPlayerCards <= 20) {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`) // 1 card for hit
      .then((res) => res.json()) //parse response as JSON
      .then((data) => {
        console.log(data);
        deckId = data.deck_id;

        //Create additional card whenever conditions are met
        const playerCards = document.querySelector(".player-cards");
        let cardElement = document.createElement("img");
        playerCards.appendChild(cardElement);

        cardElement.src = data.cards[0].image;
        cardElement.classList.add(".new-player-cards");
        cardElement = convertToNum(data.cards[0].value);
        addPlayerCards.push(cardElement);
        console.log(addPlayerCards);

        sumPlayerCards = addPlayerCards.reduce((prevCard, curCard) => {
          return prevCard + curCard;
        }, 0);

        playerScore.innerText = sumPlayerCards;
        console.log(sumPlayerCards);

        //To flip the closed dealer card and sum dealer result because player lost
        if (sumPlayerCards > 21) {
          fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`) //for closed card
            .then((res) => res.json()) //parse response as JSON
            .then((data) => {
              console.log(data);
              deckId = data.deck_id;
              dealerCardOne.src = data.cards[0].image;
              dealerCardOne = convertToNum(data.cards[0].value);
              addDealersCards.push(dealerCardOne);
              console.log(addDealersCards);

              sumDealersCards = addDealersCards.reduce((prevCard, curCard) => {
                return prevCard + curCard;
              }, 0);

              // result.classList.toggle('hide');
              dealerScore.innerText = sumDealersCards;

              checkForWinner();
            })
            .catch((err) => {
              console.log(`error ${err}`);
            });
        }
      })
      .catch((err) => {
        console.log(`error ${err}`);
      });
  }
}

//STAND BUTTON ACTION
standButton.addEventListener("click", standAction);

function standAction() {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`) //for closed card
    .then((res) => res.json()) //parse response as JSON
    .then((data) => {
      console.log(data);
      deckId = data.deck_id;
      dealerCardOne.src = data.cards[0].image;
      dealerCardOne = convertToNum(data.cards[0].value);
      addDealersCards.push(dealerCardOne);
      console.log(addDealersCards);

      sumDealersCards = addDealersCards.reduce((prevCard, curCard) => {
        return prevCard + curCard;
      }, 0);
      console.log(sumDealersCards);

      dealerScore.innerText = sumDealersCards;

      if (sumDealersCards >= 17 && sumDealersCards < 21) {
        checkForWinner();
      } else if (sumDealersCards === 21) {
        result.classList.toggle("hide");
        result.innerText = "BLACKJACK! DEALER WINS";
      } else if (sumDealersCards < 17) {
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
          .then((res) => res.json()) //parse response as JSON
          .then((data) => {
            console.log(data);
            deckId = data.deck_id;
            const dealerCards = document.querySelector(".dealer-cards");
            let cardElement = document.createElement("img");
            dealerCards.appendChild(cardElement);

            cardElement.src = data.cards[0].image;
            cardElement.classList.add(".new-dealer-cards");
            cardElement = convertToNum(data.cards[0].value);
            addDealersCards.push(cardElement);
            console.log(addDealersCards);

            sumDealersCards = addDealersCards.reduce((prevCard, curCard) => {
              return prevCard + curCard;
            }, 0);

            dealerScore.innerText = sumDealersCards;
            console.log(sumDealersCards);

            checkForWinner();
          })
          .catch((err) => {
            console.log(`error ${err}`);
          });
      }
      //if dealer is more than 21 with two aces
      else {
        result.classList.toggle("hide");
        result.innerText = "PLAYER WINS";
      }
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

//To convert the cards with string Values
function convertToNum(val) {
  if (val === "ACE") {
    return 11;
  } else if (val === "KING" || val === "QUEEN" || val === "JACK") {
    return 10;
  } else {
    return Number(val);
  }
}

//Checks who won
function checkForWinner() {
  if (sumPlayerCards > sumDealersCards && sumPlayerCards < 21) {
    result.classList.toggle("hide");
    result.innerText = "PLAYER WINS";
  } else if (sumDealersCards > 21 && sumPlayerCards <= 20) {
    result.classList.toggle("hide");
    result.innerText = "PLAYER WINS";
  } else if (sumPlayerCards === 21 && sumDealersCards <= 20) {
    result.classList.toggle("hide");
    result.innerText = "BLACKJACK PLAYER WINS";
  } else if (sumDealersCards > sumPlayerCards && sumDealersCards < 21) {
    result.classList.toggle("hide");
    result.innerText = "DEALER WINS";
  } else if (sumPlayerCards > 21 && sumDealersCards <= 20) {
    result.classList.toggle("hide");
    result.innerText = "BUST! DEALER WINS";
  } else if (
    (sumDealersCards === 21 && sumPlayerCards <= 20) ||
    sumPlayerCards > 21
  ) {
    result.classList.toggle("hide");
    result.innerText = "BLACKJACK DEALER WINS";
  } else {
    result.classList.toggle("hide");
    result.innerText = "DRAW";
  }
}
