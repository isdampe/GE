//Start the game engine with pre-made config from config.js.
var game = new gameEngine( config );

var player = game.objectAdd({
	type: "player",
	health: 100,
	level: 1,
	x: 0,
	y: 0,
	width: 50,
	height: 50,
	render: function( ctx, self ){
		ctx.save();
		ctx.fillStyle = "red";
		ctx.fillRect( self.x, self.y, 50, 50 );
		ctx.restore();
	},
	oncollision: function( object ){ 
		//Object contains the object that collided with this.
		alert("ha");
	}
});

var enemy = game.objectAdd({
	type: "enemy",
	health: 50,
	level: 1,
	direction: 4,
	x: 50,
	y: 0,
	width: 25,
	height: 25,
	render: function( ctx, self ){
		ctx.save();
		ctx.fillStyle = "green";
		ctx.fillRect( self.x, self.y, 25, 25 );
		ctx.restore();
	},
	oncollision: function( object ) {
		if ( object.type === "enemy" ) {
			game.objectDestroy( enemy.objectId );
		}
	}/*,
	tick: function() {
		enemy.tickId = window.setInterval(function(){
	
		enemy.x += enemy.direction;
		game.objectCollision( enemy.objectId, "self" );

		if ( enemy.x >= 500 ) {
			enemy.direction = -4;
		} else if ( enemy.x <= 30 ) {
			enemy.direction = 4;
		}
		
	},20);
	}*/
});

game.begin();