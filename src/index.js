import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const loadScript = opts => {
  const {
    url,
    async = true,
    integrity,
    crossOrigin,
    type = "text/javascript",
    resolve,
    reject
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
};

/*
const jQueryLoader = new Promise(function(resolve, reject) {
  console.log("LOADING JQUERY");
  loadScript({
    url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js",
    integrity: "sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=",
    crossOrigin: "anonymous",
    resolve: resolve,
    reject: reject
  });
});
*/

const p5loader = async () => {
  //await jQueryLoader;
  console.log("LOADING p5");

  return new Promise(function(resolve, reject) {
    loadScript({
      url: "libraries/p5.js",
      resolve: resolve,
      reject: reject
    });
  });
};

const p5soundLoader = async () => {
  await p5loader();
  console.log("LOADING p5sound");

  return new Promise(function(resolve, reject) {
    loadScript({
      url: "libraries/p5.sound.js",
      resolve: resolve,
      reject: reject
    });
  });
};

const mainLoader = async () => {
  await p5soundLoader();
  console.log("LOADING main");

  return new Promise(function(resolve, reject) {
    loadScript({
      url: "js/main.js",
      resolve: resolve,
      reject: reject
    });
  });
};

const playerAnimLoader = async () => {
  await mainLoader();
  console.log("LOADING player_anim");

  return new Promise(function(resolve, reject) {
    loadScript({
      url: "js/player_anim.js",
      resolve: resolve,
      reject: reject
    });
  });
};

const gameRenderLoader = async () => {
  await playerAnimLoader();
  console.log("LOADING game_render");

  return new Promise(function(resolve, reject) {
    loadScript({
      url: "js/game_render.js",
      resolve: resolve,
      reject: reject
    });
  });
};

const gameLogicLoader = async () => {
  await gameRenderLoader();
  console.log("LOADING game_logic");

  return new Promise(function(resolve, reject) {
    loadScript({
      url: "js/game_logic.js",
      resolve: resolve,
      reject: reject
    });
  });
};

const communicationLoader = async () => {
  await gameLogicLoader();
  console.log("LOADING communication");

  return new Promise(function(resolve, reject) {
    loadScript({
      url: "js/communication.js",
      resolve: resolve,
      reject: reject
    });
  });
};

const audioPlayerLoader = async () => {
  await communicationLoader();
  console.log("LOADING audio_player");

  return new Promise(function(resolve, reject) {
    loadScript({
      url: "js/audio_player.js",
      resolve: resolve,
      reject: reject
    });
  });
};

async function loadGame() {
  await audioPlayerLoader();

  console.log("RENDERING GAME");
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}
loadGame();
