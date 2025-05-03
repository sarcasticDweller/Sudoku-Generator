// somehow, a bunch of stuff got lowercased. and now im playing whack-a-mole. chances are i missed a few
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

function buildCoordsMap(xCoords, yCoords){
    // pair x values with y values
    let coordsMap = [];
    for (const x of xCoords) {
        for (const y of yCoords) {
            coordsMap.push([x, y]);
        }
    }
    return coordsMap;
}

function isInSquare(coords, square) { // simple collider logic
    return coords[0] >= square[0][0]
        && coords[0] <= square[1][0]
        && coords[1] >= square[0][1]
        && coords[1] <= square[1][1];
}

function findMySquare(coord, squares = squares) {
    // for each square, if the coord is between its bounds, return that square
    for (const square of squares) {
        if (isInSquare(coord, square)) { return square; }
    }
    throw new Error("coordinate is not in any square");
}

function removeCoordsFromSquare(takenCoords, map, squares) {
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
    for (const number in numbers) {
        for (const coord of numbers[number]) {
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

function generateBoard() {
    let numbers = {"1":[], "2":[], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": []}; // should be blank
    console.log("begin generating board");
    let cycles = 0;

    for (const number in numbers) {
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
    let newBoard = {...board};
    while (counter > 0) {
        for (const number in board) {
            board[number].splice(getRandomItem(board[number]), 1);
            counter = counter - 1;
        }
    }
    return newBoard;
}
    
// one line functions
    function pushNumberToCell(number, cellId) { document.getElementById(cellId).innerHTML = number; }
    function reportErrors(error) { document.getElementById("errorLine").innerHTML = "Error detected. Please copy this message and keep it somewhere safe: " + error.message; }
    function errorWrapper(func) { try { func(); } catch (error) { reportErrors(error); } }
    const removeCoordsFromMap = (coords, map) => map.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));
    const convertCoordToIdFormat = (id, coord) => id + ":" + coord[0] + ":" + coord[1];
    const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];

function populateBoardHTML(board, id="k") {
    // id is either "k" for answer key or "p" for puzzle.
    for (const number in board) {
        let coords = board[number];
        for(const c of coords){
            pushNumberToCell(number, convertCoordToIdFormat(id, c));
        }
    }
}

function clearBoardHTML(id) {
    const coords = buildCoordsMap(ALL_X_COORDS, ALL_Y_COORDS);
    for (const c of coords) {
        pushNumberToCell(" ", convertCoordToIdFormat(id, c));
    }
}

function getNewGame() {
    // generate answer key
    let attempts = 0;
    let answerKey; 
    while (true) {
        attempts++;
        answerKey = generateBoard();
        if (answerKey[0] && answerKey) { break; }
    }
    console.log("Generated in " + answerKey[1] + " cycles and " + attempts + " attempts.");



    let puzzle = hideAmountOfNumbersRandomly(answerKey[0], 40); // this is mutating answerKey[0].
    clearBoardHTML("k");
    clearBoardHTML("p");
    populateBoardHTML(answerKey[0], "k"); // should display a filled in sudoku board
    populateBoardHTML(puzzle, "p"); // should display a puzzle to be played
}

