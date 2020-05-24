import { getSudoku } from './sudoku';

/**
 * Initializes a null array for easier resets in the code.
 */
let nullArray = [ '0', '0', '0', '0', '0', '0', '0', '0', '0',
                  '0', '0', '0', '0', '0', '0', '0', '0', '0',
                  '0', '0', '0', '0', '0', '0', '0', '0', '0',
                  '0', '0', '0', '0', '0', '0', '0', '0', '0',
                  '0', '0', '0', '0', '0', '0', '0', '0', '0',
                  '0', '0', '0', '0', '0', '0', '0', '0', '0',
                  '0', '0', '0', '0', '0', '0', '0', '0', '0',
                  '0', '0', '0', '0', '0', '0', '0', '0', '0',
                  '0', '0', '0', '0', '0', '0', '0', '0', '0' ];

                  /**
 * Gets the coordinates of the center cell of the specified box.
 */
function _getBoxCenter(box) {
    // eslint-disable-next-line
    switch(box) {
      case 0: return [1,1];
      case 1: return [1,4];
      case 2: return [1,7];
      case 3: return [4,1];
      case 4: return [4,4];
      case 5: return [4,7];
      case 6: return [7,1];
      case 7: return [7,4];
      case 8: return [7,7];
    }
  }

  /**
 * Gets the index of cell given:
 * 1. Box
 * 2. Cell
 */
function _getIndexOfCell(box, cell) {
    let [row, column] = _getBoxCenter(box);
    // eslint-disable-next-line
    switch(cell) {
      case 0: {row--; column--; break;}
      case 1: {row--; break;}
      case 2: {row--; column++; break;}
      case 3: {column--; break;}
      case 4: {break;}
      case 5: {column++; break;}
      case 6: {row++; column--; break;}
      case 7: {row++; break;}
      case 8: {row++; column++; break;}
    }
    return row * 9 + column;
  }
  