//----------------------
// Communication
//
// I handle getting and receiving messages from the websocket
//----------------------

var socket

var remote_adress = "ws://ssdj-game.herokuapp.com:80"
//uncomment this line to test locally
//remote_adress = "ws://localhost:3000"

function setup_websocket(){
	console.log("opening ")
	socket = new WebSocket(remote_adress)

    //things to happen once socket is connected
    socket.onopen = function (event) {
		console.log("open for bizzness")
		add_join_ui()
	};

	//getting incoming messages
	socket.onmessage = function (event) {
  		process_msg(event.data)
	}
}


//deal with messages when they come in
function process_msg(data){
	//console.log(data)

	let msg = data
	try {
		msg = JSON.parse(data)
	}catch(e){
		console.log("BAD! not json: "+msg)
		return
	}

	console.log("I got a: "+msg.type)

	//if it has game info, we can update
	if (msg.info != null){
		get_board(msg.info)
	}

	//if it has a wait message, we can update
	if (msg.wait_message != null){
		waiting_message = msg.wait_message
	}

	//after that, check message type and to the apropriate thing
	if (msg.type === "wait_pulse"){
		if (game_state != STATE_WAITING){
			game_state = STATE_WAITING
		}
		refresh_board()
	}

	if (msg.type === "connect_confirm"){
		console.log("I'm here!")
		game_state = STATE_WAITING
		turn_time = msg.turn_time
		cols = msg.cols
		rows = msg.rows
		setup_timing()
	}

	if (msg.type === "join_confirm"){
		console.log("im in game!")
		in_game = true
		my_id = msg.player_info.id
		my_name = msg.player_info.disp_name
		set_player_joined_ui()
	}


	if (msg.type === "board" ){
		got_first_ping = true
	}

	if (msg.type === "pulse"){
		if (game_state != STATE_PLAYING){
			game_state = STATE_PLAYING
			set_top_div_on_game_start()
		}
		let prc = msg.phase * 0.25
		server_timer = turn_time*prc - padding_before_display
		if (server_timer < 0){
			server_timer += turn_time
		}
	}

	if (msg.type === "game_end"){
		game_state = STATE_WAITING
		turn_timer = 0
		add_join_ui()
		update_player_info_div(msg.info.players)
	}

}

//get board info from the server
//generally this is queued so it won't display until the beat
function get_board(info){
	queued_board = info
	waiting_for_board = false

	//if this is the first ping, do some stuff
	if (board == null){
		refresh_board()
		turn_timer = turn_time*0.75 - padding_before_display
	}

	//reset set the server timer
	server_timer = turn_time*0.75 - padding_before_display
	cur_phase = 2
	//console.log("now phase:"+cur_phase+" time:" +turn_timer)
}