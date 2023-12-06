// Project breakdown:

// Allow user to be able to deposit an "amount" to play with
// Allow user to choose how many lines they want to bet on
// Collect the bet amount from user
// Spin Slot
// Check if user won or lost money
// Give user winnings or take away money from user
// Play again (repeat)

// Bringing in prompt function
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLUMNS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// New style function, ive made myself start using the new style as i find it easier
const deposit = () => {
  while (true) {
    const depositAmount = prompt("How much do you want to deposit?: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log(
        "Invalid deposit amount, please make sure youre using numbers and not letters or characters.",
      );
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumLines = () => {
  while (true) {
    const lines = prompt("How many lines do you want to bet on (1-3)?: ");
    const numberoflines = parseFloat(lines);

    if (isNaN(numberoflines) || numberoflines <= 0 || numberoflines > 3) {
      console.log(
        "Invalid number of lines, remember, you can only bet on 1 to 3 lines.",
      );
    } else {
      return numberoflines;
    }
  }
};

const getbet = (balance, lines) => {
  while (true) {
    const bet = prompt("How how much you want to bet per line?: ");
    const numberbet = parseFloat(bet);

    if (isNaN(numberbet) || numberbet <= 0 || numberbet > balance / lines) {
      console.log("Invalid bet amount, try again.");
    } else {
      return numberbet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) symbols.push(symbol);
  }

  const reels = [];
  for (let i = 0; i < COLUMNS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLUMNS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printrows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const numberoflines = getNumLines();
    const bet = getbet(balance, numberoflines);
    balance -= bet * numberoflines;
    const reels = spin();
    const rows = transpose(reels);
    printrows(rows);
    const winnings = getWinnings(rows, bet, numberoflines);
    balance += winnings;
    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }
    const playAgain = prompt("Do you want to play again (y/n)? ");

    if (playAgain != "y") break;
  }
};

game();
