import React from "react";
import "./Game.scss";
// import useScript from "../../hooks/useScript";

const Game = () => {
  console.log("RERENDERING GAME");
  return (
    <div className="Game">
      <div id="top_holder"></div>
      <div id="canvas_holder"></div>
      <div id="player_info"></div>
    </div>
  );
};

export default Game;
