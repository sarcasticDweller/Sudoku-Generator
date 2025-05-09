// somehow, a bunch of stuff got lowercased. and now im playing whack-a-mole. chances are i missed a few
// import wont work on the file:// protocol. yay


const ALL_X_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ALL_Y_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const SQUARES = [
    [[1, 1], [3, 3]], [[4, 1], [6, 3]], [[7, 1], [9, 3]],
    [[1, 4], [3, 6]], [[4, 4], [6, 6]], [[7, 4], [9, 6]],
    [[1, 7], [3, 9]], [[4, 7], [6, 9]], [[7, 7], [9, 9]]
];

function getPossibleCoords(takenCoords, xCoords = ALL_X_COORDS, yCoords = ALL_Y_COORDS) {
    let possibleXCoords = [...xCoords]; 
    let possibleYCoords = [...yCoords];
    if (takenCoords.length != 0) {
        for (const coords of takenCoords) {
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
    for (const c in coords) {
        if (c[0] == point[0] || c[1] == point[1]) {
            return c;
        }
    }
    return null;
}

function buildCoordsMap(xCoords, yCoords) {
    // pair x values with y values
    let coordsMap = [];
    for (const x of xCoords) { // loops x*y times
        for (const y of yCoords) { 
            coordsMap.push([x, y]);
        }
    }
    return coordsMap;
}

const isInSquare = (c, s) => c[0] >= s[0][0] && c[0] <= s[1][0] && c[1] >= s[0][1] && c[1] <= s[1][1]; // collider logic

function findMySquare(coord, squares = squares) {
    // for each square, if the coord is between its bounds, return that square
    for (const square of squares) {
        if (isInSquare(coord, square)) { return square; }
    }
    throw new Error("coordinate is not in any square");
}

function removeCoordsFromSquares(takenCoords, map, squares = SQUARES) {
    let newMap = [...map];
    if (takenCoords.length == 0) {
        return newMap; // no squares eliminated yet
    }
    for (const square of squares) {
        for (const coord of takenCoords) {
            if (isInSquare(coord, square)) {
                newMap = newMap.filter(c => !isInSquare(c, square)); // i *think* this does it, but im learning js as i go
            }
        }
    }
    return newMap;
}

function getCoordsOfAllNumbers(numbers) { 
    let allNums = [];
    for (const number in numbers) { // dict
        for (const coord of numbers[number]) { // array
            allNums.push(coord);
        }
    }
    return allNums;
}

function removeNumbersFromMap(numbers, map) {
    let filteredMap = map; 
    for (const number in numbers) {
        coords = numbers[number];
        filteredMap = filteredMap.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));
    }

    return filteredMap;
}

function generateBoardNeo() { // loops infinitely
    let numbers = {"1":[], "2":[], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": []}; // should be blank
    console.log("begin generating board");

    // dont give up on a whole board
    let cycles = 0;

    for (const number in numbers) {
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
                console.log(coordsOfNumber);
                console.log(numbers);
                throw new Error("Infinite loop detected"); 
            }

            const possibleCoords = getPossibleCoords(coordsOfNumber);

            const maps = []; // build a final map while preserving history
            maps.push(buildCoordsMap(possibleCoords[0], possibleCoords[1]));
            maps.push(removeNumbersFromMap(numbers, maps.at(-1)));
            maps.push(removeCoordsFromSquares(coordsOfNumber, maps.at(-1)));
            console.log(triedCoordsOfNumber);
            console.log(maps.at(-1));
            if (triedCoordsOfNumber.length != 1)
                maps.push(removeCoordsFromMap(triedCoordsOfNumber, maps.at(-1)));
            
            // error checking
            if (maps.at(-1).length == 0) {
                console.log("Conflict detected");
                if (coordsOfNumber.length == 0) {
                    console.log("Dubious break");
                    break; // why?
                }

                let troubledSpot;
                for (const map of maps) { // loops maps.length times
                    if (map.length == 1) {
                        troubledSpot = map[0];
                        break;
                    }
                }

                let conflictingCoord;
                if (!troubledSpot) { // means we couldnt find the spot that had a conflict
                    console.log("desperate measures used");
                    conflictingCoord = coordsOfNumber[0]; // a desperate lie to get things moving again
                } else {
                    for (const c of coordsOfNumber) {
                        if (c[0] == troubledSpot[0] || c[1] == troubledSpot[1]) {
                            conflictingCoord = c;
                            console.log("conflict found at " + c);
                            break; // conflict found
                        }
                    }
                }

                console.log("Removing conflicting coord: " + conflictingCoord);
                coordsOfNumber.splice(conflictingCoord, 1);
                triedCoordsOfNumber.push(conflictingCoord);
                continue;
            }

            // finally, place a coordinate
            coordsOfNumber.push(getRandomItem(maps.at(-1)));
            clearArray(triedCoordsOfNumber);
        }
    }

    return [numbers, cycles];
}

function generateBoard() {
    let numbers = {"1":[], "2":[], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": []}; // should be blank
    console.log("begin generating board");
    let cycles = 0;

    for (const number in numbers) { // 9 loops
        console.log("populating number: " + number);
        let coords = numbers[number];
        //for(c of coords){console.log(c);}
        let triedCoords = [];
        while (coords.length < 9) {
            if (cycles > 200) { // reset to 200
                console.log("took too long, giving up");
                return [false, 0]; // reset if it takes too long
            }
            cycles += 1;
            console.log("current cycle: " + cycles);

            // build a map of possible cells for the next number
            const POSSIBLE_COORDS = getPossibleCoords(coords); // eliminate x/y values if they overlap with a coord
            const MAP = buildCoordsMap(POSSIBLE_COORDS[0], POSSIBLE_COORDS[1]); // build a coordinate map
            const NUM_AWARE_MAP = removeNumbersFromMap(numbers, MAP); // remove all taken coords from the map
            const SQUARE_AWARE_MAP = removeCoordsFromSquare(coords, NUM_AWARE_MAP, SQUARES); // remove all coords in squares that already have the same number


            // error checking, aka the insanity zone
            const TRIED_COORDS_AWARE_MAP = removeCoordsFromMap(triedCoords, SQUARE_AWARE_MAP); // hold on, i could bunch this into NUM_AWARE_MAP couldnt i?
            if (TRIED_COORDS_AWARE_MAP.length == 0) {   
                console.log("conflict detected, searching..."); 
                console.log("map length: " + MAP.length);
                console.log("num aware map length: " + NUM_AWARE_MAP.length);
                console.log("square aware map length: " + SQUARE_AWARE_MAP.length);
                if (coords.length == 0) {
                    console.log("dubious break");
                    break; // why?
                }

                let spot; // we're trying to place a number here. now figure out where this spot actually is
                let conflictingCoord; // the number conflicting with spot
                if (SQUARE_AWARE_MAP.length == 1) { spot = SQUARE_AWARE_MAP[0]; console.log("spot is square"); }
                else if (NUM_AWARE_MAP.length == 1) { spot = NUM_AWARE_MAP[0]; console.log("spot is num"); }
                else if (MAP.length == 1) { spot = MAP[0]; console.log("spot is map"); } 
                else { console.log("spot not set!"); }
                console.log("spot coords: " + spot);

                try {
                    for (c of coords) {
                        if (c[0] == spot[0] || c[1] == spot[1]) {
                            conflictingCoord = c;
                            console.log("conflict found at " + c);
                            break; // conflict found
                        }
                    }
                }
                catch {
                    console.log("spot not set prevented finding the conflicting coord");
                }

                if (!conflictingCoord) { // dont know how this case ever happens
                    console.log("desperate measures used");
                    conflictingCoord = coords[0]; // a desperate lie to get things moving again
                }

                console.log("removing conflicting coord: " + conflictingCoord);
                coords.splice(conflictingCoord, 1);
                triedCoords.push(conflictingCoord);
                continue;
            }

            const final_map = TRIED_COORDS_AWARE_MAP;


            // finally, place a coordinate
            const choice = getRandomItem(final_map);
            //console.log("choice: " + choice);
            coords.push(choice);
            //console.log("coords after choice added: ");
            //for(c of coords){console.log(c);}
            triedCoords.splice(0, triedCoords.length); // clear triedcoords array

        }
    }

    return [numbers, cycles]; // returns the unmodified array! blargisborg!
}

function hideAmountOfNumbersRandomly(board, amount) {
    let counter = amount;
    console.log(board);
    let newBoard = {...board};
    while (counter > 0) { // how can i optimize this?
        for (const number in board) {
            board[number].splice(getRandomItem(board[number]), 1);
            counter = counter - 1;
        }
    }
    console.log(newBoard);
	
    return newBoard;
}
    
function errorWrapper(func) { try { func(); } catch (error) { reportErrors(error); } }

const removeCoordsFromMap = (coords, map) => map.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));

const convertCoordToIdFormat = (id, coord) => id + ":" + coord[0] + ":" + coord[1];

const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];

const clearArray = array => { array.splice(0, array.length); }

function getNewGame() {
    let board = generateBoardNeo();
    let answerKey = board[0], cycles = board[1];
    console.log("Generated in " + cycles + " cycles.");
    console.log(answerKey);

    let puzzle = hideAmountOfNumbersRandomly(answerKey, 40); // this is mutating answerKey[0].
    clearBoard("k");
    clearBoard("p");
    populateBoard(answerKey, "k"); // should display a filled in sudoku board
    populateBoard(puzzle, "p"); // should display a puzzle to be played
}

function reportErrors(error) { document.getElementById("errorLine").innerHTML = "Error detected. Please copy this message and keep it somewhere safe: " + error.message; }

const pushNumberToCell = (number, cellId) => { document.getElementById(cellId).innerHTML = number; }

function populateBoard(board, id="k") {
    // id is either "k" for answer key or "p" for puzzle.
    for (const number in board) {
        let coords = board[number];
        for(const c of coords){
            pushNumberToCell(number, convertCoordToIdFormat(id, c));
        }
    }
}

function clearBoard(id) {
    const coords = buildCoordsMap(ALL_X_COORDS, ALL_Y_COORDS);
    for (const c of coords) {
        pushNumberToCell(" ", convertCoordToIdFormat(id, c));
    }
}
