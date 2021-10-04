import React from 'react';
import './App.css';
import Header from './Header';
import Board from './Board';

function App() {
  return (
    <div className="App">
      <header className="header">
        <Header />
      </header>
      <Board width={7} height={6}/>
    </div>
  );
}

export default App;
