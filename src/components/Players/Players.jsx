import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

import "./Players.scss";

const Players = props => {
  const {
    name,
    setName,
    gameData,
    addPlayer,
    playerOnServer,
    myUuid,
    me
  } = props;
  const [tempName, setTempName] = useState("");

  const updateName = event => {
    const cappedName = event.target.value.slice(0, 8);
    setTempName(cappedName);
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
        <div className="name-display">
          <h4>ENTER NAME</h4>
          <form onSubmit={savePlayerName}>
            <input type="text" value={tempName} onChange={updateName} />
          </form>
        </div>
      )}
      {name && !me && (
        <div className="name-display">
          <p>Your name is: </p>
          <p>
            <strong>{name}</strong>
          </p>
        </div>
      )}
      {me && (
        <div className="name-display">
          <p>Your name is: </p>
          <p>
            <svg viewBox="0 0 56 18">
              <text x="0" y="15">
                {name}
              </text>
            </svg>
            <strong className={me.sprite_pack}>{name}</strong>
          </p>
        </div>
      )}

      {gameData.game_state === 0 && name && !playerOnServer && (
        <div className="join-button">
          <button onClick={handleRejoin}>JOIN</button>
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
