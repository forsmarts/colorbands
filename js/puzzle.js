// Object which represents the puzzle state

var cBandsPuzzle = function(data){
  this.data = data;
  this.parseData(data);
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
  var x = Number(band.charAt(0));
  var y = Number(band.charAt(2));
  var firstCell = cells[x][y];
  var prevCell = undefined;
  var direction = this.decodeDirection('R');
  band = band.slice(4);
  while (band.length > 0){
    var color = Number(band.charAt(0));
    var cell = cells[x][y];
    cell.color = color;
    if (prevCell) {
      cell.prev = prevCell;
      prevCell.next = cell;
    }
    band = band.slice(1);
    var nextLetter = band.charAt(0);
    if (nextLetter=='R' || nextLetter=='D' || nextLetter=='U' || nextLetter=='L' ){
      direction = this.decodeDirection(nextLetter);
      band = band.slice(1);
    }
    x += direction.column;
    y += direction.row;
    prevCell = cell;
  }
  firstCell.prev = prevCell;
  prevCell.next = firstCell;
}

cBandsPuzzle.prototype.decodeDirection = function(letter){
  if (letter=='R'){
    return {
      row: 0,
      column: 1
    }
  }
  if (letter=='D'){
    return {
      row: 1,
      column: 0
    }
  }
  if (letter=='U'){
    return {
      row: -1,
      column: 0
    }
  }
  if (letter=='L'){
    return {
      row: 0,
      column: -1
    }
  }
}