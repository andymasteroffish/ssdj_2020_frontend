# SSDJ 2020 frontend

Created for Super Social Distance Jam!
http://ssdj.am/

This is the frontend of the game.
The backend repo is here: https://github.com/andymasteroffish/ssdj_2020_backend

This game is made using P5.js
Reference pages here: https://p5js.org/reference/

use yarn start to test

ass this line to package.json to make build
  "homepage": "http://andymakesgames.com/extras/tests/ssdj_2020/build",

## Basic structure

Every "turn" is broken up into 4 beats. Players input their move on beat 3, then the server processes everybody's move and sends it back. The move gets shown on beat 4.

All players move simultaneously.

The goal is for the server to finish processing and send out the move _before_ the 4th beat

## Testing

Use `yarn start` to test locally

The backend repo has instructions for how to run that locally as well

You can uncomment a line at the top of js/communication.js to use the local websocket server

## Files

Most of the relevant code is in /js

#### audio_player.js

Handles playing sounds

#### communication.js

Handles sending and receiving info from the server

#### game_logic.js

The core game logic is handled on the server, but some things need to be updated and maintained on the frontend

#### game_render.js

Handles drawing the game to the canvas

#### main.js

Base file. Not much logic here, just calling out to the other files.
Pretty much all of the game variables live here

#### page_manipulation.js

Handles editing and changing non-canvas elements of the DOM
(Andy here, this is the thing that will most benefit from outside help. Maybe there's a better way to do it and it shouldn't exist at all!)
