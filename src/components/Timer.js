
import React, { useState, useEffect } from 'react';
import { useSudokuContext } from '../context/SudokuContext';
import moment from 'moment';

export const Timer = (props) => {
  let [currentTime, setCurrentTime] = useState(moment());
  let { timeGameStarted, won } = useSudokuContext();

  useEffect(() => {
    if (!won)
      setTimeout(() => tick(), 1000);
  });

  function tick() {
    setCurrentTime(moment());
  }
}