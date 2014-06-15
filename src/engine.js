function gameEngine( config ) {

	this.config = config;
	var gameEngine = this;
	var ctx = config.canvas.getContext("2d");
	var objectManager = new Array;
	var inputManager = new Array;

	this.objectAdd = function( object ) {

		var objectId = objectManager.length;

		objectManager[objectId] = object;
		objectManager[objectId].objectId = objectId;

		return objectManager[objectId];

	}

	this.objectDestroy = function( objectId ) {

		//Stop any ticking events.
		if ( objectManager[objectId].tickId ) {
			clearInterval( objectManager[objectId].tickId );
		}

		//Remove the object from manager.
		objectManager.splice( objectId, 1 );

		//Fix all other object ID's in manager.
		for ( i=0; i<objectManager.length; i++ ) {
			objectManager[i].objectId = i;
		}

	}

	this.objectLoop = function( callBackFunc ) {

		for ( i=0; i<objectManager.length; i++ ) {
			callBackFunc( objectManager[i] );
		}

	}

	this.objectCollision = function( objectId, selfTrigger ) {

		var thisX = objectManager[objectId].x;
		var thisY = objectManager[objectId].y;
		var thisId = objectId;
		
		gameEngine.objectLoop( function(object){
			if ( object.objectId != thisId ) {
				//Check for collision.
				//Check for object shape type, but just square for now.
				if ( thisX >= object.x && thisX < (object.x + object.width) ) {
					if ( thisY >= object.y && thisY < (object.y+object.height) ) {
						switch ( selfTrigger ) {
							case "self":
								objectManager[objectId].oncollision( objectManager[objectId] );
							break;

							case "other":
								object.oncollision( object );
							break;

							case "both":
								objectManager[objectId].oncollision( objectManager[objectId] );
								object.oncollision( objectManager[objectId] );
							break;
						}
					}
				}

			}
		});

	}

	this.begin = function() {

		//Start the game.
		(function animloop(){
		  requestAnimFrame(animloop);
		  gameEngine.gfxRender();
		})();

	}

	this.gfxRender = function() {

		ctx.clearRect( 0, 0, gameEngine.config.width, gameEngine.config.height );

		gameEngine.objectLoop( function( object ) {
			if ( typeof( object.render ) === "function") { 
				object.render( ctx, object );
			}
		});

	}

	this.inputAdd = function ( keyCode, callBack, callBackCancel, object ) {

		var inputId = inputManager.length;

		inputManager[inputId] = new Array;
		inputManager[inputId][0] = inputId;
		inputManager[inputId][1] = keyCode;
		inputManager[inputId][2] = callBack;
		inputManager[inputId][3] = object;
		inputManager[inputId][4] = 0;
		inputManager[inputId][5] = 0;
		inputManager[inputId][6] = callBackCancel;

	}

	this.inputGet = function( keyCode ) {

		for ( i=0; i<inputManager.length; i++ ) {
			if ( inputManager[i][1] === keyCode ) {
				if ( inputManager[i][4] === 0 ) {
					var oid = i;

					inputManager[i][5] = window.setInterval(function(){
						inputManager[oid][4] = 1;
						inputManager[oid][2]( inputManager[oid][3] );
					}, 1000/60);
				}
			}
		}

	}

	this.inputCancel = function( keyCode ) {

		for ( i=0; i<inputManager.length; i++ ) {
			if ( inputManager[i][1] === keyCode ) {

				if ( inputManager[i][4] === 1 ) {

					inputManager[i][6]( inputManager[i][3] );
					clearInterval(inputManager[i][5]);
					inputManager[i][4] = 0;
					inputManager[i][5] = 0;

				}
				
			}
		}
	}

	window.onkeydown = function(e) {
		
		gameEngine.inputGet(e.which);

	}

	window.onkeyup = function(e) {

		gameEngine.inputCancel(e.which);

	}

	this.levelSetup = function( level ) {

		//Setup pre-rendered blocks.
		for ( i=0; i<level.tiles.length; i++ ) {
			
			gameEngine.objectAdd({
				x: level.tiles[i][0],
				x: level.tiles[i][1],
				width: level.meta.tile_width,
				height: level.meta.tile_height,
				render: function( ctx, self ){
					ctx.save();
					ctx.fillStyle = "blue";
					ctx.fillRect( self.x, self.y, 500, 500);

					ctx.restore();
				}
			});

		}

	}

}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
