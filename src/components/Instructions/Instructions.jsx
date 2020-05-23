import React from "react";
import "./Instructions.scss";

const Instructions = () => {
  return (
    <div className="instructions">
      ---------
      <br />
      Press M to toggle mute (sound only plays during gameplay)
      <br />
      Use arrow keys on orange beat to move.
      <br />
      S+arrow = slash
      <br />
      D+arrow = dash
    </div>
  );
};

export default Instructions;
