"use strict";

let ctx = canv.getContext("2d");
canv.height = innerHeight;
canv.width  = innerWidth;

// Other elements & vars
let closePopup = document.querySelectorAll('.close'),
		SSP = +JSON.parse((localStorage.getItem("scoreFromOnePoint")) || 1); // Standart value score for point

// Sounds
let volume = .5;

let 
		pointSound = new Audio(),
		boostSound = new Audio();

pointSound.src = 'point.mp3';
pointSound.volume = volume;
boostSound.src = 'boost.mp3';
boostSound.volume = volume;
	
let my = {
		x: canv.width/2,
		y: canv.height/2,
		color: "#381DA6",
		r: +JSON.parse((localStorage.getItem("standartCircleRadius")) || 25) 
	},  
	score = 0,
	points = JSON.parse(localStorage.getItem("pointsValue")) || [
		{
			x: randomPos(25, canv.width  -  25),
			y: randomPos(25, canv.height -  25),
			r: +JSON.parse((localStorage.getItem("standartPointRadius")) || 20)  
		}
	];

drawPoints();
createArc(my.color, my.x, my.y, my.r); 

options(); // Add listeners on options
shop();

	// Functions // 

document.addEventListener("keydown", (e)=>{
	// Controls
	if ((
		 	e.keyCode === 87  || e.keyCode === 65 || 
	     	e.keyCode === 83  || e.keyCode === 68
	    )) smoothMove(e.keyCode);
	// Open market
	if (e.keyCode === 77) {
		market.classList.toggle("hidden");
		settings.classList.add("hidden");
		colors_settings.classList.add("hidden");
		about_me_block.classList.add("hidden");
		game_settings.classList.add("hidden");
	}
	// Open settings
	if (e.keyCode === 27) {
		if (market.classList.contains("hidden"))
					settings.classList.toggle("hidden");
		
		colors_settings.classList.add("hidden");
		about_me_block.classList.add("hidden");
		game_settings.classList.add("hidden");
		market.classList.add("hidden");
	}
});
window.addEventListener ("resize", ()=>{
	canv.height = innerHeight;
	canv.width  = innerWidth;
	
	// Circle
	if (my.x > canv.width - my.r) my.x = canv.width - (my.r + my.r/2);
	else if (my.y > canv.height - my.r) my.y = canv.height - (my.r + my.r/2);
	else if (my.x < my.r) my.x = my.r + my.r/2;
	else if (my.y < my.r) my.y = my.r + my.r/2;
	// Points
	for (let i=0;i<points.length;i++) {
		if (points[i].x > canv.width - 20 || points[i].x < 20 ||
		points[i].y > canv.height - 20 || points[i].y < 20) {
			points[i].x = randomPos(25, canv.width - 25);
			points[i].y = randomPos(25, canv.height - 25);}
	}

	drawPoints();
	createArc(my.color, my.x, my.y, my.r);
});
// Options menu
function options() {

	settings.addEventListener("click", (e)=>{
		switch (e.target.id) {
			case "showFunc": 		 {showFunction(); break};
			case "showScore": 	 {showMyScore(); break};
			case "volumeValue":  {toggleValue(); break};
			case "game_setting": {openGameSettings(); break};
			case "colors": 			 {openColorSettings(); break};
			case "about_me": 		 {aboutMe(); break};
			case "reset_game": 	 {newGame(); break};
		};

		// Close settings btn
		e.target.classList.includes = [].includes;
		if (e.target.classList.includes("close")) {
			closeSetting();
		}
	});

	function showFunction() {
		if (showFunc.checked) show_func.classList.remove("hidden");
		else show_func.classList.add("hidden");
	}
	function showMyScore() {
		if (showScore.checked) show_score.classList.remove("hidden");
		else show_score.classList.add("hidden");
	}
	function toggleValue() {
		if (volumeValue.checked) pointSound.volume = .5;
		else pointSound.volume = 0;
	}
	function closeSetting() {
		closePopup.forEach((item)=>{
			item.addEventListener("click", function () {
				if (this.parentNode.id !== "settings") 
					settings.classList.remove("hidden")
		 			this.parentNode.classList.add("hidden");
		 	});
		});
	}
	// Game settings
	function openGameSettings() {
		settings.classList.add("hidden");
		game_settings.classList.remove("hidden");
		game_password.focus();
		gamePassword();
	}
	function gamePassword() {
		game_password.onkeydown = function (e) {
			if (e.keyCode === 13) {
				if (+game_password.value === 475993) {
					game_password.classList.add("hidden");
					game_settings_menu.classList.remove("hidden");
					gameSettingsListener();
				} else {
					game_password.style.borderColor = "red";
					game_password.style.color = "red";
				}
				game_password.value = null;
			}
		}
	}
	function gameSettingsListener() {
		// Default value
		startCircleRadius.value = +JSON.parse(localStorage.getItem("standartCircleRadius")) || startCircleRadius.value;
		startPointRadius.value = +JSON.parse(localStorage.getItem("standartPointRadius")) || startPointRadius.value;
		scoreForOnePoint.value = +JSON.parse(localStorage.getItem("scoreFromOnePoint")) || scoreForOnePoint.value;

		// Listeners
		startCircleRadius.onchange = function () {
			localStorage.setItem("standartCircleRadius", +startCircleRadius.value);
			my.r = parseInt(startCircleRadius.value); 
		}
		startPointRadius.onchange = function () {
			localStorage.setItem("standartPointRadius", +startPointRadius.value);
			points.r = parseInt(startPointRadius.value);	
		}
		scoreForOnePoint.onchange = function () {
			localStorage.setItem("scoreFromOnePoint", +scoreForOnePoint.value);
			SSP = parseInt(scoreForOnePoint.value);
		}
		// Reset settings listeners
		game_settings_menu.querySelectorAll(".reset_game_setting").forEach((item)=>{
			item.onclick = function() {
				item.previousElementSibling.value = +item.previousElementSibling.dataset.defaultvalue;
				localStorage.setItem(item.previousElementSibling.dataset.localname, item.previousElementSibling.dataset.defaultvalue);
			}	
		})

		reset_game_settings.onclick = function () {
			game_settings_menu.querySelectorAll("input").forEach((item)=>{
				item.value = +item.dataset.defaultvalue;
				localStorage.setItem(item.dataset.localname, item.dataset.defaultvalue);
			})
		}

		text_reload.onclick = function() {window.location.reload()};
	}
	// Color settings
	function openColorSettings() {
		settings.classList.add("hidden");
		colors_settings.classList.remove("hidden");
		chooseBgColor();
		chooseCircleColor();
	}
	function chooseCircleColor() {
		colors_circle_list.children.forEach = [].forEach;
		colors_circle_list.children.forEach((item)=>{
			item.onclick = function() {
				my.color = item.dataset.color;
				createArc(my.color, my.x, my.y);
			};
		});
	}
	function chooseBgColor() {
		colors_bg_list.children.forEach = [].forEach;
		colors_bg_list.children.forEach((item)=>{
			item.onclick = function() {
				canv.style.backgroundColor = item.dataset.color;
				createArc(my.color, my.x, my.y);
			};
		});
	}
	// About me
	function aboutMe() {
		about_me.onclick = function() {
			settings.classList.add("hidden");
			about_me_block.classList.remove("hidden");
		};
	};
};
// Market menu
function shop() {
	let boosts = market.querySelectorAll(".good");
	
	boosts.forEach((item)=>{
		let 
			price = item.querySelector(".good__price"),
			level = item.querySelector(".good__level"),
			title = item.querySelector(".good__title").textContent,
			maxLevel = +level.dataset.max_level;

		setSavedGoods();
		buyBoost();

		function setSavedGoods() {
			level.textContent = +localStorage.getItem(`${item.id}-level`);
			price.textContent = +localStorage.getItem(`${item.id}-price`);
		};
		function buyBoost() {		
			item.onclick = function() {
				if (score >= +price.textContent && !(+level.textContent >= maxLevel)) {
					// Update score bar
					score -= +price.textContent; 
					show_score.textContent = `SCORE: ${score}`;

					// Sound
					boostSound.play();

					// Update info
					price.textContent =  Math.round(+price.textContent * 1.1); // +10% price
					level.textContent = ++level.textContent;

					// Save level/price
					localStorage.setItem(`${item.id}-level`, level.textContent);
					localStorage.setItem(`${item.id}-price`, price.textContent);

					// Use boost
					if (title.toUpperCase() == "SIZE") localStorage.setItem("standartCircleRadius", ++my.r);
					if (title.toUpperCase() == "POINT PRICE") localStorage.setItem("scoreFromOnePoint", ++SSP);
					if (title.toUpperCase() == "POINT VALUE") {
							points.push(
								{
									x: randomPos(25, canv.width - 25),
									y: randomPos(25, canv.height - 25),
									r: 20
								});
							localStorage.setItem("pointsValue", JSON.stringify(points));
					};

					// Styles
					if (+level.textContent != maxLevel) {
						item.style.borderColor = "lime";
						level.style.borderColor = "lime";
						setTimeout(()=>{
							item.style.borderColor = "white";
							level.style.borderColor = "white";
						},500);
					} else {
						setTimeout(()=>{
							item.style.borderColor = "gold";
							level.style.borderColor = "gold";
						},550)
					};
				};
			};
		};
	});
};
function createArc (color, x, y, r) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.shadowColor = color;
	ctx.shadowBlur = 20;
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fill();
};
function drawPoints() {
	for (let i=0;i<points.length;i++) {
		ctx.beginPath();
		ctx.shadowColor = "#DC143C";
		ctx.shadowBlur = 15;
		ctx.fillStyle = "#DC143C";
		ctx.arc(points[i].x, points[i].y, points[i].r, 0, Math.PI * 2);
		ctx.fill();
	}
};
function smoothMove(direction) {
	if (isInView()) {
		let speedX = 5,
				speedY = 5,
				func   = .98;
		
		let move  = setInterval(()=>{

		ctx.clearRect(0, 0, canv.width, canv.height);
			
		drawPoints(); // Points
		eatPoint();		// Eat?

		ctx.beginPath();

		// Direction
		if (isInView().beforeBottom || isInView().beforeTop) {speedY = -speedY;};
		if (isInView().beforeLeft || isInView().beforeRight) {speedX = -speedX;};

		if (direction === 87) createArc(my.color, my.x, my.y-=speedY, my.r);
		if (direction === 65) createArc(my.color, my.x-=speedX, my.y, my.r);
		if (direction === 83) createArc(my.color, my.x, my.y+=speedY, my.r);
		if (direction === 68) createArc(my.color, my.x+=speedX, my.y, my.r);

		speedX *= func;
		speedY *= func;
		ctx.fill();

		if (!show_func.classList.contains("hidden")) show_func.textContent = `Func: ${func}; Speed ${speedX.toFixed(6)}`;
		
		if ((speedX >= -0.1 && speedX <= 0.1) &&
			(speedY >= -0.1 && speedY <= 0.1)) clearInterval(move);			
		}, 1000/60);
	}
};
function isInView() {
	return {
		isView: ((my.x >= my.r && my.x <= canv.width - my.r)&&(my.y >= my.r && my.y <= canv.height - my.r)),
		beforeLeft: (my.x < my.r),
		beforeRight: (my.x > canv.width - my.r),
		beforeTop: (my.y < my.r),
		beforeBottom: (my.y > canv.height - my.r)
	}
};
function randomPos(min = 0, max = 100) {
	// Random	
	return Math.floor(Math.random() * (max - min) + min);	
};
function eatPoint() {
	for (let i=0;i<points.length;i++) {
		if ((points[i].x > my.x - my.r/2 && points[i].x < my.x + my.r/2) &&
			(points[i].y > my.y - my.r/2 && points[i].y < my.y + my.r/2)) {
			pointSound.play();
			score += SSP;
			show_score.textContent = `SCORE: ${score}`;
			points[i].x = randomPos(25, canv.width - 25);
			points[i].y = randomPos(25, canv.height - 25);
		}
	}
};
function newGame() {
	localStorage.clear();
	window.location.reload();
};