//----------------------
// Player Animation
//
// I handle drawing player sprites
//----------------------

var sprite_blank = null
var sprites_death = []
var sprites_idle = []
var sprites_parry = []
var sprites_slash = []
var sprites_stunned = []
var sprites_walk = []

function load_player_sprites(){

	//for now, just loading a single image for eahc animation
	sprite_blank = loadImage('img/blank.png')
	sprites_death.push (loadImage('img/bb_death_8.png'))
	sprites_idle.push (loadImage('img/bb_idle_1.png'))
	sprites_parry.push (loadImage('img/bb_parry_3.png'))
	sprites_slash.push (loadImage('img/bb_slash_5.png'))
	sprites_stunned.push (loadImage('img/bb_stunned_4.png'))
	sprites_walk.push (loadImage('img/bb_walk_1.png'))
}

function get_player_sprite(player){
	let sprite = sprites_idle[0]

	//this should be replaced by just letting the animation play and then going to idle or whatever
	let in_animation_window = (turn_timer > anim_start_time && turn_timer < anim_end_time)

	if (in_animation_window){
		if (player.input_type == INPUT_SLASH || player.input_type == INPUT_DASH){
			sprite = sprites_slash[0]
		}
		if (player.input_type == INPUT_PARRY){
			sprite = sprites_parry[0]
		}
		if (player.input_type == INPUT_MOVE){
			sprite = sprites_walk[0]
		}
	}
	else{
		sprite = sprites_idle[0]
		if (player.is_stunned){
			sprite = sprites_stunned[0]
			if ( millis()%600 < 300 ){
				sprite = sprite_blank
			}
		}
	}

	//the dead are always dead
	if (player.is_dead){
		sprite = sprites_death[0]
	}

	return sprite
}

function draw_player(player, x, y){
	push()
	translate(x,y)

	let rotation = PI/2 * player.input_dir
	if (player.input_dir == DIR_NONE){
		rotation = 0
	}
	rotate(rotation)

	let sprite = get_player_sprite(player)
	image(sprite, -sprite.width/2, -sprite.height/2);

	pop()

	push()
	translate(x,y)
	//little name tag
	textAlign(CENTER);
	fill(255,100)
	noStroke()
	text(player.disp_name, 0, -14)
	pop()

	
}