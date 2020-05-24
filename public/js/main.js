//----------------------
// Main
//
// I'm the spring board that calls everything else
// I am mostly comprised of p5.js functions
// these functions get called automaticly by p5.js
//----------------------

//things that get set from backend
var cols, rows;
var board = null;
var players = null;
var turn_num = null;
var max_turns = null;

var queued_board = null;

//timing
var delta_millis = 0;
var last_frame_millis = 0;

var turn_time = null; //set by server when we first connect
var turn_timer = 0;
var server_timer = 0;
var cur_phase = 0; //0-nothing, 1-nothing, 2-input, 3-resolution
var waiting_for_board = true;

var timing_zeno = 0.99; //how quickly the current time will try to match the time we got from the server

var padding_before_display = 400; //millis
var input_padding = 250;

//these get setup once we hear from server in game_logic/setup_timing()
var input_min_time = -1;
var input_max_time = -1;
var anim_start_time = -1;
var anim_end_time = -1;

//player info
var in_game = false;
var my_id = -1;
var my_name = null;

//some direction stuff
const DIR_NONE = -1;
const DIR_UP = 0;
const DIR_RIGHT = 1;
const DIR_DOWN = 2;
const DIR_LEFT = 3;
var input_dir; //kill me

var INPUT_NONE = 0;
var INPUT_MOVE = 1;
var INPUT_SLASH = 2;
var INPUT_DASH = 3;
var INPUT_PARRY = 4;

//waiting to hear from server
const STATE_NOT_CONNECTED = -1;
const STATE_WAITING = 0;
const STATE_PLAYING = 1;
var game_state = STATE_NOT_CONNECTED;

var waiting_message = "Waiting on server";

//hooks
window.client_update_callback = function () {};

window.register_client_update_callback = function(callback) {
  window.client_update_callback = callback;
};

//using the p5js structure here, which has a few functions it will call automaticly
//preload runs before everything else. All assets should be loaded here
//https://p5js.org/reference/#/p5/preload
function preload() {
  load_sounds();
  load_player_sprites();
  load_ui_sprites()
}

//p5 setup function. called once everything loads
//all logic setup should go here
//https://p5js.org/reference/#/p5/setup
function setup() {
  //creates the canvas where the p5 sketch will render
  var canv = createCanvas(315, 500);
  canv.parent("canvas_holder"); //put the canvas in the right div, otherwise if just adds a new element to the DOM

  //set the sound playback volume
  masterVolume(0.2);

  last_frame_millis = millis();
}

//p5 draw function. called every frame
//draw is kind of a bad name and this is also where update logic lives
//things that need to happen repeatedly go here
//https://p5js.org/reference/#/p5/draw
function draw() {
  background(100);

  update_general();

  if (game_state === STATE_PLAYING) {
    update_game();
  }

  draw_game();

  textAlign(LEFT);
  text(waiting_message, width / 2 - 100, 80);
}

//p5 key press function. triggers on keypress
//ascii value of key stored in keyCode
//https://p5js.org/reference/#/p5/keyPressed
function keyPressed() {
  //console.log("p5 say:"+keyCode)

  //check if the game cares about that
  game_keypress(keyCode);

  //toggle mute with 'm'
  // if (keyCode == 77) {
  //   mute = !mute;
  //   console.log("mute: " + mute);
  // }
}

function mousePressed(){
  check_mute_on_mouse(mouseX, mouseY)
}

//test commands to be called from console
function force_start() {
  socket.send(JSON.stringify({ type: "force_start" }));
}
function force_end() {
  socket.send(JSON.stringify({ type: "force_end" }));
}
//this will make the game hang on the input beat until I manually send the signal to resolve
function start_slow_test(){
  socket.send(JSON.stringify({ type: "force_slow_test" }));
  socket.send(JSON.stringify({ type: "force_start" }));
  input_padding = 9999999
  setup_timing()
}
function resolve(){
  socket.send(JSON.stringify({ type: "resolve" }));
}
