/* globals element,by*/
'use strict';

// constructor
//
// Set the grid element to work on
function UiGridTest(gridId) {
  var gridElement;

  // Assume string is an ID
  if (typeof (gridId) === 'string') {
    gridElement = element(by.id(gridId));
  } else {
    gridElement = element(gridId);
  }

  this.grid = gridElement;
}

//
// return the header object
UiGridTest.prototype.getColumnHeaders = function() {
  var headerCols = this.grid
      .element(by.css('.ui-grid-header-cell-row'))
      .all(by.repeater('col in colContainer.renderedColumns track by col.uid'));

  return headerCols;
};

module.exports = UiGridTest;
