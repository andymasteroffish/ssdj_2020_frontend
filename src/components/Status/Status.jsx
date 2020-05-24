import React from "react";
import "./Status.scss";

const Status = props => {
  const { gameData, myUuid, playerOnServer, serverMsg, currentChamp } = props;
  const statusMsg = (game_state, name, playerOnServer, serverMsg) => {
    if (!myUuid) {
      return <p>Enter your name below to join.</p>;
    } else if (gameData.game_state !== 0 && name && !playerOnServer) {
      return <p>Waiting to join when new game starts....</p>;
    } else if (gameData.game_state === 0) {
      return <p>{serverMsg}</p>;
    } else if (gameData.game_state !== 0) {
      return <p>Game in progress.</p>;
    }
  };
  const champName = currentChamp => {
    if (currentChamp.uuid === myUuid) {
      return (
        <span>
          <strong className={currentChamp.sprite_pack}>You</strong> are
        </span>
      );
    } else {
      return (
        <span>
          <strong className={currentChamp.sprite_pack}>
            {currentChamp.disp_name}
          </strong>{" "}
          is
        </span>
      );
    }
  };
  return (
    <div className="Status panel">
      <h4>STATUS</h4>
      <div className="boxtext status-box">
        {statusMsg(gameData.game_state, myUuid, playerOnServer, serverMsg)}
        {currentChamp && <p>{champName(currentChamp)} the current champ.</p>}
      </div>
    </div>
  );
};
export default Status;
