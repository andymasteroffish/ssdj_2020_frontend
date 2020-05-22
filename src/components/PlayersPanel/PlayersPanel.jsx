import React from "react";
import "./PlayersPanel.scss";

const PlayersPanel = props => {
  const { name, setName, playerData, addPlayer, joined } = props;

  const updateName = event => {
    setName(event.target.value);
  };
  const handlePlayerJoin = event => {
    addPlayer(name);
  };

  return (
    <div className="PlayersPanel">
      {!joined && (
        <div>
          <input type="text" value={name} onChange={updateName} />
          <button onClick={handlePlayerJoin}>Join</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Games Played</th>
          </tr>
        </thead>
        <tbody>
          {playerData &&
            playerData.map((data, idx) => (
              <tr key={idx}>
                <td className={data.disp_name === name ? "current-player" : ""}>
                  {data.disp_name}
                </td>
                <td>{data.games_played}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersPanel;
