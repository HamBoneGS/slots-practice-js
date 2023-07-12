const prompt = require("prompt-sync")();


const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 5,
    "D": 8
}

const SYMBOLS_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}

const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a despoit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount
        }
    };
}

const getNumberOfLines = (balance) => {
    while (true) {
        console.log("Cash out by sending QUIT. ")
        const lines = prompt("Choose number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);
        if (lines == "QUIT") {
            console.log("Cashed out for $" + balance.toString())
            process.exit();
        } else if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid lines selection, try again.");
        } else {
            return numberOfLines
        }
    };
}

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Place a bet amount per line. ")
        const numberBet = parseFloat(bet * lines)
        if (isNaN(numberBet) || numberBet <= 0) {
            console.log("Invalid bet amount, try again.")
        } else if (numberBet > balance) {
            console.log("You can't bet more than your balance. Your balance is $" + balance.toString() + " and you bet a total of $" + (numberBet).toString());
        } else {
            return numberBet
        }
    }
}

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [[], [], []];
    for (let i = 0; i < COLS; i++) {
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex]
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
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }
    return rows
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}

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
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings
}

let balance = deposit();
while (balance > 0) {
    const numberOfLines = getNumberOfLines(balance);
    const bet = getBet(balance, numberOfLines);
    balance = balance - bet;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won $" + winnings.toString());
    console.log("Your balance is now $" + balance.toString());
}
