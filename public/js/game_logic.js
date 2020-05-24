//----------------------
// Game Logic
//
// I handle non-drawing elements of controlling the game
// Core game logic is handled on the server, but things still need to be trakced and updated locally
//----------------------

//getting input
var input_time_window = 50	//how long after the first press the second one must come
var input_send_time = null	//set once the first input comes in
var input1 = null
var input2 = null

var slash_key = 83	//s
var dash_key = 68	//d

var input_info = null



//once we get timing info from the server we can setup some values to use locally
//called once as soon as we connect
function setup_timing(){
	console.log('set timing')
	input_min_time = turn_time*0.5-input_padding
	input_max_time = turn_time*0.5+input_padding

	anim_start_time = turn_time*0.75
	anim_end_time = anim_start_time + 300
}

//handles things that should happen every frame, even when the game is not playing
function update_general(){
	//timing
	delta_millis = millis() - last_frame_millis
	last_frame_millis = millis()

}

//handles local timing and other things that are done locally every frame
//called every frame when gamestate is STATE_PLAYING
function update_game(){
	turn_timer += delta_millis
	server_timer += delta_millis

	//do we have input waiting to send?
	if (input1 != null && input_info == null && millis() >= input_send_time){
		input_info = make_user_input(input1, input2)
		//console.log(input_info)
		send_user_input(input_info)
	}

	//zeno the turn timer towards the server time
	let target_time = server_timer
	if ( abs(turn_timer-(server_timer+turn_time)) < abs(turn_timer-target_time) ){
		target_time = server_timer+turn_time
	}
	if ( abs(turn_timer-(server_timer-turn_time)) < abs(turn_timer-target_time) ){
		target_time = server_timer-turn_time
	}
	turn_timer = timing_zeno*turn_timer + (1.0-timing_zeno)*target_time

	//don't let the timer hit the action beat if we're still waiting on the board
	if (turn_timer > turn_time*0.75 - padding_before_display && waiting_for_board){
		turn_timer = turn_time*0.75 - padding_before_display
	}

	//check if we've hit the next beat
	if (turn_timer < turn_time*0.25 && cur_phase == 3 ){
		cur_phase = 0
		play_beat(cur_phase)
	}
	if (turn_timer >= turn_time*0.25 && cur_phase == 0 ){
		cur_phase = 1
		play_beat(cur_phase)
	}
	if (turn_timer >= turn_time*0.50 && cur_phase == 1 ){
		cur_phase = 2
		play_beat(cur_phase)
	}
	if (turn_timer >= turn_time*0.75 && cur_phase == 2 && !waiting_for_board){
		cur_phase = 3
		play_beat(cur_phase)
	}


	if (cur_phase == 3 && queued_board != null){
		refresh_board()
		//input_dir = DIR_NONE
	}
	if (turn_timer >= turn_time){
		turn_timer -= turn_time
		waiting_for_board = true
	}
	if (server_timer >= turn_time){
		server_timer -= turn_time
	}
}

//called when a key is pressed
function game_keypress(keyCode){
	//console.log("papa press "+keyCode)


	if (game_state == STATE_PLAYING && in_game){
		if (input_info == null && turn_timer >= input_min_time && turn_timer <= input_max_time){
			if (input1 == null){
				//TODO: make sure the input keys are valid
				input1 = keyCode
				input_send_time = millis() + input_time_window
				return
			}

			if (input2 == null){
				input2 = keyCode

				input_info = make_user_input(input1, input2)
				//console.log(input_info)
				//console.log("it took "+(millis()-(input_send_time-input_time_window)))

				send_user_input(input_info)
			}
	    }
	}
}

function make_user_input(key1, key2){
	let dir = DIR_NONE
	if (key1 == 37 || key2 == 37) 	dir = DIR_LEFT
	if (key1 == 38 || key2 == 38)	dir = DIR_UP
	if (key1 == 39 || key2 == 39)	dir = DIR_RIGHT
	if (key1 == 40 || key2 == 40)	dir = DIR_DOWN

	let action = INPUT_NONE
	if (dir != DIR_NONE){
		action = INPUT_MOVE
	}
	if (key1 == dash_key || key2 == dash_key && dir != DIR_NONE){
		action = INPUT_DASH
	}
	if ( key1 == slash_key || key2 == slash_key){
		if (dir != DIR_NONE){
			action = INPUT_SLASH
		}else{
			action = INPUT_PARRY
		}
	}

	if (action == INPUT_NONE){
		console.log('uh oh bad input')
	}

	return{
		dir:dir,
		action:action
	}

}

//updates the board to match the queued one
//called once per turn cycle
function refresh_board(){
	if (queued_board == null){
		console.log("no board to update")
		return
	}

	//console.log("refresh now pls")

	game_state = queued_board.game_state
	board = queued_board.board
	players = queued_board.players
	turn_num = queued_board.turn_num
	max_turns = queued_board.max_turn_num

	//console.log("players:")
	//console.log(players)
	//console.log("game state: "+game_state)

	input_info = null
	input1 = null
	input2 = null

	refresh_player_animators(players)

	send_callback_info(players, game_state)
	//window.client_update_callback(players)

	queued_board = null
}

function send_callback_info(_players, _game_state){
	let info = {
		players:_players,
		game_state:_game_state,
		waiting_message:waiting_message
	}
	window.client_update_callback(info)
}
