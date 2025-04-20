const ALL_X_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ALL_Y_COORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const SQUARES = [
    [[1, 1], [3, 3]], [[4, 1], [6, 3]], [[7, 1], [9, 3]],
    [[1, 4], [3, 6]], [[4, 4], [6, 6]], [[7, 4], [9, 6]],

];

document.getElementById("1:1").innerHTML = "Hello World";
document.getElementById("title").innerHTML = "Hello World";

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

function removeCoordsWithinSquare(takenCoords, map, squares) {
    newMap = [...map];
    if (takenCoords.length == 0) {
        return newMap; // no squares eliminated yet
    }
    for (const square in squares) {
        for (const coord in takenCoords) {
            if (takenCoords.includes(coord)) {
                // how do you do list comprehension in javascript anyway
            }
        }
    }
    return newMap;
}

document.getElementById("debug_readout").innerHTML = buildCoordsMap(ALL_X_COORDS, ALL_Y_COORDS)[1];
