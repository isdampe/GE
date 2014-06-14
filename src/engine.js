function gameEngine( config ) {

	this.config = config;
	var gameEngine = this;
	var ctx = config.canvas.getContext("2d");
	var objectManager = new Array;

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
								object.oncollision( objectManager[objectId] );
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

}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
