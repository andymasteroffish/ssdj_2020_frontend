//----------------------
// Page Manipulation
//
// I handle making changes to the DOM outside of the p5 canvas
// This is very very placeholder right now and can be completely changed
//----------------------

//adds buttons to join the game
function add_join_ui(){
	$("#top_holder").empty()
	$("#top_holder").append('<input id="player_name" type="player_name" placeholder="Your name" name="Your Name">')
	$("#top_holder").append('<button id="join_button" type="button">Join</button>')

	if (my_name != null){
		$("#player_name").val(my_name)
	}

	$("#join_button").click(function(){
		//$("#client_button").remove()
		//$("#host_button").remove()
		console.log("you clicked")

		let val = {
    		type:"join_request",
    		disp_name:$("#player_name").val()
    	}
    	socket.send(JSON.stringify(val));

    	$("#top_holder").empty()
    	$("#top_holder").append('joining you...')

	})
}

//sets the top div to show the player is in
function set_player_joined_ui(){
	$("#top_holder").empty()
	$("#top_holder").append('you are in, '+my_name)
}

//sets the top div once the game has started and people cannot join
function set_top_div_on_game_start(){
	$("#top_holder").empty()
	if (in_game){
		$("#top_holder").append('you are playing, '+my_name+'. Press arrow keys on the orange beat to move')
	}
	else{
		$("#top_holder").append('you can join after this game')
	}
}

//updated the list of players under the canvas
function update_player_info_div(players){
	$("#player_info").empty()

	$("#player_info").append('<h3>Players: '+players.length.toString()+'</h3>')

	for (let i=0; i<players.length; i++){
		if (i>0)$("#player_info").append('<br>')
		let text = players[i].disp_name + "    (games played: "+players[i].games_played.toString()+")"
		$("#player_info").append(text)
	}
}