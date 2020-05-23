import React, { useState, useEffect } from "react";
import PlayersPanel from "./components/PlayersPanel/PlayersPanel.jsx";

import "./App.scss";

const App = () => {
  const [gameData, updateGameData] = useState({
    players:[]
  });
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [socket, setSocket] = useState();

  const gameLoaded =
    !!window["register_client_update_callback"] && !!window["socket"];

  console.log(`GAME LOADED? ${gameLoaded}`);

  useEffect(() => {
    if (gameLoaded) {
      console.log("REGISTERING GAME DATA PIPE");
      window["register_client_update_callback"](updateGameData);
      setSocket(window["socket"]);
    }
  }, [gameLoaded]);

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
      <div>
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
    </div>
  );
};

export default App;
