import React from "react";
import "./Instructions.scss";

const Instructions = () => {
  return (
    <div className="instructions">
      ---------
      <br />
      Press M to toggle mute (sound only plays during gameplay)
      <br />
      Input your move on the orange beat. Last player standing wins
      <br />
      <br />
      Move (arrow keys) : move one tile
      <br />
      Slash (S + arrow) : attack adjacent tile
      <br />
      Dash (D + arrow) : move and attack, but you are stunned for your next turn
      <br />
      Parry (S) : parry any incoming attacks, protecting yourself and stunning the attacker. If you parry but are not attacked you will be stunned
    </div>
  );
};

export default Instructions;
