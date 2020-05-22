//----------------------
// Game Logic
//
// I handle non-drawing elements of controlling the game
// Core game logic is handled on the server, but things still need to be trakced and updated locally
//----------------------

//once we get timing info from the server we can setup some values to use locally
//called once as soon as we connect
function setup_timing(){
	console.log('set timing')
	input_min_time = turn_time*0.5-input_padding
	input_max_time = turn_time*0.5+input_padding

	anim_start_time = turn_time*0.75
	anim_end_time = anim_start_time + 300
}

//handles local timing and other things that are done locally every frame
//called every frame
function update_game(){
	//timing
	delta_millis = millis() - last_frame_millis
	last_frame_millis = millis()

	turn_timer += delta_millis
	server_timer += delta_millis

	//zeno the turn timer towards the server time
	let target_time = server_timer
	if ( abs(turn_timer-(server_timer+turn_time)) < abs(turn_timer-target_time) ){
		console.log("pump it up")
		target_time = server_timer+turn_time
	}
	if ( abs(turn_timer-(server_timer-turn_time)) < abs(turn_timer-target_time) ){
		console.log("smack it down")
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
		input_dir = DIR_NONE
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
	if (game_state == STATE_PLAYING && in_game){
		if (input_dir == -1 && turn_timer >= input_min_time && turn_timer <= input_max_time){
			//arrow keys
			if (keyCode == 37) 	input_dir = DIR_LEFT
			if (keyCode == 38)	input_dir = DIR_UP
			if (keyCode == 39)	input_dir = DIR_RIGHT
			if (keyCode == 40)	input_dir = DIR_DOWN
			
			let val = {
	    		type:"client_move",
	    		key:keyCode
	    	}
	    	socket.send(JSON.stringify(val));
	    }
	}
}

//updates the board to match the queued one
//called once per turn cycle
function refresh_board(){
	if (queued_board == null){
		console.log("no board to update")
		return
	}

	board = queued_board.board
	players = queued_board.players
	turn_num = queued_board.turn_num
	max_turns = queued_board.max_turn_num

	update_player_info_div(players)

	queued_board = null
}