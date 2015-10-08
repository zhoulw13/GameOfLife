function initDraw(){
	$('#layout3').prop('onclick',null).off('click');
	$('#layout3').click(changeCellStatus);
	refreshParams();

		//clear before drawing
	$('#cells')[0].getContext("2d").clearRect(0,0, width*miniMapScale, height*miniMapScale);
	$('#blocks')[0].getContext("2d").clearRect(0,0, width*miniMapScale, height*miniMapScale);

	drawInitMap();
	adjustScreen();
	window.onresize = adjustScreen;
}

//Listener to start
function start(){
	if (gameStop === true){
		$('#layout3').prop('onclick',null).off('click');
		gameStop = false;
		randomProduction();
		drawCells();
		gameCycle();
	}
}

//Listener to refresh
function refresh(){
	init()
	initDraw()
}

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

//draw background and lines in the beginning
function drawInitMap(){
	var miniMap = $("#minimap")[0];
	miniMap.width = width * miniMapScale + 1;
	miniMap.height = height * miniMapScale + 1;

	var cells = $('#cells')[0];
	cells.width = width * miniMapScale + 1;	
	cells.height = height * miniMapScale + 1;
	
	var canvasblock = $('#blocks')[0];
	canvasblock.width = width * miniMapScale + 1;	
	canvasblock.height = height * miniMapScale + 1;

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

//listener on the mouse click event and changing the status of a cell
function changeCellStatus(e){
	//var e=arguments[0]||window.event;
    var x = parseInt((e.pageX - $('#layout2').offset().left)/miniMapScale);
	var y = parseInt((e.pageY - $('#layout2').offset().top)/miniMapScale);
	//console.log(x + ' ' + y);
	if (map[x][y] === 0){
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