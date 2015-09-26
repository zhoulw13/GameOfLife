//some global variable
var timeout = 200;
var miniMapScale = 15;
var width = 40;
var height = 30;
var margin = 5;
var realWidth = width+2*margin;
var realHeight = height+2*margin;
var map = new Array(realWidth);
var previousLiveCells = [];
var currentLiveCells = []
var changedCells = [];
var gameStop = true;

function init(){
	for (var i = 0; i < realWidth; i++){
		map[i] = new Array(realHeight);
		for (var j = 0; j < realHeight; j++){
			map[i][j] = 0;
		}
	}
	drawInitMap();
	adjustScreen();

	var speed = $('#speed');
	timeout = 1000 - parseInt(speed.val());
	speed.on('change', speedListener);
	speed.on('input', speedListener);
}

function control(){
	if(gameStop === true){
		gameStop = false;
		gameCycle();
		$('#control').html('Stop');
	}else{
		gameStop = true;
		$('#control').html('Start');
	}
}

function clearCells(){
	for (var i = 0; i < realWidth; i++){
		for (var j = 0; j < realHeight; j++){
			map[i][j] = 0;
		}
	}
	previousLiveCells.splice(0, previousLiveCells.length);
	drawCells();	
}

function gameCycle(){
	updateMap();
	drawCells();
	changedCells = [];
	previousLiveCells = currentLiveCells.slice();
	currentLiveCells.splice(0, currentLiveCells.length);
	console.log(previousLiveCells.length);
	if (gameStop === false)
		setTimeout(gameCycle, timeout);
}

function updateMap(){
	var length = previousLiveCells.length;
	for (var i = 0; i < length; i++){
		var x = previousLiveCells[i][0];
		var y = previousLiveCells[i][1];
		nineCellCases(x, y);
	}
	var clength = changedCells.length;
	for (var i = 0; i < clength; i++){
		map[changedCells[i][0]][changedCells[i][1]] = 1 - map[changedCells[i][0]][changedCells[i][1]];
	}
}

//9 different cell cases
function nineCellCases(x, y){
	switch(x){
	case 0:
		switch(y){
		case 0: // 1
			updateCell([[1, 0], [0, 1], [1, 1]], x, y);
			break;
		case realHeight-1: // 2
			updateCell([[-1, 0], [0, -1], [-1, -1]], x, y);
			break;
		default: // 3
			updateCell([[0, -1], [1, -1], [1, 0], [1, 1], [0, 1]], x, y);
			break;
		}
		break;
	case realWidth-1:
		switch(y){
		case 0: // 4
			updateCell([[-1, 0], [-1, 1], [0, 1]], x, y);
			break;
		case realHeight-1: // 5
			updateCell([[-1, 0], [-1, -1], [0, -1]], x, y);
			break;
		default: // 6
			updateCell([[0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]], x, y);
			break;
		}
		break;
	default:
		switch(y){
		case 0: // 7
			updateCell([[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0]], x, y);
			break;
		case realHeight-1: // 8
			updateCell([[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0]], x, y);
			break;
		default: // 9
			updateCell([[-1,-1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]], x, y);
			break;
		}
		break;
	}
}

function updateCell(surround, x, y){
	var length = surround.length;
	var sum = 0;
	var state =  map[x][y];
	for (var i = 0; i < length; i++){
		sum += map[x+surround[i][0]][y+surround[i][1]];
		if (map[x][y] == 1){
			if (map[x+surround[i][0]][y+surround[i][1]] == 0){
				nineCellCases(x+surround[i][0], y+surround[i][1]);
			}
		}
	}
	switch(sum){
	case 3:
		if (state == 0){
			if (multiDimArraySearch(x,y,currentLiveCells) == -1){
				currentLiveCells[currentLiveCells.length] = [x, y];
			}
		}else{
			currentLiveCells[currentLiveCells.length] = [x, y];
		}
		if (state == 0){
			changedCells[changedCells.length] = [x, y];
		}
		break;
	case 2:
		if (state == 1){
			currentLiveCells[currentLiveCells.length] = [x, y];
		}
		break;
	default:
		if (state == 1){
			changedCells[changedCells.length] = [x, y];
		}
		break;
	}
}

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

function drawCells(){
	var cells = $('#cells')[0];
	cells.width = width * miniMapScale + 1;	
	cells.height = height * miniMapScale + 1;
	var cxt = cells.getContext("2d");
	cxt.fillStyle = "rgb(255,0,0)";
	var length = previousLiveCells.length;
	for (var i = 0; i < length; i++){
		cxt.fillRect(
			(previousLiveCells[i][0]-margin) * miniMapScale+1,
			(previousLiveCells[i][1]-margin) * miniMapScale+1,
			miniMapScale-2,miniMapScale-2
		);
	}
	if (length == 0){
		cxt.clearRect(0,0, width*miniMapScale, height*miniMapScale);
	}
}

function changeCellStatus(){
	var e=arguments[0]||window.event;
    var x = parseInt((e.pageX - $('#layout2').offset().left)/miniMapScale)+margin;
	var y = parseInt((e.pageY - $('#layout2').offset().top)/miniMapScale)+margin;
	if (map[x][y] == 0){
		previousLiveCells[previousLiveCells.length] = [x, y];
	}else{
		var index = multiDimArraySearch(x,y, previousLiveCells);
        if (index > -1) {
        	previousLiveCells.splice(index, 1);
        }
	}
	map[x][y] = 1 - map[x][y];
	drawCells();
}

function multiDimArraySearch(x, y, a){
	var length = a.length;
	for (var i = 0; i<length; i++){
		if (a[i][0] == x && a[i][1] == y)
			return i;
	}
	return -1;
}

function adjustScreen(){
	var layout1 = $("#layout1");
	var layout2 = $("#layout2");
	var left = 	(document.body.clientWidth - width * miniMapScale - 1) / 2;
	var titleLeft = (document.body.clientWidth - 380 - 1) / 2;
	var top = "15%";
	layout1.css("left", left+"px");
	layout1.css("top", top);
	layout2.css("left", left+"px");
	layout2.css("top", top);
	$('#title').css('left', titleLeft);
	$('#title').css('top', "3%");
	var tops = window.screen.height * 1;
}

window.onresize = adjustScreen;

function speedListener(){
	var speed = $('#speed');
	timeout = 1000 - parseInt(speed.val());
}
