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
  var position = {
    x: Number(band.charAt(0)),
    y: Number(band.charAt(2))
  }
  var firstCell = cells[position.x][position.y];
  var prevCell = undefined;
  var direction = 'R';
  band = band.slice(4);
  while (band.length > 0){
    var color = Number(band.charAt(0));
    var cell = cells[position.x][position.y];
    cell.color = color;
    band = band.slice(1);
    var nextLetter = band.charAt(0);
    if (nextLetter=='R' || nextLetter=='D' || nextLetter=='U' || nextLetter=='L' ){
      direction = nextLetter;
      band = band.slice(1);
    }
    this.shiftTo(position, direction);
    // remember the direction to draw special edge there
    if (prevCell) {
      cell.prevDirection = prevCell.direction;
      cell.prev = prevCell;
      prevCell.next = cell;
    }
    if (band.length > 0) {
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