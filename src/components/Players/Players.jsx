import React, { useState } from "react";

import "./Players.scss";

const Players = props => {
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
    <div className="Players panel">
      {!name && (
        <div>
          <h4>ENTER NAME</h4>
          <form onSubmit={savePlayerName}>
            <input type="text" value={tempName} onChange={updateName} />
          </form>
        </div>
      )}
      {name && <p>Your name is: {name}</p>}

      {gameData.game_state === 0 && name && !playerOnServer && (
        <div>
          <button onClick={handleRejoin}>Click to rejoin</button>
        </div>
      )}
      <h5>PLAYERS</h5>
      <ul className="player-list">
        {players[0] &&
          players.map((data, idx) => {
            return (
              <li
                key={idx}
                className={data.disp_name === name ? "current-player" : ""}
              >
                {data.disp_name}
              </li>
            );
          })}
        {!players[0] && <li>No players yet. </li>}
      </ul>
    </div>
  );
};

export default Players;
