//Start the game engine with pre-made config from config.js.
var game = new gameEngine( config );

var levelTiles = new Array;
levelTiles[0] = new Array;
levelTiles[0][0] = 100;
levelTiles[0][1] = 100;
levelTiles[1] = new Array;
levelTiles[1][0] = 110;
levelTiles[1][1] = 100;

var levelone = game.levelSetup({
	width: 1280,
	height: 720,
	assets: {},
	bg: {},
	meta: {
		"tile_width": 32,
		"tile_height": 32
	},
	tiles: levelTiles
});

var player = game.objectAdd({
	type: "player",
	health: 100,
	level: 1,
	x: 100,
	y: 0,
	width: 50,
	height: 50,
	initialSpeed: 2,
	moveSpeed: 2,
	highSpeed: 8,
	acceleration: 1.07,
	gravity: {
		speed: 1,
		initial: 0.1,
		acceleration: 1.1
	},
	render: function( ctx, self ){
		ctx.save();
		ctx.fillStyle = "red";
		ctx.fillRect( self.x, self.y, 50, 50 );
		ctx.restore();
	},
	oncollision: function( object ){ 
		//Do stuff.

	},
	tick: function(){
		player.tickId = window.setInterval( function(){

			game.objectCollision( player.objectId, "other" );

		}, 1000/60 );
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
		game.objectDestroy( object.objectId );
	}
});

game.begin();
player.tick();