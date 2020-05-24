//----------------------
// Game Render
//
// I handle drawing the game to the p5 canvas
//----------------------

var cell_size = 35*2

var anims = []

var mute_icons = []
var mute_icon_pos = {x:5,y:5}

//environment sprites
var timer_sprites = []
var grass_sprite = null
var rock_sprites = []
var tree_sprites = []

//input icons
var symbol_move = []
var symbol_slash = []
var symbol_dash = []
var symbol_parry = null

//lava
var lava_sprites = []
var lava_warning_turns = 4
var lava_fps = 7

function load_ui_sprites(){
	mute_icons.push(loadImage("img/ui/mute_off.png"))
	mute_icons.push(loadImage("img/ui/mute_on.png"))

	for (let i=0; i<5; i++){
		timer_sprites.push(loadImage("img/Layout/status_"+i.toString()+".png"))
	}
	
	for (let i=0; i<3; i++){
		rock_sprites.push(loadImage("img/Environment/rock_"+i.toString()+".png"))
		tree_sprites.push(loadImage("img/Environment/tree_"+i.toString()+".png"))
	}
	
	grass_sprite = loadImage("img/Environment/grass.png")

	for (let i=0; i<9; i++){
		lava_sprites.push( loadImage("img/Environment/lava_"+i.toString()+".png") )
	}

	symbol_parry = loadImage("img/Symbols/parry.png")

	for (let i=0; i<4; i++){
		symbol_move.push(null)
		symbol_slash.push(null)
		symbol_dash.push(null)
	}
	symbol_move[DIR_UP] = loadImage("img/Symbols/up.png")
	symbol_move[DIR_RIGHT] = loadImage("img/Symbols/right.png")
	symbol_move[DIR_DOWN] = loadImage("img/Symbols/down.png")
	symbol_move[DIR_LEFT] = loadImage("img/Symbols/left.png")

	symbol_slash[DIR_UP] = loadImage("img/Symbols/slash_up.png")
	symbol_slash[DIR_RIGHT] = loadImage("img/Symbols/slash_right.png")
	symbol_slash[DIR_DOWN] = loadImage("img/Symbols/slash_down.png")
	symbol_slash[DIR_LEFT] = loadImage("img/Symbols/slash_left.png")

	symbol_dash[DIR_UP] = loadImage("img/Symbols/dash_up.png")
	symbol_dash[DIR_RIGHT] = loadImage("img/Symbols/dash_right.png")
	symbol_dash[DIR_DOWN] = loadImage("img/Symbols/dash_down.png")
	symbol_dash[DIR_LEFT] = loadImage("img/Symbols/dash_left.png")
	
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
	translate(cell_size/2,70+cell_size/2)

	imageMode(CENTER)
	tint(255)

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
			tint(255,alpha)
			image(grass_sprite, c*cell_size, r*cell_size)

			if (board[c][r].passable == false){
				let sprite_id = Math.floor( board[c][r].rand_val * tree_sprites.length )
				if (board[c][r].weak){
					image(tree_sprites[sprite_id], c*cell_size, r*cell_size)
				}else{
					image(rock_sprites[sprite_id], c*cell_size, r*cell_size)
				}
			}

			//if a tree just got cut down, have it blink
			if (board[c][r].passable && !board[c][r].prev_passable){
				//on animaiton beat, have it stay there then blink
				if (cur_phase == 3 || cur_phase==0){
					let blink_speed = 100
					if (millis()%blink_speed < blink_speed/2 || cur_phase==3){
						image(tree_sprite, c*cell_size, r*cell_size)
					}
				}
			}

			//lava
			if (board[c][r].lava_timer <= lava_warning_turns){
				let lava_prc = (lava_warning_turns-board[c][r].lava_timer) / lava_warning_turns
				if (lava_prc > 1)	lava_prc = 1

				let alpha_max = 255 * lava_prc
				let alpha_prc = 0.5+sin( (millis()/1000)*5 )*0.5
				let alpha = alpha_max * alpha_prc

				if (board[c][r].lava_timer <= 0){
					alpha = 255
				}

				tint(255,alpha)
				let lava_frame = Math.floor( (millis()/(1000/lava_fps))%lava_sprites.length )
				image(lava_sprites[lava_frame], c*cell_size, r*cell_size)

				//console.log("lava prc"+lava_prc)

				// fill(255,0,0, alpha)
				// noStroke()
				// let lava_test_size = cell_size*0.8
				// rect(c*cell_size-lava_test_size/2, r*cell_size-lava_test_size/2, lava_test_size, lava_test_size)

			}
			// fill(255,0,0)
			// text(board[c][r].lava_timer.toString(), c*cell_size, r*cell_size)
		}

		//top row of grass
		tint(255,alpha)
		image(grass_sprite, c*cell_size, -1*cell_size)
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
	
	push()

	translate(width/2-timer_sprites[0].width/2, 0)
	image(timer_sprites[cur_phase+1], 0, 0)


  	//if we have input, show it
  	if (input_info != null){
  		let pic = null
  		if (input_info.action == INPUT_MOVE){
  			pic = symbol_move[input_info.dir]
  		}
  		if (input_info.action == INPUT_SLASH){
  			pic = symbol_slash[input_info.dir]
  		}
  		if (input_info.action == INPUT_DASH){
  			pic = symbol_dash[input_info.dir]
  		}
  		if (input_info.action == INPUT_PARRY){
  			pic = symbol_parry
  		}
  		if (pic != null){
  			image(pic, 343-pic.width/2, 50-pic.height/2)
  		}
  	}

	pop()


	if (game_state == STATE_PLAYING){
	  
	  /*
	  textSize(20)
	  stroke(128,151,70)
	  strokeWeight(2)
	  fill(0)
	  text("Turn "+turn_num, width/2, 110);
	  */

	  
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
	if (x>mute_icon_pos.x && x<mute_icon_pos.x+mute_icons[0].width && y>mute_icon_pos.y && y<mute_icon_pos.y+mute_icons[0].height){
		mute = !mute
	}
}