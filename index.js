// somehow, a bunch of stuff got lowercased. and now im playing whack-a-mole. chances are i missed a few
// import wont work on the file:// protocol. yay
// oh i forgot to give this a good commit name. with this comment, i shall fix that

// hey! these belong in class Sudoku!

function getNewGame() {
    const screen = new HTMLHandler("k", "p", "errorLine");
    const answerKey = new Sudoku();
    const puzzle = new Sudoku(hideAmountOfNumbersRandomly(Sudoku.cloneBoard(answerKey.board), 40));
    console.log("Generated in " + answerKey.cycles + " cycles.");
    screen.populateBoard(answerKey.board, screen.answerKey);
    screen.populateBoard(puzzle.board, screen.puzzle);
    puzzle.solveBoard();
}

class Sudoku {
    constructor(board = null) {
        this.board = board, this.cycles = null;
        if (!board) {
            const generatedBoard = Sudoku.#generateBoard();
            this.board = generatedBoard[0], this.cycles = generatedBoard[1];
        }

    }

    static #blankBoard = {"1":[], "2":[], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": []};
    static #ALL_X_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    static #ALL_Y_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    static #SQUARES = [
        [[1, 1], [3, 3]], [[4, 1], [6, 3]], [[7, 1], [9, 3]],
        [[1, 4], [3, 6]], [[4, 4], [6, 6]], [[7, 4], [9, 6]],
        [[1, 7], [3, 9]], [[4, 7], [6, 9]], [[7, 7], [9, 9]]
    ];

    static cloneBoard = board => JSON.parse(JSON.stringify(board));

    static #generateBoard() { // this sucks. i know this sucks. im coping for now
        let numbers = Sudoku.cloneBoard(Sudoku.#blankBoard);
        console.log("begin generating board");

        // dont give up on a whole board
        let cycles = 0;

        for (let number in numbers) {
            console.log("populating number: " + number);
            let coordsOfNumber = numbers[number];
            let triedCoordsOfNumber = []; // track spots that didnt work out
            let attemptsToPlaceNumber = 0;

            while (coordsOfNumber.length < 9) {
                cycles++;
                attemptsToPlaceNumber++;
                //console.log("Current cycle: " + cycles);

                // early bailouts
                if (attemptsToPlaceNumber > 18) { // regenerate this number
                    clearArray(coordsOfNumber);
                    attemptsToPlaceNumber = 0;
                }

                if (cycles > 500) { 
                    console.log("Working number: " + number);
                    console.log("Infinite loop detected");
                    return [numbers, cycles];
                }

                const possibleCoords = Sudoku.#getPossibleCoords(coordsOfNumber);

                const maps = []; // build a final map while preserving history
                maps.push(Sudoku.buildCoordsMap(possibleCoords[0], possibleCoords[1]));
                maps.push(Sudoku.#removeNumbersFromMap(numbers, maps.at(-1)));
                maps.push(Sudoku.#removeCoordsFromSquares(coordsOfNumber, maps.at(-1)));
                if (triedCoordsOfNumber.length != 1)
                    maps.push(Sudoku.#removeCoordsFromMap(triedCoordsOfNumber, maps.at(-1)));
                
                // error checking
                if (maps.at(-1).length == 0) {
                    console.log("Conflict detected");
                    coordsOfNumber.shift();
                    continue;
                }

                // finally, place a coordinate
                const choice = getRandomItem(maps.at(-1));
                coordsOfNumber.push(choice);
                clearArray(triedCoordsOfNumber);
            }
        }

        return [numbers, cycles];
    }

    static buildCoordsMap(xCoords = Sudoku.#ALL_X_COORDS, yCoords = Sudoku.#ALL_Y_COORDS) { // should be private, but is a useful method
        // pair x values with y values
        let coordsMap = [];
        for (let x of xCoords) { // loops x*y times
            for (let y of yCoords) { 
                coordsMap.push([x, y]);
            }
        }
        return coordsMap;
    }

    static #removeNumbersFromMap(numbers, map) {
        let filteredMap = map; 
        for (let number in numbers) {
            const coords = numbers[number];
            filteredMap = filteredMap.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));
        }
        return filteredMap;
    }

    static #removeCoordsFromSquares(takenCoords, map, squares = Sudoku.#SQUARES) {
        let newMap = [...map];
        if (takenCoords.length == 0) {
            return newMap; // no squares eliminated yet
        }
        for (let square of squares) {
            for (let coord of takenCoords) {
                if (Sudoku.#isInSquare(coord, square)) {
                    newMap = newMap.filter(c => !Sudoku.#isInSquare(c, square)); // i *think* this does it, but im learning js as i go
                }
            }
        }
        return newMap;
    }

    static #getPossibleCoords(takenCoords, xCoords = Sudoku.#ALL_X_COORDS, yCoords = Sudoku.#ALL_Y_COORDS) {
        let possibleXCoords = [...xCoords]; 
        let possibleYCoords = [...yCoords];
        if (takenCoords.length != 0) {
            for (let coords of takenCoords) {
                if (possibleXCoords.includes(coords[0])) {
                    possibleXCoords.splice(possibleXCoords.indexOf(coords[0]), 1);
                }
                if (possibleYCoords.includes(coords[1])) {
                    possibleYCoords.splice(possibleYCoords.indexOf(coords[1]), 1);
                }
            }
        }
        return [possibleXCoords, possibleYCoords];
    }

    static #removeCoordsFromMap = (coords, map) => map.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));

    solveBoard() {
        const openCoords = Sudoku.#removeNumbersFromMap(this.board, Sudoku.buildCoordsMap()); // a coords map
        //const spotsBeingConsideredByNumber = Sudoku.cloneBoard(Sudoku.#blankBoard);
        for (let number in this.board) {
            const coordsPlacedInNumber = this.board[number];
            console.log({"Coords placed in number": coordsPlacedInNumber, "Number": number});
            const coordsToConsider = [...openCoords];
            const coordsNotRuledOut = [];
            while (coordsToConsider.length != 0) {
                const coord = coordsToConsider.pop();
                if (!Sudoku.#isAxisTaken(coord, coordsPlacedInNumber) && !Sudoku.#isNumberAlreadyInSquare(Sudoku.findMySquare(coord), coordsPlacedInNumber)) {
                    coordsNotRuledOut.push(coord);
                }
            }
            console.log({"coords not ruled out": coordsNotRuledOut, "number": number});
        }
    }

    static #isInSquare = (c, s) => c[0] >= s[0][0] && c[0] <= s[1][0] && c[1] >= s[0][1] && c[1] <= s[1][1]; // collider logic

    static findMySquare(coord, squares = Sudoku.#SQUARES) {
        for (let square of squares) {
            if (Sudoku.#isInSquare(coord, square)) { return square; }
        }
        throw new Error("coordinate is not in any square");
    }

    static #isNumberAlreadyInSquare(square, number) {
        for (let coord of number) {
            if (Sudoku.#isInSquare(coord, square))
                return true;
        }
        return false;
    }

    static #isAxisTaken(coordToConsider, number) {
        for (let coord of number) {
            if (coordToConsider[0] == coord[0] || coordToConsider[1] == coord[1])
                return true;
        }
        return false;
    }
    
}

class HTMLHandler {
    constructor(answerKeyId, puzzleId, errorsId) {
        this.answerKey = answerKeyId;
        this.puzzle = puzzleId;
        this.errorsId = errorsId;
    }

    populateBoard(board, id) {
        this.#clearBoard(id);
        for (let number in board) {
            let coords = board[number];
            for (let c of coords) {
                this.#pushNumberToCell(number, this.#convertToIdFormat(id, c));
            }
        }
    }

    reportErrors(error) {
        document.getElementById(this.errorsId).innerHTML = "Error detected. Please copy this message and keep it somewhere safe: " + error.message;
    }

    #pushNumberToCell(number, cellId) {
        document.getElementById(cellId).innerHTML = number;
    }

    #clearBoard(id) {
        const coords = Sudoku.buildCoordsMap(); // not yer jerb!
        for (let c of coords) {
            this.#pushNumberToCell(" ", this.#convertToIdFormat(id, c));
        }
    }

    #convertToIdFormat = (id, coord) => id + ":" + coord[0] + ":" + coord[1];

}

function hideAmountOfNumbersRandomly(board, amount) { // dirty messy side effects >:C
    let counter = amount;
    while (counter > 0) { // how can i optimize this?
        for (let number in board) {
            board[number].splice(getRandomItem(board[number]), 1);
            counter = counter - 1;
        }
    }
    return board;
}

function getCoordsOfAllNumbers(numbers) {  // nothing uses this yet? could be useful for solver
    let allNums = [];
    for (let number in numbers) { // dict
        for (let coord of numbers[number]) { // array
            allNums.push(coord);
        }
    }
    return allNums;
}

const errorWrapper = func => { try { func(); } catch (error) { reportErrors(error); } }

const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];

const clearArray = array => { array.splice(0, array.length); }
