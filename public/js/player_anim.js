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

	player_packs.push(make_player_pack("BaldyBlue"))

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
		anim.push( loadImage('img/'+id_name+"/bb_"+anim_name+"_"+i.toString()+".png") )
	}
	return anim
}

function make_animator(player){
	//defaults
	let anim = {
		owner:player,
		pack:player_packs[0],
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

	//the dead are always dead
	if (player.is_dead){
		anim.state = ANIM_DEATH
	}

	return anim
}

function update_player_anim(anim){
	let sprite_frames = get_sprite_frames(anim.pack, anim.state)
	anim.timer += delta_millis
	if (anim.timer > millis_per_frame){
		anim.timer -= millis_per_frame
		anim.frame++
		//when the animation is done we should figure out what we do next
		if (anim.frame >= sprite_frames.length){
			//idle and stun just loop
			if (anim.state == ANIM_IDLE || anim.state == ANIM_STUNNED){
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

/*
function get_player_sprite(player){
	let pack = player_packs[0]

	//console.log("test size "+player_packs[0].death[0].width)
	let sprite = pack.idle[0]

	//this should be replaced by just letting the animation play and then going to idle or whatever
	let in_animation_window = (turn_timer > anim_start_time && turn_timer < anim_end_time)

	if (in_animation_window){
		if (player.input_type == INPUT_SLASH || player.input_type == INPUT_DASH){
			sprite = pack.slash[5]
		}
		if (player.input_type == INPUT_PARRY){
			sprite = pack.parry[3]
		}
		if (player.input_type == INPUT_MOVE){
			sprite = pack.walk[1]
		}
	}
	else{
		sprite = pack.idle[1]
		if (player.is_stunned){
			sprite = pack.stunned[4]
			if ( millis()%600 < 300 ){
				sprite = sprite_blank
			}
		}
	}

	//the dead are always dead
	if (player.is_dead){
		sprite = pack.death[8]
	}

	return sprite
}
*/

function draw_player_anim(anim, x, y){
	push()
	translate(x,y)

	let rotation = PI/2 * anim.owner.input_dir
	if (anim.owner.input_dir == DIR_NONE){
		rotation = 0
	}
	rotate(rotation)

	//let sprite = get_player_sprite(player)
	image(anim.sprite, -anim.sprite.width/2, -anim.sprite.height/2);

	pop()

	push()
	translate(x,y)
	//little name tag
	textAlign(CENTER);
	fill(255,100)
	noStroke()
	text(anim.owner.disp_name, 0, -14)
	pop()

	
}