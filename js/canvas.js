// Object which controls rendering of puzzle to the snap canvas

cBandsCanvas = function(puzzle){
  this.puzzle = puzzle;
  this.colors = {
    "1": "#e55",
    "2": "#5e5",
    "3": "#55e",
    "4": "#c5c",
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
  var lines = []
  if (cell.direction != 'D' && cell.prevDirection != 'U') {
    var line = this.snap.line(cell.column*40, cell.row * 40 + 40, cell.column*40 + 40, cell.row * 40 + 40);
    line.attr({
      stroke: "#000",
      strokeWidth: 1
    });
    lines.push(line);
  }
  if (cell.direction != 'U' && cell.prevDirection != 'D') {
    var line = this.snap.line(cell.column*40, cell.row * 40, cell.column*40 + 40, cell.row * 40);
    line.attr({
      stroke: "#000",
      strokeWidth: 1
    });
    lines.push(line);
  }
  if (cell.direction != 'R' && cell.prevDirection != 'L') {
    var line = this.snap.line(cell.column*40 + 40, cell.row * 40, cell.column*40 + 40, cell.row * 40 + 40);
    line.attr({
      stroke: "#000",
      strokeWidth: 1
    });
    lines.push(line);
  }
  if (cell.direction != 'L' && cell.prevDirection != 'R') {
    var line = this.snap.line(cell.column*40, cell.row * 40, cell.column*40, cell.row * 40 + 40);
    line.attr({
      stroke: "#000",
      strokeWidth: 1
    });
    lines.push(line);
  }
  var circle = this.snap.circle(cell.column*40 + 20, cell.row * 40 + 20, 16);
  circle.attr({
    fill: this.colors[cell.color],
    stroke: "#000",
    strokeWidth: 1
  })
  cell.element = this.snap.group(circle);
}
