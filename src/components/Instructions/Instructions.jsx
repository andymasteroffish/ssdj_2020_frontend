import React from "react";
import "./Instructions.scss";

const Instructions = () => {
  return (
    <div className="Instructions panel">
      <h4>GAME RULES</h4>
      <p>Last player standing win!</p>
      <p>
        <strong>
          Each turn, when the light flashes{" "}
          <span className="text-highlight">YELLOW</span>, each player may input
          one of the following moves:
        </strong>
      </p>
      <h5>CONTROLS</h5>
      <p>
        <strong>STEP</strong>: Arrow Keys <br /> Move one tile.
      </p>
      <p>
        <strong>SLASH</strong>: Arrow Keys + S<br /> Attack an adjacent space.
      </p>
      <p>
        <strong>DASH</strong>: Arrow Keys + D<br /> Move one tile and attack an
        adjacent space. Dasher is stunned next turn.
      </p>
      <p>
        <strong>PARRY</strong>: S
        <br /> Deflects all attacks this turn. Parrier is stunned next turn if
        not attacked.
      </p>
      <p className="text-highlight">Plays best with sound ON!</p>
    </div>
  );
};

export default Instructions;
