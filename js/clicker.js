$(document).ready(function() {
	let canvas = $("#canvas")[0];
	let canvasContext = canvas.getContext("2d");
	let canvasWidth = $("#canvas").width();
	let canvasHeight = $("#canvas").height();

	let difficulty;
	let highestDifficulty;
	let score;
	let clickable;
	let clickableWidth;
	let clickableHeight;

	let timer;
	let lives;
	let clickableColor;

	let clickX;
	let clickY;

	function run() {
		score = 0;
		difficulty = 0;
		highestDifficulty = 0;
		clickableWidth = 100;
		clickableHeight = 100;
		clickableColor = ["red", "yellow", "green"];
		timer = 1000;
		lives = 2;

		createClickable();
		createClickableNext();
		if (typeof gameLoop != "undefined") {
			clearInterval(gameLoop);
		}
		gameLoop = setInterval(paint, 60);
	}

	run();

	function createClickable() {
		clickable = {
 			x:Math.round(Math.random()*(canvasWidth-clickableWidth)), 
 			y:Math.round(Math.random()*(canvasHeight-clickableHeight)) 
		};
	}

	function createClickableNext() {
		clickableNext = {
 			x:Math.round(Math.random()*(canvasWidth-clickableWidth)), 
 			y:Math.round(Math.random()*(canvasHeight-clickableHeight)) 
		};
	}

	function paint() {
		canvasContext.fillStyle = "white";
		canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
		canvasContext.strokeStyle = "black";
		canvasContext.strokeRect(0, 0, canvasWidth, canvasHeight);

		if (100 - difficulty > 25) {
			clickableWidth = 100 - difficulty;
			clickableHeight = 100 - difficulty;
		} else {
			clickableWidth = 25
			clickableHeight = 25;
		}
		

		drawClickable(clickable.x, clickable.y);
		drawClickableNext(clickableNext.x, clickableNext.y);

		canvas.addEventListener("click", function(event) {
			let mousePosition = getMousePositionOnClick(canvas, event);
			clickX = mousePosition.x
			clickY = mousePosition.y;
		}, false);

		if ((clickX >= clickable.x && clickX < clickable.x + clickableWidth) && (clickY >= clickable.y && clickY < clickable.y + clickableHeight)) {
			score += difficulty + 1;

			if (timer + difficulty * 10 <= 1000) {
				timer += difficulty * 10;
			} else {
				timer = 1000;
			}
			
			difficulty++;
			if (difficulty > highestDifficulty) {
				highestDifficulty = difficulty;
			}
			clickX = -1;
			clickY = -1;
			clickable.x = clickableNext.x;
			clickable.y = clickableNext.y;
			createClickableNext();
		}

		if (timer > 0) {
			timer -= difficulty;
		} else {
			timer = 1000;
			if (difficulty > 75) {
				difficulty = 25;
			}
			lives--;
		}

		canvasContext.fillStyle = "blue";
		let scoreString = "Score: " + score;
		let difficultyString = "Diffculty level: " + difficulty;
		canvasContext.fillText(scoreString, 5, 15);
		canvasContext.fillText(difficultyString, 5, 30);
		canvasContext.fillRect(5, 45, (timer/1000 * 100), 15);
		canvasContext.strokeStyle = "white";
		canvasContext.strokeRect(5, 45, (timer/1000 * 100), 15);

		if (lives < 0) {
			confirm("You scored " + score + " points\nYour highest difficulty level was " + highestDifficulty);
			run();
		}
	}

	function drawClickable(x, y) {
		canvasContext.fillStyle = clickableColor[lives];
		canvasContext.fillRect(x, y, clickableWidth, clickableHeight);
		canvasContext.strokeStyle = "black";
		canvasContext.strokeRect(x, y, clickableWidth, clickableHeight);
	}

	function drawClickableNext(x, y) {
		canvasContext.globalAlpha = 0.5;
		canvasContext.fillStyle = "grey";
		canvasContext.fillRect(x, y, clickableWidth, clickableHeight);
		canvasContext.strokeStyle = "white";
		canvasContext.strokeRect(x, y, clickableWidth, clickableHeight);
		canvasContext.globalAlpha = 1;
	}

	function getMousePositionOnClick(canvas, event) {
		let rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}
});