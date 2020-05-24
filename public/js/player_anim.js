//----------------------
// Player Animation
//
// I handle drawing player sprite
//----------------------

var player_packs = []

var ANIM_DEATH = 0
var ANIM_IDLE = 1
var ANIM_PARRY = 2
var ANIM_SLASH = 3
var ANIM_STUNNED = 4
var ANIM_WALK = 5

var millis_per_frame = 1000/15

function load_player_sprites(){
	console.log("LOAD SPRITES")

	player_packs.push(make_player_pack("BaldyBlue"))
	player_packs.push(make_player_pack("CrypticCyan"))
	player_packs.push(make_player_pack("GooeyGreen"))
	player_packs.push(make_player_pack("OrneryOrange"))
	player_packs.push(make_player_pack("PlacidPink"))
	player_packs.push(make_player_pack("RadRed"))
	player_packs.push(make_player_pack("ViciousViolet"))
	player_packs.push(make_player_pack("YummyYellow"))

}

function make_player_pack(id_name){
	let pack = {
		id_name : id_name,
		death : load_sprite_array(id_name, "death", 9),
		idle : load_sprite_array(id_name, "idle", 6),
		parry : load_sprite_array(id_name, "parry", 4),
		slash : load_sprite_array(id_name, "slash", 9),
		stunned : load_sprite_array(id_name, "stunned", 8),
		walk : load_sprite_array(id_name, "walk", 10)
	}

	return pack
}

function load_sprite_array(id_name, anim_name, num_frames){
	let anim = []
	for (let i=0; i<num_frames; i++){
		anim.push( loadImage('img/'+id_name+"/"+anim_name+"_"+i.toString()+".png") )
	}
	return anim
}

function get_pack_from_id(id){
	for (let i=0; i<player_packs.length; i++){
		if (player_packs[i].id_name == id){
			return player_packs[i]
		}
	}

	console.log("could not find player sprite pack for id:"+id)
	return null
}

function make_animator(player){
	//defaults
	let anim = {
		owner:player,
		pack: get_pack_from_id(player.sprite_pack),
		timer:0,
		frame:0,
		state:ANIM_IDLE,
		sprite:null
	}

	//set things based on what they are doing
	if (player.input_type == INPUT_SLASH || player.input_type == INPUT_DASH){
		anim.state = ANIM_SLASH
	}
	else if (player.input_type == INPUT_PARRY){
		anim.state = ANIM_PARRY
	}
	else if (player.input_type == INPUT_MOVE){
		anim.state = ANIM_WALK
	}
	else{
		anim.state = ANIM_IDLE
	}

	//if the player was dead last frame, keep them on the final death frame
	if (player.prev_state.is_dead){
		anim.state = ANIM_DEATH
		anim.frame = 9999
		anim.timer = 9999
	}

	//console.log(player.disp_name+" start on "+anim.state)
	// //the dead are always dead
	// if (player.is_dead){
	// 	anim.state = ANIM_DEATH
	// 	//if they were dead last turn, just sip to the end
	// 	if (player.prev_state.is_dead){
	// 		anim.frame = 9999
	// 		anim.timer = 9999
	// 	}
	// }

	return anim
}

function update_player_anim(anim){
	//console.log("how is this "+anim.pack)
	if (anim.pack == null){
		console.log("bail on anim. we'll try again next frame")

		//it may be that the packs didn't load yet, so try again
		anim.pack = get_pack_from_id(anim.owner.sprite_pack)

		return
	}

	let sprite_frames = get_sprite_frames(anim.pack, anim.state)
	anim.timer += delta_millis
	if (anim.timer > millis_per_frame){
		anim.timer -= millis_per_frame
		anim.frame++
		//when the animation is done we should figure out what we do next
		if (anim.frame >= sprite_frames.length){
			//if they just died, move to death animation
			if (anim.owner.is_dead && !anim.owner.prev_state.is_dead){
				anim.frame = 0
				anim.state = ANIM_DEATH
				anim.owner.prev_state.is_dead = true
			}
			//idle and stun just loop
			else if (anim.state == ANIM_IDLE || anim.state == ANIM_STUNNED){
				anim.frame = 0
			}
			//death stays on last frame
			else if (anim.state == ANIM_DEATH){
				anim.frame = sprite_frames.length-1
			}
			//all others move to idle or stunned
			else{
				anim.frame = 0
				if (anim.owner.is_stunned){
					anim.state = ANIM_STUNNED
				}else{
					anim.state = ANIM_IDLE
				}
			}
			//console.log(anim.owner.disp_name+" goes to "+anim.state)
		}
	}

	anim.sprite = sprite_frames[anim.frame]
}

function get_sprite_frames(pack, state){
	if (state == ANIM_DEATH){
		return pack.death
	}
	if (state == ANIM_IDLE){
		return pack.idle
	}
	if (state == ANIM_PARRY){
		return pack.parry
	}
	if (state == ANIM_SLASH){
		return pack.slash
	}
	if (state == ANIM_STUNNED){
		return pack.stunned
	}
	if (state == ANIM_WALK){
		return pack.walk
	}
	console.log("could not find animation for state "+state)
	return null
}

function draw_player_anim(anim){
	if (anim.sprite == null){
		//console.log("bail on null sprite")
		return
	}
	push()
	translate(anim.draw_pos.x,anim.draw_pos.y)

	let rotation = PI/2 * anim.owner.last_valid_input_dir

	rotate(rotation)

	image(anim.sprite,0,0)// -anim.sprite.width/2, -anim.sprite.height/2);

	pop()

	
}

function draw_name_tag(anim){
	push()
	translate(anim.draw_pos.x, anim.draw_pos.y)
	//little name tag
	textAlign(CENTER);
	fill(10,140)
	noStroke()
	text(anim.owner.disp_name, 0, -14)
	pop()
}