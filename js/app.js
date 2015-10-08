//some global variable
"use strict";
var timeout = 200;
var miniMapScale = 15;
var width = 50;
var height = 30;
var margin = 10;
var realWidth = width+2*margin;
var realHeight = height+2*margin;
var map = new Array(realWidth);
var previousLiveCells = [];
var currentLiveCells = [];
var changedCells = [];
var gameStop = true;

// extended variable
var liveProbability = 0.1;
var surrounding = [[-2,0], [-1,0], [1,0], [2,0], [0,-2], [0,-1], [0,1], [0,2]];
var blocks = [];

//initialization operation
function init(){
	gameStop =true;
	blocks = [];
	previousLiveCells = [];
	currentLiveCells = [];
	changedCells = [];

	for (var i = 0; i < realWidth; i++){
		map[i] = new Array(realHeight);
		for (var j = 0; j < realHeight; j++){
			map[i][j] = 0;
		}
	}
}

//randomly set cell's initiation status respect the density
function randomProduction(){
	for(var i = 0; i < width; i++){
		for (var j = 0; j < height; j++){
			var x = i+margin;
			var y = j+margin;
			if(map[x][y] !== 0){
				continue;
			}else if (Math.random() <= liveProbability){
				map[x][y] = 8;
				previousLiveCells[previousLiveCells.length] = [x,y];
			}
		}
	}
	//console.log(previousLiveCells.length/width/height);
}

/*
	Game's Main Cycle
	including:update data in Map and living cells lists 
			draw living cells in next round
*/
function gameCycle(){
	updateMap();
	changedCells = [];
	previousLiveCells = currentLiveCells.slice();
	currentLiveCells.splice(0, currentLiveCells.length);
	drawCells();
	//console.log(previousLiveCells.length);
	if (gameStop === false)
		setTimeout(gameCycle, timeout);
}


function updateMap(){
	var length = previousLiveCells.length;
	for (var i = 0; i < length; i++){
		var x = previousLiveCells[i][0];
		var y = previousLiveCells[i][1];
		updateCell(x, y);
	}
	var clength = changedCells.length;
	for (i = 0; i < clength; i++){
		map[changedCells[i][0]][changedCells[i][1]] = 8 - map[changedCells[i][0]][changedCells[i][1]];
	}
}

//counting living cells around cell (x,y) and decide 
//whether it's dead or alive in next round
function updateCell(x, y){
	var sum = 0;
	var status =  map[x][y];

	//compute living cells around this cell
	//and add dead cells around to test whether they will be alive
	for (var i = 0; i < 8; i++){
		var nx = x+surrounding[i][0];
		var ny = y+surrounding[i][1];
		if (nx < 0 || nx >= realWidth || ny < 0 || ny >= realHeight){
			continue;
		}else{
			sum += map[nx][ny];
			if (status == 8){
				if (map[nx][ny] === 0){
					updateCell(nx, ny);
				}
			}
		}
	}
	if (sum >= 32 || sum < 16){ // more than 3 cells or less than 2 cells around
		if (status == 8){
			changedCells[changedCells.length] = [x, y];
		}
	}else if (sum >= 24){ // 3*8, three cells around
		if (status === 0){
			if (multiDimArraySearch(x,y,currentLiveCells) == -1){
				currentLiveCells[currentLiveCells.length] = [x, y];
				changedCells[changedCells.length] = [x, y];
			}
		}else{
			currentLiveCells[currentLiveCells.length] = [x, y];
		}
	}else if (sum >= 16){ // two cells around
		if (status == 8){
			currentLiveCells[currentLiveCells.length] = [x, y];
		}
	}
}

//every round we will redraw all the live cells
function drawCells(){
	var cells = $('#cells')[0];
	cells.width = width * miniMapScale + 1;	
	cells.height = height * miniMapScale + 1;
	var cxt = cells.getContext("2d");
	cxt.fillStyle = "rgb(255,0,0)";
	var length = previousLiveCells.length;
	for (var i = 0; i < length; i++){
		if (previousLiveCells[i][0] >= margin && previousLiveCells[i][1] >= margin){
			cxt.fillRect(
				(previousLiveCells[i][0]-margin) * miniMapScale+1,
				(previousLiveCells[i][1]-margin) * miniMapScale+1,
				miniMapScale-2,miniMapScale-2
			);
		}
	}
	if (length === 0){
		cxt.clearRect(0,0, width*miniMapScale, height*miniMapScale);
	}
}

//search an item in a two D array
function multiDimArraySearch(x, y, a){
	var length = a.length;
	for (var i = 0; i<length; i++){
		if (a[i][0] == x && a[i][1] == y)
			return i;
	}
	return -1;
}