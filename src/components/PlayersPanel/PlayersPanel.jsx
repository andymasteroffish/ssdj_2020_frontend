import React, { useState } from "react";
import Instructions from "./../Instructions/Instructions.jsx";

import "./PlayersPanel.scss";

const PlayersPanel = props => {
  const { name, setName, gameData, addPlayer, playerOnServer } = props;
  const [tempName, setTempName] = useState("");

  const updateName = event => {
    setTempName(event.target.value);
  };

  const savePlayerName = () => {
    if (tempName === "") {
      return;
    }
    setName(tempName);
    if (gameData.game_state === 0) {
      console.log("JOINING WAITING SERVER ON NAME ADD");
      addPlayer(tempName);
    }
  };

  const players = gameData.players;

  const handleRejoin = () => {
    if (gameData.game_state === 0) {
      console.log("JOINING PLAYER READY CLICK");
      addPlayer(name);
    }
  };

  return (
    <div className="PlayersPanel">
      {!name && (
        <div>
          <form onSubmit={savePlayerName}>
            <input type="text" value={tempName} onChange={updateName} />
            <button type="submit" onClick={savePlayerName}>
              Join
            </button>
          </form>
        </div>
      )}
      {name && (
        <div>
          <h2>Your name is: {name}</h2>
        </div>
      )}
      {gameData.game_state !== 0 && name && !playerOnServer && (
        <div>
          <h3>Waiting to join when new game starts....</h3>
        </div>
      )}
      {gameData.game_state === 0 && name && playerOnServer && (
        <div>
          <h3>Waiting to start game when others join....</h3>
        </div>
      )}
      {gameData.game_state === 0 && name && !playerOnServer && (
        <div>
          <button onClick={handleRejoin}>Click to rejoin</button>
        </div>
      )}
      <table className="player-data-table">
        <thead>
          <tr>
            <th colSpan="2">Current players</th>
          </tr>
          <tr>
            <th>Name</th>
            <th>Games Played</th>
          </tr>
        </thead>
        <tbody>
          {players[0] &&
            players.map((data, idx) => {
              return (
                <tr key={idx}>
                  <td
                    className={data.disp_name === name ? "current-player" : ""}
                  >
                    {data.disp_name}
                  </td>
                  <td>{data.games_played}</td>
                </tr>
              );
            })}
          {!players[0] && (
            <tr>
              <td>No players yet.</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>

      <Instructions />
    </div>
  );
};

export default PlayersPanel;
