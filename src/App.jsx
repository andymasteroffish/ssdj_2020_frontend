import React, { useState, useEffect } from "react";
import PlayersPanel from "./components/PlayersPanel/PlayersPanel.jsx";
import { v4 as uuid } from "uuid";

import "./App.scss";

const App = () => {
  const [gameData, updateGameData] = useState({
    players: [],
    game_state: undefined
  });
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [myUuid, setMyUuid] = useState("");

  const gameState = gameData.game_state;
  const players = gameData.players;
  const playerOnServer = players.some(player => {
    return player.uuid === myUuid;
  });

  const addPlayer = name => {
    const id = uuid();
    setMyUuid(id);
    console.log(`ADD PLAYER: ${name}`);
    const val = {
      type: "join_request",
      disp_name: name,
      uuid: id
    };

    setJoined(true);
    setJoining(true);
    window.socket.send(JSON.stringify(val));
  };

  const gameLoaded =
    !!window["register_client_update_callback"] && !!window["socket"];

  useEffect(() => {
    if (gameLoaded) {
      console.log("REGISTERING GAME DATA PIPE");
      window["register_client_update_callback"](updateGameData);
    }
  }, [gameLoaded]);

  useEffect(() => {
    if (!joining && !joined && gameState === 0 && !playerOnServer && myUuid) {
      console.log("JOINING IN RESPONSE TO STATE CHANGE");
      // addPlayer(name);
    }
  }, [gameState, playerOnServer, myUuid, name, joining, joined]);

  useEffect(() => {
    if (joined && !joining && !playerOnServer) {
      setJoined(false);
    } else if (joined && joining && playerOnServer) {
      setJoining(false);
    }
  }, [joined, joining, playerOnServer]);

  return (
    <div className="App">
      <div>
        <PlayersPanel
          gameData={gameData}
          name={name}
          setName={setName}
          addPlayer={addPlayer}
          playerOnServer={playerOnServer}
        />
      </div>
    </div>
  );
};

export default App;
