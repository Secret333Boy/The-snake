const field = new_div('field');

const snake = new_div('snake');

const head = new_div('head');

var tail = [];

let field_css = getComputedStyle(field);
let head_css = getComputedStyle(head);

let w;
let h;

function init() {
	document.body.appendChild(field);
	
	field.appendChild(snake);
	w = getPxInt(field_css.width);
	h = getPxInt(field_css.height);

	addTail(3);

	drawSnake(true/*it is start*/);
}

function getPxInt(str) {
	return +str.replace("px", "");
}

function new_div(name) {
	let div = document.createElement("div");
	div.classList.add(name);
	return div;
}

function addTail(count = 1) {
	for (var i = 0; i < count; i++) {
		tail.push(new_div('tail'));
	}
}

function random(min, max) {
	if (!max) {
		max = min;
		return Math.floor(Math.random() * max);
	} else{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

function startGame() {
	let fps = 15;
	const size = getPxInt(getComputedStyle(head).width);
	const speed = size; // px/frame

	let food;

	let interval;

	let heading = document.createElement("h1");
	heading.textContent = "Press enter when you want to start";
	field.appendChild(heading);

	let span = document.createElement("span");
	span.textContent = "Borders will kill snake";
	let option = document.createElement("input");
	option.setAttribute("type", "checkbox");
	field.appendChild(span);
	field.appendChild(option);

	window.addEventListener("keydown", run);

	function run(e) {
		if (e.keyCode === 13) {
			heading.remove();

			borderKills = option.checked;

			span.remove();
			option.remove();

			snake.direction = "top";
			window.removeEventListener("keydown", run);
			window.addEventListener("keydown", changeDirection);

			interval = setInterval(update, 1000/fps);
		}

		function update() {
			let x = getPxInt(head_css.top);
			let y = getPxInt(head_css.left);

			let x_offset_k, y_offset_k;

			switch (snake.direction) {
				case "top":
					x_offset_k = 1;
					break;
				case "left":
					y_offset_k = 1;
					break;
				case "bottom":
					x_offset_k = -1;
					break;
				case "right":
					y_offset_k = -1;
					break;
				default:
					break;
			}

			if (!x_offset_k) {
				x_offset_k = 0;
			}

			if (!y_offset_k) {
				y_offset_k = 0;
			}

			head.style.top = `${x - (speed * x_offset_k)}px`;
			head.style.left = `${y - (speed * y_offset_k)}px`;

			checkBorder();
			checkSuicide();
			checkFood();

			drawSnake();
		}
	}

	let currKey = "top";

	function changeDirection(e) {
		reloadKeys(currKey);
		function reloadKeys(curr) {
			let code = e.keyCode;
			window.removeEventListener("keydown", changeDirection);

			if     (code === 37 && currKey != "right" ){
				snake.direction = "left"  ;
			}
			else if(code === 38 && currKey != "bottom"){
				snake.direction = "top"   ;
			}
			else if(code === 39 && currKey != "left"  ){
				snake.direction = "right" ;
			}
			else if(code === 40 && currKey != "top"   ){
				snake.direction = "bottom";
			}

			currKey = snake.direction;
			setTimeout(() => {
				window.addEventListener("keydown", changeDirection);
			}, 1000/fps)
		}
	}

	function checkBorder() {
		let head_x = getPxInt(head.style.top);
		let head_y = getPxInt(head.style.left);

		if (head_x < h / -2) {
			if (!borderKills) {
				head.style.top = `${h / 2 - size}px`;
			} else{
				clearInterval(interval);
				console.log('Game over');
				endGame();
			}
		}

		if (head_y < w / -2) {
			if (!borderKills) {
				head.style.left = `${w / 2 - size}px`;
			} else{
				clearInterval(interval);
				console.log('Game over');
				endGame();
			}
		}

		if (head_x > h / 2 - size) {
			if (!borderKills) {
				head.style.top = `${h / 2 * (-1)}px`;
			} else{
				clearInterval(interval);
				console.log('Game over');
				endGame();
			}
		}

		if (head_y > w / 2 - size) {
			if (!borderKills) {
				head.style.left = `${w / 2 * (-1)}px`;
			} else{
				clearInterval(interval);
				console.log('Game over');
				endGame();
			}
		}
	}

	function createFood() {
		food = new_div("food");

		snake.appendChild(food);

		food.style.top = `${random(h / 2, -h / 2)}px`;
		while (getPxInt(food.style.top) % 10 != 0) {
			food.style.top = `${random(h / 2, -h / 2)}px`;
		}

		food.style.left = `${random(w / 2, -w / 2)}px`;
		while (getPxInt(food.style.left) % 10 != 0) {
			food.style.left = `${random(w / 2, -w / 2)}px`;
		}
	}

	function checkFood() {
		if (!food) {
			createFood();
		}

		if (getPxInt(head.style.top) == getPxInt(food.style.top) && getPxInt(head.style.left) == getPxInt(food.style.left)) {
			addTail();
			food.remove();
			food = false;
		}
	}

	function checkSuicide() {
		for (var i = 0; i < tail.length; i++) {
			if (getPxInt(head.style.top) == getPxInt(tail[i].style.top) && getPxInt(head.style.left) == getPxInt(tail[i].style.left)) {
				clearInterval(interval);
				console.log('Game over');
				endGame();
				break;
			}
		}
	}

	function endGame() {
		setTimeout(() => {
			location.reload();
		}, 1200)
	}
}

let prev = []
function drawSnake(start) {
	snake.appendChild(head);

	let head_x = getPxInt(head_css.top);
	let head_y = getPxInt(head_css.left);

	if (start) {
		for (var i = 1; i <= tail.length; i++) {
			prev.push({x: head_x + (10 * i), y: 0});
		}
	}

	for (var i = 0; i < tail.length; i++) {
		snake.appendChild(tail[i]);

		tail[i].style.top = `${prev[i].x}px`;
		tail[i].style.left = `${prev[i].y}px`;
	}

	prev = [];
	prev.unshift({x:head_x, y: head_y});
	for (var i = 0; i < tail.length; i++) {
		let el_css = getComputedStyle(tail[i]);

		let el_x = getPxInt(el_css.top);
		let el_y = getPxInt(el_css.left);

		prev.push({x: el_x, y: el_y});
	}
}

init();
startGame();