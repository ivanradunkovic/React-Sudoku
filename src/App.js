import React from 'react';
import { Game } from './Game';
import './App.css';
import { SudokuProvider } from './context/SudokuContext';

export const App = () => {
  return (
    <SudokuProvider>
      <Game />
    </SudokuProvider>
  );
}