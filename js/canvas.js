// Object which controls rendering of puzzle to the snap canvas

var thisCell = new cBandsCell();
var newCell = new cBandsCell();
var old_dy = old_dx = 0;

var move = function(dx,dy) {
	var dirVer = canvas.direction[thisCell.direction]%2 == 0;
	var dirHor = canvas.direction[thisCell.direction]%2 == 1;
	var dirVerCorner = thisCell.isCorner && canvas.direction[thisCell.prevDirection]%2 == 0;
	var dirHorCorner = thisCell.isCorner && canvas.direction[thisCell.prevDirection]%2 == 1;
	var coeff;
	
	if (dirVer || dirVerCorner) {
		if (dirVer) {
			coeff = -(canvas.direction[thisCell.direction]-1);
		} else {
			coeff = -(canvas.direction[thisCell.prevDirection]-1);
		}
		if (coeff*(dy - old_dy) > canvas.cellSize / 2)  {
			var aColors = [];
			for (i=0; i <= thisCell.bandSize-1; i++) {
				aColors.push(thisCell.prev.color);
				thisCell = thisCell.prev;
			}
			for (i=0; i <= thisCell.bandSize-1; i++) {
				thisCell.color = aColors[i];
				thisCell.element.attr({fill: canvas.colors[aColors[i]]});
				thisCell = thisCell.prev;				
			}
			old_dy = old_dy + coeff * canvas.cellSize;
		}
		if (-coeff*(dy - old_dy) > canvas.cellSize / 2)  { 
			var aColors = [];
			for (i=0; i <= thisCell.bandSize-1; i++) {
				aColors.push(thisCell.next.color);
				thisCell = thisCell.next;
			}
			for (i=0; i <= thisCell.bandSize-1; i++) {
				thisCell.color = aColors[i];
				thisCell.element.attr({fill: canvas.colors[aColors[i]]});
				thisCell = thisCell.next;				
			}
			old_dy = old_dy - coeff * canvas.cellSize;
		}
	}
	if (dirHor || dirHorCorner) {
		if (dirHor) {
			coeff = -(canvas.direction[thisCell.direction]-2);
		} else {
			coeff = -(canvas.direction[thisCell.prevDirection]-2);
		}
		if (coeff*(dx - old_dx) > canvas.cellSize / 2)  {
			var aColors = [];
			for (i=0; i <= thisCell.bandSize-1; i++) {
				aColors.push(thisCell.prev.color);
				thisCell = thisCell.prev;
			}
			for (i=0; i <= thisCell.bandSize-1; i++) {
				thisCell.color = aColors[i];
				thisCell.element.attr({fill: canvas.colors[aColors[i]]});
				thisCell = thisCell.prev;				
			}
			old_dx = old_dx + coeff * canvas.cellSize;
		}
		if (-coeff*(dx - old_dx) > canvas.cellSize / 2)  {
			var aColors = [];
			for (i=0; i <= thisCell.bandSize-1; i++) {
				aColors.push(thisCell.next.color);
				thisCell = thisCell.next;
			}
			for (i=0; i <= thisCell.bandSize-1; i++) {
				thisCell.color = aColors[i];
				thisCell.element.attr({fill: canvas.colors[aColors[i]]});
				thisCell = thisCell.next;				
			}
			old_dx = old_dx - coeff * canvas.cellSize;
		}
	}
	if (canvas.puzzle.isSolved()) {
		canvas.puzzle.element.attr({fill: "#f9f"});
		$("#btnNextPuzzle").show();
	}
}

var start = function(cx,cy) {
	old_dy = old_dx = 0;
	var x = Math.floor(cx / canvas.cellSize);
	var y = Math.floor(cy / canvas.cellSize);
	thisCell = canvas.puzzle.cells[x][y];
	this.data('origTransform', this.transform().local );
}
var stop = function() {
}

cBandsCanvas = function(puzzle){
  this.puzzle = puzzle;
  this.colors = {
    "1": "#e55",
    "2": "#5e5",
    "3": "#55e",
    "4": "#c5c",
    "5": "#f95",
  }
  // Sides and their opposites.
  this.opposite = {
    "L" : "R",
    "R" : "L",
    "U" : "D",
    "D" : "U"
  }
  this.direction = {
    "D" : 0,
    "U" : 2,
    "R" : 1,
    "L" : 3
  }
}

cBandsCanvas.prototype.render = function(snap){
  this.snap = snap;
  this.cellSize = Math.min(snap.node.clientHeight/this.puzzle.gridSize, snap.node.clientWidth/this.puzzle.gridSize);
  this.ballSize = this.cellSize / 3;
  this.puzzle.element = this.drawBoard(this.puzzle.gridSize);
  for (var i = 0; i < this.puzzle.gridSize; i++) {

    for (var j = 0; j < this.puzzle.gridSize; j++) {

      this.drawCell(this.puzzle.cells[i][j]);
    }
  }
}

cBandsCanvas.prototype.drawBoard = function(gridSize) {
  var board = this.snap.rect(0, 0, gridSize * this.cellSize,gridSize * this.cellSize);
  board.attr({
    fill: "#fff",
    stroke: "#000",
    strokeWidth: 1
  })
  board.drag(move,start,stop);
  return board;
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
  circle.drag(move,start,stop);
  return circle;
}
