//----------------------
// Audio Player
//
// I handle playing sounds
// This uses the p5.js sound library
// https://p5js.org/reference/#/libraries/p5.sound
//----------------------

var mute = true
var beat_sounds = new Array(4)

function load_sounds(){
	beat_sounds[0] = loadSound("sounds/click2.wav")
	beat_sounds[1] = loadSound("sounds/click2.wav")
	beat_sounds[2] = loadSound("sounds/wood.wav")
	beat_sounds[3] = loadSound("sounds/ding.wav")
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