//----------------------
// Game Render
//
// I handle drawing the game to the p5 canvas
//----------------------

var cell_size = 35

var anims = []

var mute_icons = []
var mute_icon_pos = {x:420,y:10}

//environment sprites
var timer_sprites = []
var grass_sprite = null
var rock_sprite = null
var tress_sprite = null

function load_ui_sprites(){
	mute_icons.push(loadImage("img/ui/mute_off.png"))
	mute_icons.push(loadImage("img/ui/mute_on.png"))

	for (let i=0; i<5; i++){
		timer_sprites.push(loadImage("img/Environment/status_"+i.toString()+".png"))
	}
	rock_sprite = loadImage("img/Environment/rock.png")
	tree_sprite = loadImage("img/Environment/tree.png")
	grass_sprite = loadImage("img/Environment/grass.png")
}

//renders the game to the canvas
//called every frame
function draw_game(){
	//draw the board if we have one
	if (board != null){
		draw_board()
		draw_timing_ui()
	}

	//draw if we're muted
	image(mute_icons[(mute ? 1 : 0)],mute_icon_pos.x, mute_icon_pos.y)
}

//draws the board to the canvas
//will animate things from their previous state depending on time
function draw_board(){
	push()
	translate(cell_size/2,110)

	imageMode(CENTER)

	for (let i=0; i<anims.length; i++){
		update_player_anim(anims[i])
	}

	let anim_prc = 1
	if (turn_timer > anim_start_time && turn_timer < anim_end_time){
		anim_prc = map(turn_timer, anim_start_time, anim_end_time, 0, 1)
	}

	//board
	for (let c=0; c<cols; c++){
		for (let r=0; r<rows; r++){

			image(grass_sprite, c*cell_size, r*cell_size)

			if (board[c][r].passable == false){
				if (c==0 || c==cols-1 || r==0 || r==rows-1 ){
					image(rock_sprite, c*cell_size, r*cell_size)
				}else{
					image(tree_sprite, c*cell_size, r*cell_size)
				}
			}
			// else{
			// 	fill(20)
			// 	ellipse(c*cell_size, r*cell_size, 5)
			// }
		}
	}

	//players
	for (let i=0; i<anims.length; i++){
		let player = anims[i].owner

		let pos_x = anim_prc*player.x + (1.0-anim_prc)*player.prev_state.x
		let pos_y = anim_prc*player.y + (1.0-anim_prc)*player.prev_state.y

		//jabbing forward then back on slash or if a move failed
		if (player.move_info != null){
			if (player.move_info.succeeded == false || player.input_type == INPUT_SLASH){
				let jab_prc = anim_prc
				//delaying the slash movemet
				if(player.input_type == INPUT_SLASH){
					let new_floor = 0.75
					if (jab_prc < new_floor){
						jab_prc = 0
					}else{
						jab_prc = map(jab_prc,new_floor,1, 0,1, true)
					}
				}
				//have it go form 0 to 0.5 and then back down
				if (jab_prc > 0.5)	jab_prc = 1.0-anim_prc

				let other_x = player.move_info.target_pos.x
				let other_y = player.move_info.target_pos.y
				pos_x = (1.0-jab_prc)*player.x + jab_prc*other_x
				pos_y = (1.0-jab_prc)*player.y + jab_prc*other_y
			}
		}
		
		anims[i].draw_pos = {x : pos_x*cell_size, y : pos_y*cell_size}
		draw_player_anim(anims[i])
	}

	//name tags
	for (let i=0; i<anims.length; i++){
		if (!anims[i].owner.is_dead){
			draw_name_tag(anims[i])
		}
	}
	pop()
}

//UI elements at the top of the canvas
function draw_timing_ui(){
	let spacing = 50
	let total_width = spacing*4
	let time_prc = turn_timer/turn_time

	push()
	translate(width/2-(spacing*3)/2-cell_size/2,40)
	

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
		if (i==2 && input_info != null){
			if (input_info.action == INPUT_PARRY){
				stroke(0)
				noFill()
				ellipse(i*spacing,0, size*0.6, size*0.6)
			}
			if (input_info.dir != DIR_NONE){
				draw_arrow(i*spacing,0,input_info.dir)
			}
		}
	}

	//draw test lines
	if (false){
		stroke(0)
		line(0,0,total_width*time_prc,0)
		stroke(200,50,50)
		line(0,10,total_width*(server_timer/turn_time),10)
	}

	

	pop()

	if (game_state == STATE_PLAYING){
		fill(0)
		noStroke()
		textAlign(LEFT);
		text("turn "+turn_num, 20, 30)
	}
}

function refresh_player_animators(players){
	//clear what's there
	anims = []

	//make new animators
	for (let i=0; i<players.length; i++){
		anims.push( make_animator(players[i]))
	}

	//sort so the dead are draw first
	anims.sort(function(a,b){
		return (a.owner.is_dead) ? -1 : 1
	})
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

function check_mute_on_mouse(x,y){
	console.log("checking")
	if (x>mute_icon_pos.x && x<mute_icon_pos.x+mute_icons[0].width && y>mute_icon_pos.y && y<mute_icon_pos.y+mute_icons[0].height){
		mute = !mute
	}
}