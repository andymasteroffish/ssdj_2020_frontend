var socket

//player info

var in_game = false
var my_id = -1
var my_name = null

//things that get set from backend
var cols, rows
var board = null
var players = null
var turn_num = null
var max_turns = null

var queued_board = null

//drawing
var cell_size = 50

//timing
var delta_millis = 0
var last_frame_millis = 0

var turn_time = null//2000	//set by server
var turn_timer = 0
var server_timer = 0
var cur_phase = 0		//0-nothing, 1-nothing, 2-input, 3, resolution
var waiting_for_board = true

var timing_zeno = 0.99

var padding_before_display = 400	//millis
var input_padding = 250

//these get setup once we hear from server
var input_min_time = -1
var input_max_time = -1
var anim_start_time = -1
var anim_end_time = -1

//some direction stuff
var DIR_NONE = -1
var DIR_UP = 0
var DIR_RIGHT = 1
var DIR_DOWN = 2
var DIR_LEFT = 3
var input_dir

//sounds
var mute = false
var beat_sounds = new Array(4)

//waiitng to hear from server
var STATE_NOT_CONNECTED = -1
var STATE_WAITING = 0
var STATE_PLAYING = 1
var game_state = STATE_NOT_CONNECTED

var waiting_message = "Waiting on server"



function preload(){
	console.log("luv 2 load")
	beat_sounds[0] = loadSound("sounds/click2.wav")
	beat_sounds[1] = loadSound("sounds/click2.wav")
	beat_sounds[2] = loadSound("sounds/wood.wav")
	beat_sounds[3] = loadSound("sounds/ding.wav")
}

function setup_timing(){
	console.log('set timing')
	input_min_time = turn_time*0.5-input_padding
	input_max_time = turn_time*0.5+input_padding

	anim_start_time = turn_time*0.75
	anim_end_time = anim_start_time + 300
}

function setup() {
	var canv = createCanvas(350,350);
	canv.parent("canvas_holder")

	masterVolume(0.2)

	//socket = new WebSocket("ws://localhost:3000")
    socket = new WebSocket("ws://ssdj-game.herokuapp.com:80")

    socket.onopen = function (event) {
		console.log("open for bizzness")
		add_join_ui()
	};

	socket.onmessage = function (event) {
  		process_msg(event.data)
	}

	//key presses
	$(document).keydown(function(e) {
		get_key_press(e)
	});

	last_frame_millis = millis()
}

function draw() {
	background(255)

	text(waiting_message, width/2-100, height/2)
	// if (game_state === STATE_NOT_CONNECTED){
	// 	text("Waiting on server", width/2-100, height/2)
	// }
	// if (game_state === STATE_WAITING){
	// 	text("Game starting soon", width/2-100, height/2)
	// }

	if (game_state === STATE_PLAYING){
		update_game()
	}


	//draw the board
	if (board != null){
		draw_board()
		draw_timing_ui()
	}
}



function get_key_press(e){
	console.log("ya pressed "+e.which)
	if (game_state == STATE_PLAYING && in_game){
		if (input_dir == -1 && turn_timer >= input_min_time && turn_timer <= input_max_time){
			if (e.which == 37) 	input_dir = DIR_LEFT
			if (e.which == 38)	input_dir = DIR_UP
			if (e.which == 39)	input_dir = DIR_RIGHT
			if (e.which == 40)	input_dir = DIR_DOWN
			
			let val = {
	    		type:"client_move",
	    		key:e.which
	    	}
	    	socket.send(JSON.stringify(val));
	    }
	}

    if (e.which == 77){
    	mute = !mute
    	console.log("mute: "+mute)
    }
}



function process_msg(data){
	//console.log(data)

	let msg = data
	try {
		msg = JSON.parse(data)
	}catch(e){
		console.log("not json: "+msg)
		return
	}

	console.log("I got a: "+msg.type)

	//if it has game info, we can update
	if (msg.info != null){
		get_board(msg.info)
	}

	if (msg.wait_message != null){
		waiting_message = msg.wait_message
	}

	if (msg.type === "wait_pulse"){
		if (game_state != STATE_WAITING){
			game_state = STATE_WAITING
		}
		update_board()
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

	// if (msg.type === "game_start"){
	// 	console.log("I start it")
	// 	game_state = STATE_PLAYING
	// }

	if (msg.type === "board" ){
		got_first_ping = true
		//console.log("got board from dad")
		//get_board(msg)
	}

	if (msg.type === "pulse"){
		if (game_state != STATE_PLAYING){
			game_state = STATE_PLAYING
			set_top_div_on_game_start()
		}
		//console.log("papa pulse: "+msg.phase)
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


function get_board(info){
	queued_board = info
	waiting_for_board = false

	//if this is the first ping, do some stuff
	if (board == null){
		update_board()
		turn_timer = turn_time*0.75 - padding_before_display
	}

	// //testing
	// let my_time = Date.now()
	// console.log("my time: "+my_time)
	// console.log("server : "+info.time)
	// console.log("   dif : "+(my_time-info.time))

	//set the time
	//console.log("was phase:"+cur_phase+" time:" +turn_timer)
	//turn_timer = turn_time*0.75 - padding_before_display
	server_timer = turn_time*0.75 - padding_before_display
	cur_phase = 2
	//console.log("now phase:"+cur_phase+" time:" +turn_timer)
}

function update_board(){
	board = queued_board.board
	players = queued_board.players
	turn_num = queued_board.turn_num
	max_turns = queued_board.max_turn_num

	update_player_info_div(players)

	queued_board = null
}

function draw_arrow(x,y,dir){
	push()
	translate(x,y)

	rotate(PI/2 * dir)

	strokeWeight(3)
	stroke(0)
	
	let line_length = 10
	let side_dist = 5
	line(0,-line_length,0,line_length)	//vertical
	line(0,-line_length, -side_dist, -line_length*0.25)
	line(0,-line_length, side_dist, -line_length*0.25)

	pop()
}



//test commands
function force_start(){
	socket.send(JSON.stringify({type:"force_start"}));
}
function force_end(){
	socket.send(JSON.stringify({type:"force_end"}));
}