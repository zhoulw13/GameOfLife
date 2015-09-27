function test(){
	/*
	//everyoneAlive(); 
	//chessboard();
	//easyCase();
	drawCells();

	var start = window.performance.now()
	gameStop = false;
	gameCycle();
	gameStop = true;
	var end = window.performance.now()
	alert(end-start);*/
}

// test 1
// every cell was alive at beginning and we will test the time game run a round
// result:~5ms
function everyoneAlive(){
	for (var i = 0; i < width; i++){
		for (var j = 0; j < height; j++){
			map[i+margin][j+margin] = 1;
			previousLiveCells[previousLiveCells.length] = [i+margin, j+margin];
		}
	}
}

// test 2
// dead cell and alive cell are alternately, like an (international) chessboard
// result:~6ms
function chessboard(){
	for (var i = 0; i < width; i++){
		for (var j = 0; j < height; j++){
			if (Math.abs(j-i)%2 == 1){
				map[i+margin][j+margin] = 1;
				previousLiveCells[previousLiveCells.length] = [i+margin, j+margin];
			}else{
				map[i+margin][j+margin] = 0;
			}
		}
	}	
}

//test 3
// some easy case: glider/exploder/gosper glider gun
// result: glider ~0.5ms / exploder ~0.6ms / gosper glider gun  ~2ms
function easyCase(){
	var glider = [[1,0], [2,1], [2,2], [1,2], [0,2]];
	var exploder = [[0,0], [0,1], [0,2], [0,3], [0,4], [2,0], [2,4], [4,0], [4,1], [4,2], [4,3], [4,4]];
	var gosperGliderGun = [[0,2], [0,3], [1,2], [1,3], [8,3], [8,4], [9,2], [9,4], [10,2], [10,3], [16,4], [16,5], [16,6], [17,4], [18,5], [22,1], [22,2], [23,0], [23,2], [24,0], [24,1], [24,12], [24,13], [25,12], [25,14], [26,12], [34,0], [34,1], [35,0], [35,1], [35,7], [35,8], [35,9], [36,7], [37,8]];

	previousLiveCells = glider.slice();
	var length = previousLiveCells.length;
	for (var i = 0; i < length; i++){
		previousLiveCells[i][0] = previousLiveCells[i][0] + margin + 10;
		previousLiveCells[i][1] = previousLiveCells[i][1] + margin + 5;
		map[previousLiveCells[i][0]][previousLiveCells[i][1]] = 1;
	}
}