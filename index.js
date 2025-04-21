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
    return [[possibleXCoords], [possibleYCoords]];
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
    for (const square in squares) {
        for (const coord in takenCoords) {
            if (isInSquare(coord, square)) {
                // how do you do list comprehension in javascript anyway
                newMap = newMap.filter(c => !isInSquare(c, square)); // i *think* this does it, but im learning js as i go
            }
        }
    }
    return newMap;
}

function getCoordsOfAllNumbers(numbers) {
    var allNums = [];
    for (const number of numbers) {
        for (const coord of numbers[number]) {
            allNums.push(coord);
        }
    }
    return allNums;
}

function removeCoordsFromMap(coords, map) {
    return map.filter(coord => !coords.some(c => c[0] === coord[0] && c[1] === coord[1]));
}

function generateBoard() {
    /**
     * :return map: dictionary of numbers and their coordinates
     * :return cycles: number of cycles it took to generate the board
     * Todo: update how this docstring is formatted so that it works with vsc
     */

    var numbers = {one:[], two:[], three: [], four: [], five: [], six: [], seven: [], eight: [], nine: []};
    var cycles = 0;
    for (const number in numbers) {
        var coords = Object.values(numbers[number]);
        var tried_coords = [];
        console.log(coords);
        while (coords.length < 9) {
            if (cycles > 200) {
                return false; 0; // reset if it takes too long
            }
            cycles += 1;
            const POSSIBLE_COORDS = getPossibleCoords(coords); // array value, [0] = x, [1] = y
            const MAP = buildCoordsMap(POSSIBLE_COORDS[0], POSSIBLE_COORDS[1]); // in python, this was buildCoordsMap(*getPossibleCoords(coords));
            const COORDS_TO_CLEAN = getCoordsOfAllNumbers(numbers)
            const CLEANED_MAP = removeCoordsFromMap(COORDS_TO_CLEAN, MAP);
            const SQUARE_AWARE_CLEAN_MAP = removeCoordsFromSquare(CLEANED_MAP, SQUARES);

            // now do TRIED_COORDS_AWARE_MAP

        }
    }
}

console.log("hello world");
generateBoard();