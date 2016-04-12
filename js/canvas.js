// Object which controls rendering of puzzle to the snap canvas

cBandsCanvas = function(puzzle){
  this.puzzle = puzzle;
  this.colors = {
    "1": "#e55",
    "2": "#5e5",
    "3": "#55e",
    "4": "#c5c",
  }
  this.cellSize = 40;
  this.ballSize = 16;
  // Sides and their opposites.
  this.opposite = {
    "L" : "R",
    "R" : "L",
    "U" : "D",
    "D" : "U"
  }
}

cBandsCanvas.prototype.render = function(snap){
  this.snap = snap;
  for (var i = 0; i < this.puzzle.gridSize; i++) {

    for (var j = 0; j < this.puzzle.gridSize; j++) {

      this.drawCell(this.puzzle.cells[i][j]);
    }
  }
}

cBandsCanvas.prototype.drawCell = function(cell){
  // The center of the cell
  position = {
    x: cell.column * this.cellSize + this.cellSize/2,
    y: cell.row * this.cellSize + this.cellSize/2
  }
  var lines = []
  for (side in this.opposite) {
    if (cell.direction != side && cell.prevDirection != this.opposite[side]) {
      lines.push(this.drawInnerBorder( position, side));
    }
  }
  cell.lines = lines;
  cell.element = this.drawBall(position, this.colors[cell.color]);
}

cBandsCanvas.prototype.drawInnerBorder = function(position, side){
  if (side == 'U'){
    var start = {x: -1, y: -1};
    var end = {x: 1, y: -1};
  }
  if (side == 'D'){
    var start = {x: -1, y: 1};
    var end = {x: 1, y: 1};
  }
  if (side == 'L'){
    var start = {x: -1, y: -1};
    var end = {x: -1, y: 1};
  }
  if (side == 'R'){
    var start = {x: 1, y: -1};
    var end = {x: 1, y: 1};
  }
  var line = this.snap.line(
    position.x + start.x * this.cellSize/2, position.y + start.y * this.cellSize/2,
    position.x + end.x * this.cellSize/2, position.y + end.y * this.cellSize/2);
  line.attr({
    stroke: "#000",
    strokeWidth: 1
  });
}

cBandsCanvas.prototype.drawBall = function(position, color) {
  var circle = this.snap.circle(position.x, position.y, this.ballSize);
  circle.attr({
    fill: color,
    stroke: "#000",
    strokeWidth: 1
  })
}