// Object which represents the puzzle state

var cBandsPuzzle = function(data){
  this.data = data;
  this.parseData(data);
}

function getBandSize(s) {
	var bandSize = 0;
	while (s.length > 0){
		if (s.charAt(0)!="D" && s.charAt(0)!="U" && s.charAt(0)!="R" && s.charAt(0)!="L") {
			bandSize++;
		}
		s = s.slice(1);
	}
	return bandSize;
}

function isAllDifferent (aArray) {
	for (i=0; i<=aArray.length-2; i++) {
		for (j=i+1; j<=aArray.length-1; j++) {
			if (aArray[i]==aArray[j]) {
				return false;
			}
		}
	}
	return true;
}

cBandsPuzzle.prototype.parseData = function(data){
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
  for(var i=0; i < data.bands.length; i++){
    this.parseBand(data.bands[i], cells);
  }
  this.cells = cells;
}

cBandsPuzzle.prototype.parseBand = function(band, cells) {
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
  while (band.length > 0){
    var cell = cells[position.x][position.y];
	cell.bandSize = bandSize;
    // Set color
    var color = Number(band.charAt(0));
    cell.color = color;
    band = band.slice(1);
    // Change direction if needed.
    var nextLetter = band.charAt(0);
    if (nextLetter=='R' || nextLetter=='D' || nextLetter=='U' || nextLetter=='L' ){
      direction = nextLetter;
      band = band.slice(1);
    }
    // Move to the next cell.
    this.shiftTo(position, direction);
    if (prevCell) {
      cell.prevDirection = prevCell.direction;
      cell.prev = prevCell;
      prevCell.next = cell;
    }
    // Remember the direction to draw special edge there.
    if (band.length >= 0) {
      cell.direction = direction;
    }
    prevCell = cell;
  }
  firstCell.prev = prevCell;
  prevCell.next = firstCell;
}

cBandsPuzzle.prototype.shiftTo = function(position, direction){
  if (direction=='R'){
    position.x++;
  }
  if (direction=='D'){
    position.y++;
  }
  if (direction=='U'){
    position.y--;
  }
  if (direction=='L'){
    position.x--;
  }
}

cBandsPuzzle.prototype.isSolved = function() {
	var aArray = [];
	for (x = 0; x <= this.gridSize-1; x++) {
		aArray = [];
		for (y = 0; y <= this.gridSize-1; y++) {
			aArray.push(this.cells[x][y].color);
		}
		if (!isAllDifferent(aArray)) {
			return false;
		}
	}
	for (y = 0; y <= this.gridSize-1; y++) {
		aArray = [];
		for (x = 0; x <= this.gridSize-1; x++) {
			aArray.push(this.cells[x][y].color);
		}
		if (!isAllDifferent(aArray)) {
			return false;
		}
	}
	return true;
}