import React from "react";
import Instructions from "./../Instructions/Instructions.jsx";

import "./PlayersPanel.scss";

const PlayersPanel = props => {
  const { name, setName, gameData, addPlayer, joined } = props;

  const updateName = event => {
    setName(event.target.value);
  };
  const handlePlayerJoin = event => {
    addPlayer(name);
  };
  const players = gameData.players;

  return (
    <div className="PlayersPanel">
      {!joined && (
        <div>
          <input type="text" value={name} onChange={updateName} />
          <button onClick={handlePlayerJoin}>Join</button>
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
            players.map((data, idx) => (
              <tr key={idx}>
                <td className={data.disp_name === name ? "current-player" : ""}>
                  {data.disp_name}
                </td>
                <td>{data.games_played}</td>
              </tr>
            ))}
            {
              !players[0] && (
                <tr>
                  <td>No players yet.</td>
                  <td></td>
                </tr>
              )
            }
        </tbody>
      </table>

      <Instructions />
    </div>
  );
};

export default PlayersPanel;
