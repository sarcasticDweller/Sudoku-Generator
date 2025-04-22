// i allegedly haave two errors. i dont know whats wrong though, just that theres errors. thanks, vim!

const ALL_X_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ALL_Y_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const SQUARES = [
    [[1, 1], [3, 3]], [[4, 1], [6, 3]], [[7, 1], [9, 3]],
    [[1, 4], [3, 6]], [[4, 4], [6, 6]], [[7, 4], [9, 6]],

];

function getPossibleCoords(takenCoords, xCoords = ALL_X_COORDS, yCoords = ALL_Y_COORDS) {
    var possibleXCoords = [...xCoords]; // and i already am realizing i dont know the first thing about javascript
    var possibleYCoords = [...yCoords];
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

function buildCoordsMap(xCoords, yCoords){
    // pair x values with y values
    var coordsMap = [];
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

function removeCoordsFromSquare(takenCoords, map, squares) {
    var newMap = [...map];
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

function getCoordsOfAllNumbers(numbers) { // numbers is not iterable
    var allNums = [];
    for (const number in numbers) {
        for (const coord of numbers[number]) {
            allNums.push(coord);
        }
    }
    return allNums;
}

function removeCoordsFromMap(coords, map) {
    return map.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));
}

function findCoordWithSharedAxis(point, coords) {
    for (const c in coords) {
        if (c[0] == point[0] || c[1] == point[1]) {
            return c;
        }
    }
    return null;
}

function generateBoard() {
    /**
     * :return map: dictionary of numbers and their coordinates
     * :return cycles: number of cycles it took to generate the board
     * Todo: update how this docstring is formatted so that it works with vsc
     */

    console.log("Begin generating board");
    var numbers = {"1":[[1,1]], "2":[], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": []}; // should be blank
    var cycles = 0;

    for (const number in numbers) {
        console.log("Trying: " + number);
        var coords = numbers[number];
        console.log("Coords: ");
        for(c of coords){console.log(c);}
        var triedCoords = [];
        while (coords.length < 9) {
            if (cycles > 200) { // reset to 200
                return [false, 0]; // reset if it takes too long
            }
            cycles += 1;
            // loop logic


            // eliminate x/y values if they overlap with a coord
            const POSSIBLE_COORDS = getPossibleCoords(coords); 
            //console.log("Possible coords: ");
            //for (c of POSSIBLE_COORDS){console.log(c)};


            // build a coordinate map
            const MAP = buildCoordsMap(POSSIBLE_COORDS[0], POSSIBLE_COORDS[1]);
            //console.log("Map: ");
            //for (m of MAP){console.log(m);}

            // remove all taken coords from the map
            const NUM_AWARE_MAP = removeCoordsFromMap(coords, MAP);
            //console.log("Num aware map: ");
            //for(m of NUM_AWARE_MAP){console.log(m);}

            // remove all coords in squares that already have the same number
            const SQUARE_AWARE_MAP = removeCoordsFromSquare(coords, NUM_AWARE_MAP, SQUARES);
            //console.log("Square aware coords map: ");
            //for (m of SQUARE_AWARE_COORDS_MAP){console.log(m);}




            // error checking
            

            /*
             * This will work better when I know all the possible cases where an issue occurs, and then work on those.
             */



            console.log("Map length: " + MAP.length);
            console.log("Num Aware Map length: " + NUM_AWARE_MAP.length);
            console.log("Square Aware Map length: " + SQUARE_AWARE_MAP.length);
            const TRIED_COORDS_AWARE_MAP = removeCoordsFromMap(triedCoords, SQUARE_AWARE_MAP); // hold on, i could bunch this into NUM_AWARE_MAP couldnt i?
            if (TRIED_COORDS_AWARE_MAP.length == 0) {
                if (coords.length == 0) {
                    console.log("Dubious break");
                    break; // why?
                }

                var spot; // we're trying to place a number here. now figure out where this spot actually is
                var conflictingCoord; // the number conflicting with spot
                if (SQUARE_AWARE_MAP.length == 1) { spot = SQUARE_AWARE_MAP[0]; console.log("Spot is square"); }
                else { spot = NUM_AWARE_MAP[0]; console.log("Spot is num"); }

                for (c of coords) {
                    if (c[0] == spot[0] || c[1] == spot[1]) {
                        conflictingCoord = c;
                        console.log("Conflict found at " + c);
                        break // conflict found
                    }
                }

                if (!conflictingCoord) { // dont know how this case ever happens
                    console.log("Desperate measures used");
                    conflictingCoord = coords[0]; // A desperate lie to get things moving again
                }

                console.log("Removing conflicting coord: " + conflictingCoord);
                coords.splice(conflictingCoord, 1);
                triedCoords.push(conflictingCoord);
                continue;
            }

            const FINAL_MAP = TRIED_COORDS_AWARE_MAP;


            // finally, place a coordinate
            const getRandomItem = (arr) => {
                  const randomIndex = Math.floor(Math.random() * arr.length);
                  return arr[randomIndex];
            };
            const CHOICE = getRandomItem(FINAL_MAP);
            //console.log("Choice: " + CHOICE);
            coords.push(CHOICE);
            //console.log("Coords after choice added: ");
            //for(c of coords){console.log(c);}
            triedCoords.splice(0, triedCoords.length); // empty triedCoords

        }
    }

    // finally, output the damn information
    //console.log("Board generated");
    //console.log("Numbers: " + Object.values(numbers));
    return [numbers, cycles]; // returns the unmodified array! blargisborg!
}

function hideAmountOfNumbersRandomly(board, amount) {
}


function pushNumberToCell(number, cellId) { // we love a simple helper function
    document.getElementById(cellId).innerHTML = number;
}

function convertCoordToIdFormat(coord) {
    return coord[0] + ":" + coord[1];
}

function populateBoardHTML(board) {
    console.log("Populating HTML board");
    for (const number in board) {
        var coords = board[number];
        for(c of coords){
            pushNumberToCell(number, convertCoordToIdFormat(c));
        }
    }
}
function getNewGame() {
    var attempts = 0;
    while (true) {
        attempts++;
        var board = generateBoard();
        if (board[0]) { break; }
    }
    console.log("Generated in " + board[1] + " cycles and " + attempts + " attempts.");
    //console.log(board);
    populateBoardHTML(board[0]);
}
