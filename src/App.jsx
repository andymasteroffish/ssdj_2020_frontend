import React, { useState, useEffect } from "react";
import Game from "./components/Game/Game.jsx";
import PlayersPanel from "./components/PlayersPanel/PlayersPanel.jsx";

import "./App.scss";
const GameComponent = React.memo(Game);

const App = () => {
  const [playerData, updatePlayerData] = useState([]);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [socket, setSocket] = useState();

  const gameLoaded =
    typeof window["register_for_player_data_updates"] == "function";

  console.log(`GAME LOADED? ${gameLoaded}`);

  useEffect(() => {
    if (window["register_for_player_data_updates"]) {
      console.log("REGISTERING GAME DATA PIPE");
      window["register_for_player_data_updates"](updatePlayerData);
      setSocket(window["socket"]);
    }
  }, [gameLoaded, socket]);

  const addPlayer = name => {
    console.log(`ADD PLAYER: ${name}`);
    const val = {
      type: "join_request",
      disp_name: name
    };
    setJoined(true);
    socket.send(JSON.stringify(val));
  };

  return (
    <div className="App">
      <GameComponent />
      <div>
        <PlayersPanel
          playerData={playerData}
          name={name}
          setName={setName}
          addPlayer={addPlayer}
          joined={joined}
        />

        <div className="instructions">
          ---------
          <br />
          Press M to toggle mute (sound only plays during gameplay)
          <br />
          Use arrow keys on orange beat to move
        </div>
      </div>
    </div>
  );
};

export default App;
