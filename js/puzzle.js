// Object which represents the puzzle state

var cBandsPuzzle = function (data) {
    this.data = data;
    this.parseData(data);
}

cBandsPuzzle.prototype.parseData = function (data) {
    this.gridSize = data.gridSize;
    var cells = [];
    // create all cells
    for (var i = 0; i < this.gridSize; i++) {

        cells[i] = new Array(this.gridSize);

        for (var j = 0; j < this.gridSize; j++) {

            cells[i][j] = new cBandsCell(i, j);
        }
    }
    // parse bands
    for (var i = 0; i < data.bands.length; i++) {
        this.parseBand(data.bands[i], cells);
    }
    this.cells = cells;
}

cBandsPuzzle.prototype.parseBand = function (band, cells) {
    var getBandSize = function (bandString) {
        return bandString.replace(/[DLRU]/g, "").length;
    }
    var shiftTo = function (position, direction) {
        if (direction == 'R') {
            position.x++;
        }
        if (direction == 'D') {
            position.y++;
        }
        if (direction == 'U') {
            position.y--;
        }
        if (direction == 'L') {
            position.x--;
        }
    }
    var position = {
        x: Number(band.charAt(0)),
        y: Number(band.charAt(2))
    }
    var firstCell = cells[position.x][position.y];
    var prevCell = undefined;
    var direction = 'R';
    // Remove to digits, comma and colon.
    band = band.slice(4);
    var bandSize = getBandSize(band);
    // Looping for whole band.
    while (band.length > 0) {
        var cell = cells[position.x][position.y];
        cell.bandSize = bandSize;
        // Set color
        var color = Number(band.charAt(0));
        cell.color = color;
        band = band.slice(1);
        // Change direction if needed.
        var nextLetter = band.charAt(0);
        if (nextLetter == 'R' || nextLetter == 'D' || nextLetter == 'U' || nextLetter == 'L') {
            direction = nextLetter;
            cell.isCorner = true;
            band = band.slice(1);
        }
        // Move to the next cell.
        shiftTo(position, direction);
        if (prevCell) {
            cell.prevDirection = prevCell.direction;
            cell.prev = prevCell;
            prevCell.next = cell;
        }
        // Remember the direction to draw special edge there.
        if (band.length >= 0) {
            cell.direction = direction;
        }
        if (band.length == 0) {
            cell.isLast = true;
        }
        prevCell = cell;
    }
    firstCell.prev = prevCell;
    prevCell.next = firstCell;
}

cBandsPuzzle.prototype.isSolved = function () {
    var aArray = [];

    var isAllDifferent = function (aArray) {
        var counter = {};
        for (i = 0; i < aArray.length; i++) {
            if (counter[aArray[i]] != undefined) {
                return false;
            }
            counter[aArray[i]] = 1;
        }
        return true;
    }
    for (x = 0; x <= this.gridSize - 1; x++) {
        aArray = [];
        for (y = 0; y <= this.gridSize - 1; y++) {
            aArray.push(this.cells[x][y].color);
        }
        if (!isAllDifferent(aArray)) {
            return false;
        }
    }
    for (y = 0; y <= this.gridSize - 1; y++) {
        aArray = [];
        for (x = 0; x <= this.gridSize - 1; x++) {
            aArray.push(this.cells[x][y].color);
        }
        if (!isAllDifferent(aArray)) {
            return false;
        }
    }
    return true;
}