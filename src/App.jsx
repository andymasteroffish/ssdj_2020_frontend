import React, { useState, useEffect } from "react";
import PlayersPanel from "./components/PlayersPanel/PlayersPanel.jsx";
import { v4 as uuid } from "uuid";

import "./App.scss";

const App = () => {
  const [gameData, updateGameData] = useState({
    players: [],
    game_state: undefined
  });

  const gameState = gameData.game_state;

  const [name, setName] = useState("");
  const [joined, setJoined] = useState("");

  const addPlayer = name => {
    console.log(`ADD PLAYER: ${name}`);
    const val = {
      type: "join_request",
      disp_name: name,
      uuid: uuid()
    };
    setJoined(true);
    window.socket.send(JSON.stringify(val));
  };

  const gameLoaded =
    !!window["register_client_update_callback"] && !!window["socket"];

  console.log(`GAME LOADED? ${gameLoaded}`);

  useEffect(() => {
    if (gameLoaded) {
      console.log("REGISTERING GAME DATA PIPE");
      window["register_client_update_callback"](updateGameData);
    }
  }, [gameLoaded]);

  useEffect(() => {
    if (gameState === 0 && !joined && name) {
      console.log("JOINING IN RESPONSE TO STATE CHANGE");
      addPlayer(name);
    }
  }, [gameState, joined, name]);

  return (
    <div className="App">
      <div>
        <PlayersPanel
          gameData={gameData}
          name={name}
          setName={setName}
          addPlayer={addPlayer}
          joined={joined}
        />
      </div>
    </div>
  );
};

export default App;
