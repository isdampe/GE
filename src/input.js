//Configure input hooks.

//Player movement.
game.inputAdd( 39, function( object ){

	//Right.
	object.x = object.x + object.moveSpeed;

}, function( object ) {

	//On cancel
	object.moveSpeed = object.initialSpeed;

}, player );

game.inputAdd( 37, function( object ){


	//Left.
	object.x = object.x - object.moveSpeed;

}, function( object ){

	//On cancel.
	object.moveSpeed = object.initialSpeed;

}, player );

game.inputAdd( 90, function( object ){

	if ( object.moveSpeed <= object.highSpeed ) {
		object.moveSpeed = object.moveSpeed * object.acceleration;
	} else {
		object.moveSpeed = object.highSpeed;
	}

}, function( object ){

	var slowDownTimer = window.setInterval(function(){

		if ( object.moveSpeed <= object.initialSpeed ) {
			clearInterval(slowDownTimer);
			delete slowDownTimer;
		} else {
			object.moveSpeed = object.moveSpeed / object.acceleration;
		}

	}, 1000/60);

}, player );