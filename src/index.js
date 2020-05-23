import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const loadScript = opts => {
  return new Promise(function(resolve, reject) {
    const {
      url,
      async = false,
      integrity,
      crossOrigin,
      type = "text/javascript"
    } = opts;

    var script = document.createElement("script");
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    script.async = async;
    script.type = type;

    if (integrity) {
      script.integrity = integrity;
    }
    if (crossOrigin) {
      script.crossOrigin = crossOrigin;
    }
    document.getElementsByTagName("head")[0].appendChild(script);
  });
};

let loader = loadScript({
  url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js",
  integrity: "sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=",
  crossOrigin: "anonymous"
});

loader.then(() => {
  loader = loadScript({
    url: "libraries/p5.js"
  });
});

loader.then(() => {
  loader = loadScript({
    url: "libraries/p5.sound.js"
  });
});

loader.then(() => {
  loader = loadScript({
    url: "js/main.js"
  });
});

loader.then(() => {
  loader = loadScript({
    url: "js/game_render.js"
  });
});

loader.then(() => {
  loader = loadScript({
    url: "js/game_logic.js"
  });
});

loader.then(() => {
  loader = loadScript({
    url: "js/page_manipulation.js"
  });
});

loader.then(() => {
  loadScript({
    url: "js/communication.js"
  });
});

loader.then(() => {
  loadScript({
    url: "js/audio_player.js"
  });
});

loader.then(() => {
  loadScript({
    url: "js/player_anim.js"
  });
});

async function loadGame() {
  await loader;
  console.log("RENDERING GAME");
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}
loadGame();
