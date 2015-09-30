//some global variable
var timeout = 200;
var miniMapScale = 15;
var width = 50;
var height = 30;
var margin = 10;
var realWidth = width+2*margin;
var realHeight = height+2*margin;
var map = new Array(realWidth);
var previousLiveCells = [];
var currentLiveCells = []
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
	$('#layout3').prop('onclick',null).off('click');
	$('#layout3').click(changeCellStatus);
	refreshParams();
	for (var i = 0; i < realWidth; i++){
		map[i] = new Array(realHeight);
		for (var j = 0; j < realHeight; j++){
			map[i][j] = 0;
		}
	}
	//clear before drawing
	$('#cells')[0].getContext("2d").clearRect(0,0, width*miniMapScale, height*miniMapScale);
	$('#blocks')[0].getContext("2d").clearRect(0,0, width*miniMapScale, height*miniMapScale);

	drawInitMap();
	adjustScreen();
}

//Listener to start
function start(){
	if (gameStop == true){
		$('#layout3').prop('onclick',null).off('click');
		//$('#layout3').click(function(){});
		gameStop = false;
		randomProduction();
		drawCells();
		gameCycle();
	}
}

//randomly set cell's initiation status respect the density
function randomProduction(){
	for(var i = 0; i < width; i++){
		for (var j = 0; j < height; j++){
			var x = i+margin;
			var y = j+margin;
			if(map[x][y] != 0){
				continue;
			}else if (Math.random() < liveProbability){
				map[x][y] = 8;
				previousLiveCells[previousLiveCells.length] = [x,y];
			}
		}
	}
	//console.log(previousLiveCells.length/width/height);
}

//Listener to refresh
function refreshParams(){
	//some changeble setting
	var speed = $('#speed');
	timeout = 1000 - parseInt(speed.val());
	var probability = $('#probability');
	liveProbability = parseFloat(probability.val());
	var scale = $('#scale');
	width = parseInt(scale.val());
	height = parseInt(width/5*3);
	realWidth = width+2*margin;
	realHeight = height+2*margin;
	miniMapScale = 750/width;
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
	for (var i = 0; i < clength; i++){
		map[changedCells[i][0]][changedCells[i][1]] = 1 - map[changedCells[i][0]][changedCells[i][1]];
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
		if (nx < 0 || nx > realWidth || ny < 0 || ny > realHeight){
			continue;
		}else{
			sum += map[nx][ny];
			if (status == 8){
				if (map[nx][ny] == 0){
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
		if (status == 0){
			if (multiDimArraySearch(x,y,currentLiveCells) == -1){
				currentLiveCells[currentLiveCells.length] = [x, y];
			}
		}else{
			currentLiveCells[currentLiveCells.length] = [x, y];
		}

		if (status == 0){
			changedCells[changedCells.length] = [x, y];
		}
	}else if (sum >= 16){ // two cells around
		if (status == 8){
			currentLiveCells[currentLiveCells.length] = [x, y];
		}
	}
}

//draw background and lines in the beginning
function drawInitMap(){
	var miniMap = $("#minimap")[0];
	miniMap.width = width * miniMapScale + 1;
	miniMap.height = height * miniMapScale + 1;
	var cxt = miniMap.getContext("2d");
	cxt.strokeStyle = "rgba(200,200,200,1)";
	for (var x=0;x<=width;x++) {
		cxt.moveTo(x * miniMapScale,0);
		cxt.lineTo(x * miniMapScale, height * miniMapScale);
		cxt.stroke();
	}
	for (var y=0;y<=height;y++) {
		cxt.moveTo(0, y * miniMapScale);
		cxt.lineTo(width * miniMapScale, y * miniMapScale);
		cxt.stroke();
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
	if (length == 0){
		cxt.clearRect(0,0, width*miniMapScale, height*miniMapScale);
	}
}

//draw blocks again at every click on the map
function drawBlocks(){
	var canvasblock = $('#blocks')[0];
	canvasblock.width = width * miniMapScale + 1;	
	canvasblock.height = height * miniMapScale + 1;
	var cxt = canvasblock.getContext("2d");
	cxt.fillStyle = "rgb(0,0,0)";
	var length = blocks.length;
	for (var i = 0; i < length; i++){
		cxt.fillRect(
			(blocks[i][0]) * miniMapScale+1,
			(blocks[i][1]) * miniMapScale+1,
			miniMapScale-2,miniMapScale-2
		);
	}
}

//listener on the mouse click event and changing the status of a cell
function changeCellStatus(e){
	//var e=arguments[0]||window.event;
    var x = parseInt((e.pageX - $('#layout2').offset().left)/miniMapScale);
	var y = parseInt((e.pageY - $('#layout2').offset().top)/miniMapScale);
	//console.log(x + ' ' + y);
	if (map[x][y] == 0){
		blocks[blocks.length] = [x, y];
	}else{
		var index = multiDimArraySearch(x,y, blocks);
        if (index > -1) {
        	blocks.splice(index, 1);
        }
	}
	map[x][y] = 1 - map[x][y];
	drawBlocks();
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


//setting on elements's position so that it can fit 
// screens with different resolution
function adjustScreen(){
	var layout1 = $("#layout1");
	var layout2 = $("#layout2");
	var layout3 = $("#layout3");
	var left = 	(document.body.clientWidth - width * miniMapScale - 1) / 2;
	var titleLeft = (document.body.clientWidth - 380 - 1) / 2;
	var top = "15%";
	layout1.css("left", left+"px");
	layout1.css("top", top);
	layout2.css("left", left+"px");
	layout2.css("top", top);
	layout3.css("left", left+"px");
	layout3.css("top", top);
	$('#title').css('left', titleLeft);
	$('#title').css('top', "3%");
	var tops = window.screen.height * 1;
}

window.onresize = adjustScreen;