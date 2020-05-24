import React from "react";
import "./Status.scss";

const Status = props => {
  const { gameData, name, playerOnServer, serverMsg } = props;
  // {!name && }
  // { && (
  //
  // )}
  // {gameData.game_state === 0 && name && playerOnServer && (
  //   <p>Waiting to start game when others join....</p>
  // )}
  const statusMsg = (game_state, name, playerOnServer, serverMsg) => {
    if (!name) {
      return <p>Enter your name below to join.</p>;
    } else if (gameData.game_state !== 0 && name && !playerOnServer) {
      return <p>Waiting to join when new game starts....</p>;
    } else if (gameData.game_state === 0) {
      return <p>{serverMsg}</p>;
    }
  };
  return (
    <div className="Status panel">
      <h4>STATUS</h4>
      <div className="boxtext status-box">
        {statusMsg(gameData.game_state, name, playerOnServer, serverMsg)}
      </div>
    </div>
  );
};
export default Status;
