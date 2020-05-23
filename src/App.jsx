import React, { useState, useEffect } from "react";
import Instructions from "./components/Instructions/Instructions.jsx";
import PlayersPanel from "./components/PlayersPanel/PlayersPanel.jsx";

import "./App.scss";

const App = () => {
  const [playerData, updatePlayerData] = useState([]);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [socket, setSocket] = useState();

  const gameLoaded =
    !!window["register_client_update_callback"] && !!window["socket"];

  console.log(`GAME LOADED? ${gameLoaded}`);

  useEffect(() => {
    if (gameLoaded) {
      console.log("REGISTERING GAME DATA PIPE");
      window["register_client_update_callback"](updatePlayerData);
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
        {
          // <GameComponent />}
        }
        <div>
          <PlayersPanel
            playerData={playerData}
            name={name}
            setName={setName}
            addPlayer={addPlayer}
            joined={joined}
          />
          <Instructions />
        </div>
      </div>
    </div>
  );
};

export default App;
