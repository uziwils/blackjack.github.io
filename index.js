const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let player1Hand = [];
let player2Hand = [];
let currentPlayer = 1;
let dealerHand = [];

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = shuffle(deck);
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function dealCard(hand) {
    hand.push(deck.pop());
}

function getHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            value += 10;
        } else if (card.value === 'A') {
            aces++;
            value += 11;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

function startGame() {
    createDeck();
    player1Hand = [];
    dealerHand = [];
    dealCard(player1Hand);
    dealCard(player2Hand);
    dealCard(dealerHand);
    dealCard(player1Hand);
    dealCard(player2Hand);
    dealCard(dealerHand);
    updateDisplay();
}

function hit() {
    if (currentPlayer === 1) {
        dealCard(player1Hand);
        updateDisplay();
        if (getHandValue(player1Hand) > 21) {
            document.getElementById('message').innerText = 'You Busted! Dealer Wins!';
            currentPlayer = 2;
        }
    } else{
        dealCard(player2Hand);
        updateDisplay();
        if (getHandValue(player2Hand) > 21) {
            document.getElementById('message').innerText = 'You Busted! Dealer Wins!';
        }
    }
}

function stand() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
        document.getElementById('message').innerText = 'Player 2\'s Turn!';
    } else {
        dealerTurn();
    }
}

function dealerTurn() {
    while (getHandValue(dealerHand) < 17) {
        dealCard(dealerHand);
    }
    updateDisplay();
    determineWinner();
}

function determineWinner() {
    let player1Value = getHandValue(player1Hand);
    let player2Value = getHandValue(player2Hand);
    let dealerValue = getHandValue(dealerHand);
    let message = '';

    if (dealerValue > 21) {
        message = 'Dealer Busted! ';
        if (player1Value <= 21) message += 'Player 1 Wins! ';
        if (player2Value <= 21) message += 'Player 2 Wins!';
    } else {
        if (player1Value > dealerValue && player1Value <= 21) {
            message += 'Player 1 Wins! ';
        } else if (player1Value === dealerValue) {
            message += 'Player 1 Ties! ';
        } else {
            message += 'Dealer beats Player 1! ';
        }

        if (player2Value > dealerValue && player2Value <= 21) {
            message += 'Player 2 Wins! ';
        } else if (player2Value === dealerValue) {
            message += 'Player 2 Ties! ';
        } else {
            message += 'Dealer beats Player 2!';
        }
    }

    document.getElementById('message').innerText = message;
}

function updateDisplay() {
    document.getElementById('player-hand').innerText = JSON.stringify(player1Hand);
    document.getElementById('dealer-hand').innerText = JSON.stringify(dealerHand);
    document.getElementById('player-score').innerText = getHandValue(player1Hand);
    document.getElementById('dealer-score').innerText = getHandValue(dealerHand);
}

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);
