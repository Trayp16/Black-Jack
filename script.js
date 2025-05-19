// These store the current total score for
// the dealer and the player.
let dealerSum = 0;
let yourSum = 0;

// These track how many Aces each player
// has. Aces can be worth 1 or 11, so we'll
// use this to adjust scores later.
let dealerAceCount = 0;
let yourAceCount = 0;

// hidden is the dealer's hidden card.
// deck is the full deck of cards.
let hidden;
let deck;

// This variable keeps track of whether the
// player is allowed to click "Hit." Once they
// go over 21 or click "Stay," hitting is no
// longer allowed.
let canHit = true; //allows the player (you) to draw while yourSum <= 21

// When the page loads, it runs these three
// functions:
// 1. buildDeck(): Creates a 52-card deck.
// 2. shuffleDeck(): Randomly mixes the deck.
// 3. startGame(): Deals the initial cards and
//    starts the game
window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

// Builds all 52 cards: e.g. "A-C", "2-D", ..., "K-S"
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

// Randomly shuffles the deck using a simple
// algorithm.
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

// The dealer's first card is stored and hidden.
// We update the dealer's sum and count any Aces.
function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);

    // The dealer continues drawing cards until their total
    // is at least 17.
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    // The player gets two cards displayed on the screen.
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    console.log(yourSum);

    // Sets up event
    // listeners for the Hit
    // and Stay buttons.
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

// If you're not allowed to hit (already over 21 or stayed), do nothing.
function hit() {
    if (!canHit) {
        return;
    }

    // Player draws one card.
    // Update score and Ace count.
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    // If score > 21 even after Ace adjustment, you're busted and can't
    // hit anymore.
    if (reduceAce(yourSum, yourAceCount) > 21) { // A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }
}

// Finalizes scores with Ace
// adjustments.
function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    // Reveals the dealer's hidden card.
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    // Compares final scores and sets a
    // message in the DOM.
    if (yourSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You Win!";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

// Returns the numeric value of a card.
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

// Checks if a card is an Ace.
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

// If total is over 21, reduce the value of
// Aces from 11 to 1.
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}