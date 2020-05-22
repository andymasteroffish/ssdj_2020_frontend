import React from "react";
import "./Game.scss";
import useScript from "../../hooks/useScript";

const Game = () => {
  useScript({
    url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js",
    integrity: "sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=",
    crossorigin: "anonymous"
  });
  useScript({
    url: "libraries/p5.js",
    async: false
  });
  useScript({
    url: "libraries/p5.sound.js",
    async: false
  });
  useScript({
    url: "js/main.js",
    async: false
  });
  useScript({
    url: "js/game_render.js",
    async: false
  });
  useScript({
    url: "js/game_logic.js",
    async: false
  });
  useScript({
    url: "js/page_manipulation.js",
    async: false
  });
  useScript({
    url: "js/communication.js",
    async: false
  });
  useScript({
    url: "js/audio_player.js",
    async: false
  });
  return (
    <div className="Game">
      <div id="top_holder"></div>
      <div id="canvas_holder"></div>
      <div id="player_info"></div>
      <div className="instructions">
        ---------
        <br />
        Press M to toggle mute (sound only plays during gameplay)
        <br />
        Use arrow keys on orange beat to move
      </div>
    </div>
  );
};

export default Game;
