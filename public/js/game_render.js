//----------------------
// Game Render
//
// I handle drawing the game to the p5 canvas
//----------------------

var cell_size = 50

//renders the game to the canvas
//called every frame
function draw_game(){
	//draw the board if we have one
	if (board != null){
		draw_board()
		draw_timing_ui()
	}
}

//draws the board to the canvas
//will animate things from their previous state depending on time
function draw_board(){
	push()
	translate(0,70)

	let anim_prc = 1
	if (turn_timer > anim_start_time && turn_timer < anim_end_time){
		anim_prc = map(turn_timer, anim_start_time, anim_end_time, 0, 1)
	}

	//board
	for (let c=0; c<cols; c++){
		for (let r=0; r<rows; r++){

			let val = anim_prc*board[c][r].val + (1.0-anim_prc)*board[c][r].prev_val

			if (val > 0){
				let size = map(val,0,4,0,cell_size*0.5)
				fill(235, 219, 5)
				ellipse(c*cell_size+cell_size/2, r*cell_size+cell_size/2, size)
			}
			else{
				let size = 5
				fill(20)
				ellipse(c*cell_size+cell_size/2, r*cell_size+cell_size/2, size)
			}
		}
	}

	//players
	for (let i=0; i<players.length; i++){
		let player = players[i]

		let pos_x = anim_prc*player.x + (1.0-anim_prc)*player.prev_x
		let pos_y = anim_prc*player.y + (1.0-anim_prc)*player.prev_y
		//console.log(player.x + " vs "+player.prev_x)

		if (player.id == my_id){
			fill(0,255,0)
		}else{
			fill(255,0,0)
		}
		let padding = 10
		rect(pos_x*cell_size+padding, pos_y*cell_size+padding, cell_size-padding*2, cell_size-padding*2)
	
		if (player.id == my_id && input_dir > DIR_NONE){
			draw_arrow(player.x*cell_size+cell_size/2,player.y*cell_size+cell_size/2, input_dir)
		}
	}
	pop()
}

//UI elements at the top of the canvas
function draw_timing_ui(){
	push()
	translate(75,40)
	let spacing = 50
	let total_width = spacing*4
	let time_prc = turn_timer/turn_time

	let base_size = 20
	let big_size = 40
	let shrink_time = 200

	//draw nodes
	for (let i=0; i<4; i++){
		let target_time = i * (turn_time/4)

		fill(200)
		if (i==2)	fill(255, 163, 5)
		if (i==3)	fill(255, 0, 25)

		let small_size = base_size
		if (turn_timer>target_time && i==2){
			small_size = 30
		}
		let size = small_size
		
		if (turn_timer>target_time && turn_timer<target_time+shrink_time){
			let prc = (turn_timer-target_time) / shrink_time
			size = prc * small_size + (1-prc)*big_size
		}
		ellipse(i*spacing,0, size, size)

		//drawing the arrow
		if (i==2 && input_dir > DIR_NONE){
			draw_arrow(i*spacing,0,input_dir)
		}
	}

	//draw test lines
	if (false){
		stroke(0)
		line(0,0,total_width*time_prc,0)
		stroke(200,50,50)
		line(0,30,total_width*(server_timer/turn_time),30)
	}

	if (game_state == STATE_PLAYING){
		fill(0)
		text("turn "+turn_num+" of "+max_turns, 10, 30)
	}

	pop()
}

//draws an arrow at the given location
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