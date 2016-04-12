// Object which represents one cell of a puzzle

var cBandsCell = function(column, row){
  this.column = column;
  this.row = row;
  // current color in the cell
  this.color = 0;
  // next cell along the band
  // band is looped - the last cell points to the first
  this.next = null;
  // prev cell along the band
  // band is looped - the first cell points to the last
  this.prev = null;
}