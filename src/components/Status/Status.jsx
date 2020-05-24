import React from "react";
import "./Status.scss";

const Status = props => {
  const { gameData, name, playerOnServer } = props;
  return (
    <div className="Status panel">
      <h4>STATUS</h4>
      {!name && <p>Enter your name below to join.</p>}
      {gameData.game_state !== 0 && name && !playerOnServer && (
        <p>Waiting to join when new game starts....</p>
      )}
      {gameData.game_state === 0 && name && playerOnServer && (
        <p>Waiting to start game when others join....</p>
      )}
    </div>
  );
};

// {name && <h2>Your name is: {name}</h2> }
// {gameData.game_state !== 0 && name && !playerOnServer && (
//   <div>
//     <h3></h3>
//   </div>
// )}
// {gameData.game_state === 0 && name && playerOnServer && (
//   <div>
//     <h3></h3>
//   </div>
// )}

export default Status;
