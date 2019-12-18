function main()
{
	size(800, 480);

	var keys = [];
	keyPressed = function()
	{
		keys[keyCode] = true;
		keys[key.toString()] = true;
	};
	keyReleased = function()
	{
		delete keys[keyCode];
		delete keys[key.toString()];
	};

	var ImageObject = function(image, x, y)
	{
		this.x = x;
		this.y = y;

		this.image = image;

		this.image.loadPixels();

		this.width = this.image.width;
		this.height = this.image.height;

		this.halfWidth = this.width / 2;
		this.halfHeight = this.height / 2;
	};
	ImageObject.prototype.draw = function()
	{
		image(this.image, this.x, this.y, this.width, this.height);
	};

	function ImageA()
	{
		background(0, 0, 0, 0);

		noStroke();
		fill(0, 30, 200);
		ellipse(50, 50, 100, 100);

		return get(0, 0, 100, 100);
	}
	function ImageB()
	{
		background(0, 0, 0, 0);

		noStroke();
		fill(39, 23, 70);
		rect(0, 0, 40, 80, 50);

		fill(23, 34, 43);
		rect(34, 40, 60, 120);

		return get(0, 0, 100, 100);
	}
	function ImageC()
	{
		background(0, 0, 0, 0);

		noStroke();
		fill(39, 23, 70);
		rect(0, 0, 200, 40);

		return get(0, 0, 200, 40);
	}

	var circle = new ImageObject(ImageA(), 230, 200);
	var wall = new ImageObject(ImageC(), 370, 50);

	function Player(image, x, y)
	{	
		ImageObject.call(this, image, x, y);

		this.lastX = x;
		this.lastY = y;

		this.lastSafeX = x;
		this.lastSafeY = y;

		this.speed = 4;

		this.controls = {
			left: function()
			{
				return (keys[LEFT] || keys.a);
			},
			right: function()
			{
				return (keys[RIGHT] || keys.d);
			},
			up: function()
			{
				return (keys[UP] || keys.w);
			},
			down: function()
			{
				return (keys[DOWN] || keys.s);
			}
		};
	}
	Player.prototype = ImageObject.prototype;
	Player.prototype.update = function()
	{
		this.lastX = this.x;
		this.lastY = this.y;

		this.lastSafeX = this.x;
		this.lastSafeY = this.y;

		if(this.controls.left())
		{
			this.x -= this.speed;
		}
		if(this.controls.right())
		{
			this.x += this.speed;
		}
		if(this.controls.up())
		{
			this.y -= this.speed;	
		}
		if(this.controls.down())
		{
			this.y += this.speed;
		}
	};

	var player = new Player(ImageB(), 50, 200);

	var Observer = {
		colliding: function(objectA, objectB)
		{
			var boxTest = (objectA.x + objectA.width >= objectB.x && 
				  		   objectA.x <= objectB.x + objectB.width) && 
						  (objectA.y + objectA.height >= objectB.y && 
			 	  		   objectA.y <= objectB.y + objectB.height);

			if(!boxTest)
			{
				return false;
			}

			var imageDataA = objectA.image.imageData;
			var imageDataB = objectB.image.imageData;

			var x1 = max(objectB.x, objectA.x);
			var y1 = max(objectB.y, objectA.y);
			var x2 = min(objectB.x + objectB.width, objectA.x + objectA.width);
			var y2 = min(objectB.y + objectB.height, objectA.y + objectA.height);

			var sx = Math.round(x1 - objectA.x);
			var sy = Math.round(y1 - objectA.y);

			var sx2 = Math.round(x1 - objectB.x);
			var sy2 = Math.round(y1 - objectB.y);

			var w = x2 - x1;
			var h = y2 - y1;

			var x, y, i;

			for(x = 0; x < w; x++)
			{
				for(y = 0; y < h; y++)
				{
					if(imageDataA.data[3 + ((x + sx) + imageDataA.width * (y + sy)) * 4] !== 0 &&
					   imageDataB.data[3 + ((x + sx2) + imageDataB.width * (y + sy2)) * 4] !== 0)
					{
						return true;
					} 
				}
			}

			return false;
		},
		resolve: function(objectA, objectB)
		{
			// var diffWidth = objectA.lastSafeX - objectA.x - objectA.speed;
			// var diffHeight = objectA.lastSafeY - objectA.y - objectA.speed;

			var diffWidth = objectB.x + objectB.halfWidth - objectA.x + objectA.halfWidth;
			var diffHeight = objectB.y + objectB.halfHeight - objectA.y + objectA.halfHeight;

			var tempX = objectA.x;
			var tempY = objectA.y;
			objectA.x = objectA.lastSafeX;
			objectA.y = objectA.lastSafeY;
			objectA.lastSafeX = tempX;
			objectA.lastSafeY = tempY;

			var angle = atan2(diffHeight, diffWidth);

			// Let's start by trying a rectangle
			var tx = objectB.x;
			var ty = objectB.y;

			

			// var i = 0;
			// if(i < 3000 && !this.colliding(objectA, objectB))
			// {
			// 	/* Move object */
   //              objectA.x -= cos(angle) * 1 || 0;
   //              objectA.y -= sin(angle) * 1 || 0;

			// 	i++;
			// }

			// objectA.x += cos(angle) * 2 || 0;
   //          objectA.y += sin(angle) * 2 || 0;

			// objectA.lastSafeX = objectA.x;
   //          objectA.lastSafeY = objectA.y;
        }
	};

	var obj = {};

	function defineFunction(object, name, value)
	{
		Object.defineProperty(object, name, 
		{
			enumerable: false,
			value: value,
		});
	}

	defineFunction(obj, 'defineFunction', function(name, value)
	{
		defineFunction(this, name, value);
	});

	obj.defineFunction("test", function()
	{
		console.log("this is a test");
	});

	obj.test();

	console.log(obj);

    draw = function()
    {
    	background(255, 255, 255);

    	if(Observer.colliding(player, circle))
    	{
    		background(0, 220, 30);
    		Observer.resolve(player, circle);
    	}

    	if(Observer.colliding(player, wall))
    	{
    		background(0, 220, 30);
    		Observer.resolve(player, wall);
    	}

    	player.image.updatePixels();

    	if(mouseIsPressed)
    	{
    		player.lastSafeX -= 10;
    	}

    	player.update();
        player.draw();
    	
        circle.draw();
        wall.draw();
    };
}

createProcessing(main);