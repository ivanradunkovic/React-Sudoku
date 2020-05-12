import React from 'react';
import { useSudokuContext } from '../../context/SudokuContext';

export const GameSection = (props) => {
  const rows = [0,1,2,3,4,5,6,7,8];
  let { numberSelected,
        gameArray,
        fastMode,
        cellSelected,
        initArray } = useSudokuContext();

        
  function _isCellRelatedToSelectedCell(row, column) {
    if (cellSelected === row * 9 + column) {
      return true;
    }
    let rowOfSelectedCell = Math.floor(cellSelected / 9);
    let columnOfSelectedCell = cellSelected % 9;
    if (rowOfSelectedCell === row || columnOfSelectedCell === column) {
      return true;
    }
    return [  [0,3,0,3],
              [0,3,3,6],
              [0,3,6,9],
              [3,6,0,3],
              [3,6,3,6],
              [3,6,6,9],
              [6,9,0,3],
              [6,9,3,6],
              [6,9,6,9]
            ].some((array) => {
              if (rowOfSelectedCell > array[0]-1 && row > array[0]-1 &&
                  rowOfSelectedCell < array[1] && row < array[1] &&
                  columnOfSelectedCell > array[2]-1 && column > array[2]-1 &&
                  columnOfSelectedCell < array[3] && column < array[3])
                  return true;
              return false;
            });
  }