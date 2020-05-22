import React from "react";
import Game from "./components/Game/Game";
import PlayersPanel from "./components/PlayersPanel/PlayersPanel";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Game />
      <PlayersPanel />
    </div>
  );
};

export default App;
