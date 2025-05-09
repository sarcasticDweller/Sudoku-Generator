
const pushNumberToCell = (number, cellId) => { document.getElementById(cellId).innerHTML = number; }

function reportErrors(error) { document.getElementById("errorLine").innerHTML = "Error detected. Please copy this message and keep it somewhere safe: " + error.message; }

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
export *;
