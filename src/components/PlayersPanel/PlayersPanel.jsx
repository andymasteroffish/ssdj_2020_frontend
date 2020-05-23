import React, { useState } from "react";
import Instructions from "./../Instructions/Instructions.jsx";

import "./PlayersPanel.scss";

const PlayersPanel = props => {
  const { name, setName, gameData, addPlayer, joined } = props;
  const [tempName, setTempName] = useState("");

  const updateName = event => {
    setTempName(event.target.value);
  };

  const savePlayerName = () => {
    setName(tempName);
    if (gameData.game_state === 0) {
      addPlayer(tempName);
    }
  };

  const players = gameData.players;

  return (
    <div className="PlayersPanel">
      {!name && (
        <div>
          <input type="text" value={tempName} onChange={updateName} />
          <button onClick={savePlayerName}>Join</button>
        </div>
      )}
      {name && (
        <div>
          <h2>Your name is: {name}</h2>
        </div>
      )}
      {name && !joined && (
        <div>
          <h3>Waiting to join game....</h3>
        </div>
      )}
      {gameData.game_state === 0 && name && joined && (
        <div>
          <h3>Waiting to others to join....</h3>
        </div>
      )}
      <table className="player-data-table">
        <thead>
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
