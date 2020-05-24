//----------------------
// Audio Player
//
// I handle playing sounds
// This uses the p5.js sound library
// https://p5js.org/reference/#/libraries/p5.sound
//----------------------

var mute = false
var beat_sounds = new Array(4)

var join_sound = null
var death_sound = null

function load_sounds(){
	beat_sounds[0] = loadSound("sounds/click2.wav")
	beat_sounds[1] = loadSound("sounds/click2.wav")
	beat_sounds[2] = loadSound("sounds/wood.wav")
	beat_sounds[3] = loadSound("sounds/Soft_1_shorter.wav")

	join_sound = loadSound("sounds/Z7_join.mp3")
	death_sound = loadSound("sounds/Z10_death.mp3")
}

function play_beat(phase){
	if (phase < 0 || phase > beat_sounds.length){
		console.log("beat sound out of range")
		return
	}

	if (mute){
		return
	}

	beat_sounds[phase].play()
}

function play_join_sound(){
	if (mute){
		return
	}

	if (join_sound!=null)	join_sound.play()
}

function play_death_sound(){
	if (mute){
		return
	}
	
	if (death_sound!=null)	death_sound.play()
}