// somehow, a bunch of stuff got lowercased. and now im playing whack-a-mole. chances are i missed a few
// import wont work on the file:// protocol. yay

const ALL_X_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ALL_Y_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const SQUARES = [
    [[1, 1], [3, 3]], [[4, 1], [6, 3]], [[7, 1], [9, 3]],
    [[1, 4], [3, 6]], [[4, 4], [6, 6]], [[7, 4], [9, 6]],
    [[1, 7], [3, 9]], [[4, 7], [6, 9]], [[7, 7], [9, 9]]
];

function getNewGame() {
    const screen = new HTMLHandler("k", "p", "errorLine");
    const board = generateBoard();
    const answerKey = board[0], cycles = board[1];
    const puzzle = hideAmountOfNumbersRandomly(JSON.parse(JSON.stringify(answerKey)), 40); 
    console.log("Generated in " + cycles + " cycles.");
    screen.populateBoard(answerKey, screen.answerKey);
    screen.populateBoard(puzzle, screen.puzzle);
}

function generateBoard() { // loops infinitely
    let numbers = {"1":[], "2":[], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": []}; // should be blank
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
            console.log("Current cycle: " + cycles);

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

            const possibleCoords = getPossibleCoords(coordsOfNumber);

            const maps = []; // build a final map while preserving history
            maps.push(buildCoordsMap(possibleCoords[0], possibleCoords[1]));
            maps.push(removeNumbersFromMap(numbers, maps.at(-1)));
            maps.push(removeCoordsFromSquares(coordsOfNumber, maps.at(-1)));
            if (triedCoordsOfNumber.length != 1)
                maps.push(removeCoordsFromMap(triedCoordsOfNumber, maps.at(-1)));
            
            // error checking
            if (maps.at(-1).length == 0) {
                console.log("Conflict detected");
                coordsOfNumber.shift();
                continue;
            }

            // finally, place a coordinate
            const choice = getRandomItem(maps.at(-1));
            console.log(choice);
            coordsOfNumber.push(choice);
            clearArray(triedCoordsOfNumber);
        }
    }

    return [numbers, cycles];
}

function getPossibleCoords(takenCoords, xCoords = ALL_X_COORDS, yCoords = ALL_Y_COORDS) {
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

function findCoordWithSharedAxis(point, coords) {
    for (let c in coords) {
        if (c[0] == point[0] || c[1] == point[1]) {
            return c;
        }
    }
    return null;
}

function buildCoordsMap(xCoords, yCoords) {
    // pair x values with y values
    let coordsMap = [];
    for (let x of xCoords) { // loops x*y times
        for (let y of yCoords) { 
            coordsMap.push([x, y]);
        }
    }
    return coordsMap;
}

const isInSquare = (c, s) => c[0] >= s[0][0] && c[0] <= s[1][0] && c[1] >= s[0][1] && c[1] <= s[1][1]; // collider logic

function findMySquare(coord, squares = squares) {
    // for each square, if the coord is between its bounds, return that square
    for (let square of squares) {
        if (isInSquare(coord, square)) { return square; }
    }
    throw new Error("coordinate is not in any square");
}

function removeCoordsFromSquares(takenCoords, map, squares = SQUARES) {
    let newMap = [...map];
    if (takenCoords.length == 0) {
        return newMap; // no squares eliminated yet
    }
    for (let square of squares) {
        for (let coord of takenCoords) {
            if (isInSquare(coord, square)) {
                newMap = newMap.filter(c => !isInSquare(c, square)); // i *think* this does it, but im learning js as i go
            }
        }
    }
    return newMap;
}

function getCoordsOfAllNumbers(numbers) { 
    let allNums = [];
    for (let number in numbers) { // dict
        for (let coord of numbers[number]) { // array
            allNums.push(coord);
        }
    }
    return allNums;
}

function removeNumbersFromMap(numbers, map) {
    let filteredMap = map; 
    for (let number in numbers) {
        coords = numbers[number];
        filteredMap = filteredMap.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));
    }

    return filteredMap;
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
    
const errorWrapper = func => { try { func(); } catch (error) { reportErrors(error); } }

const removeCoordsFromMap = (coords, map) => map.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));

const convertCoordToIdFormat = (id, coord) => id + ":" + coord[0] + ":" + coord[1];

const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];

const clearArray = array => { array.splice(0, array.length); }





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

    #convertToIdFormat(id, coord) {
        return id + ":" + coord[0] + ":" + coord[1];
    }

    #clearBoard(id) {
        const coords = buildCoordsMap(ALL_X_COORDS, ALL_Y_COORDS);
        for (let c of coords) {
            this.#pushNumberToCell(" ", this.#convertToIdFormat(id, c));
        }
    }

}