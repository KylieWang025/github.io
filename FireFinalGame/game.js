
const levels = 	[

	//level 0
		["flag", "rock", "", "", "",
		"fenceside", "rock",  "", "", "rider",
		"", "tree", "animate", "animate", "animate",
		"", "water", "", "", "",
		"", "fenceup", "", "horseup", "",] ,
		
	//level 1
		[ "flag",  "water", "tree", "tree", "tree",
		"fenceside",  "water", "", "", "rider",
		"animate", "bridge animate", "animate", "animate", "animate",
		"", "water", "", "", "",
		"", "water", "horseup", "", "",],
	
	//level 2
		["tree", "", "", "rock", "flag",
		"", "water", "animate", "animate", "animate", 
		"fenceside", "water", "", "fenceup", "" , 
		"rider", "water", "", "water", "", 
		"horseup", "rock", "tree", "water", "", ],
	//level 3
		[ "tree","tree","flag","tree","tree",
		"animate", "animate", "animate", "animate", "animate",
		"water", "bridge", "water", "water", "water",
		"", "", "", "tree", "tree", 
		"rock", "rock", "rider", "", "horseup"],
	
	//level 4
	["", "animate", "animate", "animate", "",
	"fenceside", "rock", "tree", "rock", "",
	"", "water", "horseup", "water", "",
	"", "water", "rider", "water", "",
	"", "water", "water", "water", "flag",],
	
	//level 5
	["", "", "", "", "rider",
	"rock", "animate", "animate", "animate", "tree",
	"", "", "tree", "tree", "rock",
	"horseright", "", "tree", "flag", "",
	"", "", "water", "water", "water",],
	
	//level 6
	["horsedown", "tree", "tree", "tree", "tree",
	"rider", "tree", "tree", "tree", "tree",
	"tree", "tree", "tree", "tree", "tree",
	"water", "water", "rock", "animate", "animate",
	"water", "water", "rock", "", "flag",],
	
	//level of nothing to bring player when game is over
	["", "", "", "", "", 
	"", "", "", "", "", 
	"", "", "", "", "", 
	"", "", "", "", "", ]
	//end of levels
	];
const gridBoxes	= document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["rock", "tree", "water"];  
var currentLevel = 0; //starting level
var riderOn = false; //is rider on?
var currentLocationOfHorse = 0;
var currentAnimation;// alows 1 animation per level
var widthOfBoard = 5;

var burn = new sound("sound/burn.mp3");


//move player
document.addEventListener("keydown", function(e){
	
		switch(e.keyCode){
			case 37: //left arrow

					 if(currentLocationOfHorse % widthOfBoard !== 0){
						 tryToMove("left");
					 }
				
				break;
			case 38:// up arrow

					if(currentLocationOfHorse - widthOfBoard >= 0){
						 tryToMove("up");
					 }
				
				break;
			case 39://right arrow

					if(currentLocationOfHorse % widthOfBoard < widthOfBoard - 1){
						tryToMove("right");
					}
				
				break;
			case 40: //down arrow

					if(currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard){
						 tryToMove("down");
					 }
				
				break;
			case 87: // w
				fire("up", currentLocationOfHorse, currentLocationOfHorse);
				break;
			case 68: //d
				fire("right",currentLocationOfHorse, currentLocationOfHorse);
				break;
			case 65: // a
				fire("left",currentLocationOfHorse, currentLocationOfHorse);
				break;
			case 83: //s
				fire("down",currentLocationOfHorse,  currentLocationOfHorse);
				break;
		}//switch
	
});//key event listener

//try to move horse
function tryToMove (direction){
	
	//location before move
	let oldLocation = currentLocationOfHorse;
	
	//class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0;// location we wish to move
	let nextClass = ""; // class of location we wish to move to
	
	let nextLocation2 = 0;
	let nextClass2 = "";
	
	let newClass = ""; // new class to switch to if move successful
	switch (direction){
		case "left":
			 nextLocation = currentLocationOfHorse - 1;
			 break;
	    case "right":
			 nextLocation = currentLocationOfHorse + 1;
			 break;
		case "up":
			 nextLocation = currentLocationOfHorse - widthOfBoard;
			 break;	 
		case "down":
			 nextLocation = currentLocationOfHorse + widthOfBoard;
			 break;
	}//switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	// if the obstacle is not passable don't move
	if(noPassObstacles.includes(nextClass)){return;}//if
	
	//if it is the teleport to next level and player doesn't have fire don't move
	if(nextClass.includes("flag") && riderOn == false){return;}
	//if it is a fence, and there is no rider, don't move
	if(!riderOn && nextClass.includes("fence")){return;}
	
	
	// if it is a fence up but not jumping from up or down, don't move
	if(nextClass.includes("fenceup")&& (currentLocationOfHorse == nextLocation + widthOfBoard || currentLocationOfHorse == nextLocation - widthOfBoard)){
		
		return;
	}
	
	// if it is a fence side but not jumping from right or left don't move
	if(nextClass.includes("fenceside")&& (currentLocationOfHorse == nextLocation - 1 || currentLocationOfHorse == nextLocation + 1)){
		
		return;
	}
	
	// if there is a fence move stwo spaces with animation
	if(nextClass.includes("fence")){
		


		// rider must be on horse
		if(riderOn){
			gridBoxes[currentLocationOfHorse].className = "";
			oldClassName = gridBoxes[nextLocation].className;
			
			
			//set values according to direction
	
			if(direction == "left"){
				nextClass = "jumpleft";
				nextClass2 = "horseriderleft";
				nextLocation2 = nextLocation - 1;
			}else if (direction == "right"){
				nextClass = "jumpright";
				nextClass2 = "horseriderright";
				nextLocation2 = nextLocation + 1;
			}else if (direction == "up"){
				nextClass = "jumpup";
				nextClass2 = "horseriderup";
				nextLocation2 = nextLocation - widthOfBoard;
				
			}else if (direction == "down"){
				nextClass = "jumpdown";
				nextClass2 = "horseriderdown";
				nextLocation2 = nextLocation + widthOfBoard;
			}else{
				nextLocation2 = nextLocation;
			}
			
			
			// show horse jumping
			gridBoxes[nextLocation].className = nextClass;
			
			setTimeout(function() {
				
				//set jump back to just a fence
				gridBoxes[nextLocation].className = oldClassName;
				
				// update current location of horse to be 2 spaces past take off
				
				currentLocationOfHorse = nextLocation2;
				
				//get class of box after jump
				nextClass = gridBoxes[currentLocationOfHorse].className;
				
				// show horse and rider after landing
				gridBoxes[currentLocationOfHorse].className = nextClass2;
				
				// if next box is flag level up
				levelUp(nextClass);
			},350);

			return;
		}//if rider is on
		
	}//if class has fence
	
	
	//if there is a rider, add rider
	if(nextClass == "rider"){
		riderOn = true;

	}
	// if ther is a bridge in the old location keep it
	if(oldClassName.includes("bridge")){
		gridBoxes[oldLocation].className = "bridge";
	}else{
		gridBoxes[oldLocation].className = "";
	}//else
		
	// build name of new class
	newClass = (riderOn)? "horserider" : "horse";
	newClass += direction;
	
	// if there is a bridge in the next location keep it
	if(gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += " bridge";
	}
	//move 1 space
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	// if it is an enemy, end game
	if(nextClass.includes("enemy")){
		loseGame();
		return;
	}
	// if hit flag go to next level

	levelUp(nextClass);
}//tryToMove

//shoot a fireball in a direction
function fire(direction, currentLocationOfFire, oldLocation){
	//location before fire
	let firstLocation = "";

	let nextLocation = 0;// location/direction we wish to fire
	let nextClass = ""; // class of location/direction we wish to fire

	let nextLocation2 = 0;
	let nextClass2 = "";
	let newClass = ""; // new class to switch to if move successful
	let counter = 0;
	
	if(riderOn){
		
		//direction of fireball
		switch (direction){
		case "left":
			
			 nextLocation = currentLocationOfFire - 1;
			 break;
	    case "right":
			 nextLocation = currentLocationOfFire + 1;
			 break;
		case "up":
			 nextLocation = currentLocationOfFire - widthOfBoard;
			 break;	 
		case "down":
			 nextLocation = currentLocationOfFire + widthOfBoard;
			 break;
		}//switch
	
		//stop the fireball if it runs into a object that is not meant to be burned
		try{
						
						
			if(gridBoxes[nextLocation].className.includes("tree")){
				burn.play();
				
			}else if(gridBoxes[nextLocation].className.includes("fence") ||gridBoxes[nextLocation].className.includes("water") || gridBoxes[nextLocation].className.includes("rock") ||gridBoxes[nextLocation].className.includes("bridge")||gridBoxes[nextLocation].className.includes("flag")){
				
				//resets the board from any fireballs
				for(i = 0; i < gridBoxes.length; i++){
					if(gridBoxes[i].className.includes("fire")){

						gridBoxes[i].className = "";
					}
				}
				return;
			}
		}catch(err){
			
			//resets the board from any fireballs
			for(i = 0; i < gridBoxes.length; i++){
				if(gridBoxes[i].className.includes("fire")){

					gridBoxes[i].className = "";
				}
			}
			return;
		}	
			
			//set values according to direction
				if(direction == "left"){
					nextClass = "fireleft";
					nextLocation2 = nextLocation - 1;
				}else if (direction == "right"){
					nextClass = "fireright";
					
					nextLocation2 = nextLocation + 1;
				}else if (direction == "up"){
					nextClass = "fireup";
					
					nextLocation2 = nextLocation - widthOfBoard;
					
				}else if (direction == "down"){
					nextClass = "firedown";
					
					nextLocation2 = nextLocation + widthOfBoard;
				}else{
					nextLocation2 = nextLocation;
				}
				
				// show fire
				if(currentLocationOfHorse % 5 == 4 && direction == "right"  ){
					return;
				}else if(currentLocationOfHorse % 5 == 0 && direction == "left"){
					return;
				}
					try{
					gridBoxes[nextLocation].className = nextClass;
					}catch(err){
						for(i = 0; i < gridBoxes.length; i++){
							if(gridBoxes[i].className.includes("fire")){

								gridBoxes[i].className = "";
							}
						}
						return;
					}
				}else{
					return;
				}
				if(direction == "right"){
					oldLocation = currentLocationOfFire;
					if(!gridBoxes[oldLocation].className.includes("horse")){
						gridBoxes[oldLocation].className = "";
					}//if
				
					try{
						setTimeout (function(){
						currentLocationOfFire = nextLocation;
						altFire(direction, currentLocationOfFire);
						},350);
					}catch(err){
						setTimeout (function(){
							
							//resets the board from any fireballs
							for(i = 0; i < gridBoxes.length; i++){
								if(gridBoxes[i].className.includes("fire")){

									gridBoxes[i].className = "";
								}//for
							}
						},350);
					}//catch	
					
				}else if(direction == "left"){
					
					
					oldLocation = currentLocationOfFire;
					if(!gridBoxes[oldLocation].className.includes("horse")){
						gridBoxes[oldLocation].className = "";
					}

					if(currentLocationOfFire != 1 && currentLocationOfFire != 6 && currentLocationOfFire != 11 && currentLocationOfFire != 16 && currentLocationOfFire != 21 ){
						setTimeout (function(){
						currentLocationOfFire = nextLocation;
						altFire(direction, currentLocationOfFire);
						},350);
					}else{
						setTimeout (function(){
							for(i = 0; i < gridBoxes.length; i++){
								
								if(gridBoxes[i].className.includes("fire")){

									gridBoxes[i].className = "";
								}
							}
						},350);
					}	
					
					
				}else if(direction == "down"){
					oldLocation = currentLocationOfFire;
					if(!gridBoxes[oldLocation].className.includes("horse")){
						gridBoxes[oldLocation].className = "";
					}
					setTimeout (function(){
					currentLocationOfFire = nextLocation;
					altFire(direction, currentLocationOfFire);
					},350);
					
				}else if(direction == "up"){
					oldLocation = currentLocationOfFire;
					if(!gridBoxes[oldLocation].className.includes("horse")){
						gridBoxes[oldLocation].className = "";
					}
					setTimeout (function(){
					currentLocationOfFire = nextLocation;
					altFire(direction, currentLocationOfFire);
					},350);
					
				}

						
			
	
}//fire

// alternately draws fireball with function fire, since you cannot call a method in itself
function altFire(direction, currentLocationOfFire, oldLocation){

	//location before fire
	let firstLocation = "";
	
	//class of location before move
	//let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0;
	
	let nextClass = ""; // class of location/direction we wish to fire
	
	let nextLocation2 = 0;
	let nextClass2 = "";
	let newClass = ""; // new class to switch to if move successful
	let counter = 0;
	
	if(riderOn){
		switch (direction){
		case "left":

			 nextLocation = currentLocationOfFire - 1;
			 break;
	    case "right":
			 nextLocation = currentLocationOfFire + 1;
			 break;
		case "up":
			 nextLocation = currentLocationOfFire - widthOfBoard;
			 break;	 
		case "down":
			 nextLocation = currentLocationOfFire + widthOfBoard;
			 break;
		}//switch
		
		//stops fireball if hit object that is not meant to be burned
		try{
						
						
			if(gridBoxes[nextLocation].className.includes("tree")){
				burn.play();
			}else if(gridBoxes[nextLocation].className.includes("fence") ||gridBoxes[nextLocation].className.includes("water") || gridBoxes[nextLocation].className.includes("rock") ||gridBoxes[nextLocation].className.includes("bridge")||gridBoxes[nextLocation].className.includes("flag")){
				for(i = 0; i < gridBoxes.length; i++){
					if(gridBoxes[i].className.includes("fire")){

						gridBoxes[i].className = "";
					}
				}
				return;
			}
		}catch(err){
			for(i = 0; i < gridBoxes.length; i++){
				if(gridBoxes[i].className.includes("fire")){

					gridBoxes[i].className = "";
				}
			}
			return;
		}	

			//set values according to direction

				
				if(direction == "left"){
					nextClass = "fireleft";
					nextLocation2 = nextLocation - 1;
				}else if (direction == "right"){
					nextClass = "fireright";
					
					nextLocation2 = nextLocation + 1;
				}else if (direction == "up"){
					nextClass = "fireup";
					
					nextLocation2 = nextLocation - widthOfBoard;
					
				}else if (direction == "down"){
					nextClass = "firedown";
					
					nextLocation2 = nextLocation + widthOfBoard;
				}else{
					nextLocation2 = nextLocation;
				}
				
					
					// show fire
					try{
					gridBoxes[nextLocation].className = nextClass;
					}catch(err){
						
						for(i = 0; i < gridBoxes.length; i++){
							if(gridBoxes[i].className.includes("fire")){

								gridBoxes[i].className = "";
							}
						}
						return;
					}
					if(direction == "right"){
						oldLocation = currentLocationOfFire;
						if(!gridBoxes[oldLocation].className.includes("horse")){
							gridBoxes[oldLocation].className = "";
						}
						if(currentLocationOfFire != 3 && currentLocationOfFire != 8 && currentLocationOfFire != 13 && currentLocationOfFire != 18 && currentLocationOfFire != 23){
							setTimeout (function(){
							currentLocationOfFire = nextLocation;
							altFire(direction, currentLocationOfFire);
							},350);
						}else{
							setTimeout (function(){
								for(i = 0; i < gridBoxes.length; i++){
									if(gridBoxes[i].className.includes("fire")){

										gridBoxes[i].className = "";
									}
								}
							},350);
						}	
					}
					else if(direction == "left"){
					
						oldLocation = currentLocationOfFire;
						gridBoxes[oldLocation].className = "";
						currentLocationOfFire = nextLocation - 2;
						if(currentLocationOfFire != 3 && currentLocationOfFire != 8 && currentLocationOfFire != 13 && currentLocationOfFire != 18 &&currentLocationOfFire != 23){
							setTimeout (function(){
							currentLocationOfFire = nextLocation;
							fire(direction, currentLocationOfFire);
							},350);
						}else{
							setTimeout (function(){
								for(i = 0; i < gridBoxes.length; i++){
									if(gridBoxes[i].className.includes("fire")){

										gridBoxes[i].className = "";
									}
								}
							},350);
						}
					}else if(direction == "down"){
						oldLocation = currentLocationOfFire;
						gridBoxes[oldLocation].className = "";
						setTimeout (function(){
						currentLocationOfFire = nextLocation;
						fire(direction, currentLocationOfFire);
						},350);
					
					}else if(direction == "up"){
						oldLocation = currentLocationOfFire;
						gridBoxes[oldLocation].className = "";
						setTimeout (function(){
						currentLocationOfFire = nextLocation;
						fire(direction, currentLocationOfFire);
						},350);
						
					}
					

						
							
								
			
			
	}//if rider is on
	return;
}//fire

//move up a level
function levelUp(nextClass){
	if(nextClass == "flag" && riderOn == true){
		document.getElementById("levelup").style.display = "block";
		clearTimeout(currentAnimation);
		setTimeout (function(){
			document.getElementById("levelup").style.display = "none";
			if(currentLevel < 6){
				currentLevel++;
			}else{
				stopGame();
			}
		
		loadLevel();
		},1000);
		
	}//if
}

//stop the game after winning and brings up continue menu
function stopGame(){
	//puts horse to a place that enemy cannot touch
	document.getElementById("gameBoard").style.display = "none";
	document.getElementById("reasonlost").style.display = "none";
	document.getElementById("menu").style.display = "block";
	document.getElementById("retry").style.display = "block";
	document.getElementById("retry").style.marginTop = "10%";
	document.getElementById("backmenu").style.display = "block";
	document.getElementById("menu").innerHTML = "Win!";
	
}
// stops the game after losing and brings up the continue menu;
function loseGame(){
	document.getElementById("gameBoard").style.display = "none";
	document.getElementById("reasonlost").style.display = "block";
	document.getElementById("menu").style.display = "block";
	document.getElementById("retry").style.display = "block";
	document.getElementById("retry").style.marginTop = "2%";
	document.getElementById("backmenu").style.display = "block";
	document.getElementById("menu").innerHTML = "Lost";
	document.getElementById("start").style.display = "none";
	document.getElementById("instructions").style.display = "none";
}

//loads levels 0 - maxlevel
function loadLevel(){

	let levelMap = levels[currentLevel];
	let animateBoxes;
	riderOn = false;

	//load board
	clearTimeout(currentAnimation);
	for (i = 0; i < gridBoxes.length; i++){
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("horse")) currentLocationOfHorse = i;
	}//for
	
	animateBoxes = document.querySelectorAll(".animate");
	animateEnemy(animateBoxes, 0, "down");
}//loadlevel



//animate enemy left to right up to down 
//boxes - array of grid boxes that include animation
//index - current location of animation
//direction - current direction of animation
function animateEnemy(boxes, index, direction){
	//exit function if no animation
	if(boxes.length <= 0) {return};
	

	//update images
	
	if(direction == "right"){
		boxes[index].classList.add("enemyright");
	}else {
		boxes[index].classList.add("enemyleft");
	}
	
	// if run into player end game
	
	if(boxes[index].className.includes("horse")){
		loseGame();
	}//if
	//remove images from other boxes
	for(i = 0; i< boxes.length; i++){
		if (i != index){
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");
		
		}
	}//for
	
	//moving right

	if(direction == "right"){
		//turn around if hit right side
		if(index == boxes.length - 1){
			index--;
			direction = "left";
		}else{
			index++;
		}
		//moving left
	}else {
		//turn around if hit left side
		if(index == 0){
			index++;
			direction = "right";
		}else{
			index--;
		}
	
	}
	currentAnimation = setTimeout(function(){
		animateEnemy(boxes, index, direction);
	},750);
}//animate enemy

// start the game after the start button is pressed, brings player to the game
function startGame(){
	clearTimeout(currentAnimation);
	document.getElementById("menu").innerHTML = "F I R E"
	document.getElementById("menu").style.display = "block";
	document.getElementById("start").style.display = "none";
	document.getElementById("instructions").style.display = "none";
	document.getElementById("retry").style.display = "none";
	document.getElementById("backmenu").style.display = "none";
	document.getElementById("reasonlost").style.display = "none";
	document.getElementById("instructionstext").style.display = "none";
	document.getElementById("gameBoard").style.display = "grid";
	currentLevel = 0;
	loadLevel();
	
}

// displays instructions if the instruction button is pressed
function instructions(){
	document.getElementById("gameBoard").style.display = "none";
	document.getElementById("instructions").style.display = "none";
	document.getElementById("start").style.display = "block";
	document.getElementById("start").style.display = "block";
	document.getElementById("menu").innerHTML = "Instructions";
	document.getElementById("menu").style.display = "block";
	document.getElementById("instructionstext").style.display = "block";
}

function bringMenu(){
	// creates a level of nothing so horse cannot die on menu
	currenLevel = 7;
	loadLevel();
	document.getElementById("retry").style.display = "none";
	document.getElementById("backmenu").style.display = "none";
	document.getElementById("reasonlost").style.display = "none";
	document.getElementById("menu").innerHTML = "F I R E";
	document.getElementById("start").style.display = "block";
	document.getElementById("instructions").style.display = "block";
}

//object constructor to play sounds
//https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

