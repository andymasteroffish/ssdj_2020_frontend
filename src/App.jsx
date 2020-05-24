import React, { useState, useEffect, useCallback } from "react";
import Players from "./components/Players/Players.jsx";
import Instructions from "./components/Instructions/Instructions.jsx";
import Status from "./components/Status/Status.jsx";
import About from "./components/About/About.jsx";
import { ReactComponent as SlashDanceTitle } from "./img/slash_dance.svg";
import { ReactComponent as Background } from "./img/background.png";

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
  const currentChamp = gameData.winner_last_round;

  const playerOnServer = players.some(player => {
    return player.uuid === myUuid;
  });

  const serverMsg = gameData.waiting_message;

  const addPlayer = useCallback(
    name => {
      const id = myUuid || uuid();
      if (!myUuid) {
        setMyUuid(id);
      }
      console.log(`ADD PLAYER: ${name}`);
      const val = {
        type: "join_request",
        disp_name: name,
        uuid: id
      };

      setJoined(true);
      setJoining(true);
      window.socket.send(JSON.stringify(val));
    },
    [myUuid]
  );

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
      addPlayer(name);
    }
  }, [gameState, playerOnServer, myUuid, name, joining, joined, addPlayer]);

  useEffect(() => {
    if (joined && !joining && !playerOnServer) {
      setJoined(false);
    } else if (joined && joining && playerOnServer) {
      setJoining(false);
    }
  }, [joined, joining, playerOnServer]);

  return (
    <div className="App">
      <div className="game-title">
        <SlashDanceTitle />
      </div>
      <div className="interface-container">
        <div className="left column">
          <Status
            gameData={gameData}
            myUuid={myUuid}
            playerOnServer={playerOnServer}
            serverMsg={serverMsg}
            currentChamp={currentChamp}
          />
          <Players
            gameData={gameData}
            name={name}
            setName={setName}
            addPlayer={addPlayer}
            playerOnServer={playerOnServer}
            myUuid={myUuid}
          />
        </div>
        <div className="game-placeholder"></div>
        <div className="right column">
          <Instructions />
        </div>
      </div>
      <footer>
        <About />
      </footer>
      <div className="backdrop"></div>
    </div>
  );
};

export default App;
