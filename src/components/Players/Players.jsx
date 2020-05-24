import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

import "./Players.scss";

const Players = props => {
  const { name, setName, gameData, addPlayer, playerOnServer, myUuid } = props;
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

  const playerNameClass = data => {
    let className = `${data.sprite_pack}`;
    if (data.is_dead) {
      className += " dead";
    }
    if (data.win_streak > 0) {
      className += " winner";
    }
    return className;
  };

  const icons = data => {
    const thisPlayer = data.uuid === myUuid;
    const winner = data.win_streak > 0;
    return (
      <span>
        {thisPlayer && <FontAwesomeIcon icon={faStar} />}
        {thisPlayer && winner && " "}
        {winner && <FontAwesomeIcon icon={faCrown} />}
        {winner && " "}
        {winner && data.win_streak}
      </span>
    );
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
      <ul className="boxtext player-list">
        {players[0] &&
          players.map((data, idx) => {
            return (
              <li key={idx} className={playerNameClass(data)}>
                {data.disp_name}
                {icons(data)}
              </li>
            );
          })}
        {!players[0] && <li>No players yet. </li>}
      </ul>
    </div>
  );
};

export default Players;
